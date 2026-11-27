import { beforeEach, describe, expect, it, vi } from 'vitest'

const { get } = vi.hoisted(() => ({ get: vi.fn() }))

vi.mock('axios', () => ({
  default: { create: () => ({ get }) }
}))

const GENRES = {
  genres: [
    { id: 27, name: 'Kauhu' },
    { id: 35, name: 'Komedia' }
  ]
}

const ENGLISH = {
  genres: [
    { id: 27, name: 'Horror' },
    { id: 35, name: 'Comedy' },
    { id: 878, name: 'Science Fiction' }
  ]
}

const movie = (id) => ({
  id,
  title: `Movie ${id}`,
  overview: 'Overview',
  poster_path: `/poster-${id}.jpg`,
  release_date: '2026-01-01',
  vote_average: 7.5,
  genre_ids: [27]
})

const mapped = (id) => ({
  id,
  title: `Movie ${id}`,
  overview: 'Overview',
  posterPath: `/poster-${id}.jpg`,
  releaseDate: '2026-01-01',
  voteAverage: 7.5,
  genreIds: [27]
})

const resultsFor = (url, params) => {
  if (url === '/genre/movie/list') return params.language === 'en-US' ? ENGLISH : GENRES
  if (url === '/discover/movie') return { results: [movie(3), movie(4)], total_pages: 3 }
  if (url === '/movie/popular') return { results: [movie(1), movie(2)], total_pages: 900 }
  if (url === '/search/movie') return { results: [movie(5), movie(6), movie(7)] }
  return { results: [] }
}

const loadService = async (env = {}) => {
  vi.resetModules()
  get.mockReset()
  get.mockImplementation((url, { params }) => Promise.resolve({ data: resultsFor(url, params) }))

  process.env.TMDB_KEY = 'test-key'
  process.env.TMDB_LANGUAGE = 'fi-FI'
  Object.assign(process.env, env)

  return import('../../../api/services/tmdb.js')
}

const paramsOf = (url) => get.mock.calls.filter(([called]) => called === url).at(-1)[1].params

const discoverCalls = () => get.mock.calls.filter(([url]) => url === '/discover/movie')

const genreCalls = () => get.mock.calls.filter(([url]) => url === '/genre/movie/list')

const popularCalls = () => get.mock.calls.filter(([url]) => url === '/movie/popular')

describe('getMovieGenres', () => {
  let service

  beforeEach(async () => {
    service = await loadService()
  })

  it('genres', async () => {
    await expect(service.getMovieGenres()).resolves.toEqual(GENRES.genres)
  })

  it('cache', async () => {
    await service.getMovieGenres()
    await service.getMovieGenres()

    expect(paramsOf('/genre/movie/list').language).toBe('en-US')
    expect(genreCalls().map(([, { params }]) => params.language).sort()).toEqual(['en-US', 'fi-FI'])
    expect(genreCalls()).toHaveLength(2)
  })
})

describe('getMoviesByCategories', () => {
  let service

  beforeEach(async () => {
    service = await loadService()
  })

  it('finnish name', async () => {
    const movies = await service.getMoviesByCategories('kauhu')

    expect(paramsOf('/discover/movie').with_genres).toBe('27')
    expect(movies).toEqual({ results: [mapped(3), mapped(4)], page: 1, totalPages: 3 })
  })

  it('page', async () => {
    const movies = await service.getMoviesByCategories('kauhu', { page: 2 })

    expect(paramsOf('/discover/movie').page).toBe(2)
    expect(movies.page).toBe(2)
  })

  it('english name', async () => {
    await service.getMoviesByCategories('Science Fiction')

    expect(paramsOf('/discover/movie').with_genres).toBe('878')
  })

  it('slug and id', async () => {
    await service.getMoviesByCategories('science-fiction')
    expect(paramsOf('/discover/movie').with_genres).toBe('878')

    await service.getMoviesByCategories('35')
    expect(paramsOf('/discover/movie').with_genres).toBe('35')
  })

  it('or', async () => {
    await service.getMoviesByCategories(['kauhu', 'komedia'])

    expect(paramsOf('/discover/movie').with_genres).toBe('27|35')
  })

  it('and', async () => {
    await service.getMoviesByCategories('kauhu,komedia', { match: 'and' })

    expect(paramsOf('/discover/movie').with_genres).toBe('27,35')
  })

  it('limit', async () => {
    const movies = await service.getMoviesByCategories('kauhu', { limit: 1 })

    expect(movies.results).toEqual([mapped(3)])
  })

  it('unknown category', async () => {
    await expect(service.getMoviesByCategories('kauhu,scifi')).rejects.toMatchObject({ status: 400 })
    expect(discoverCalls()).toHaveLength(0)
  })

  it('empty categories', async () => {
    await expect(service.getMoviesByCategories('')).rejects.toMatchObject({ status: 400 })
  })
})

describe('discover cache', () => {
  it('same query', async () => {
    const service = await loadService()

    await service.getMoviesByCategories('kauhu')
    await service.getMoviesByCategories('kauhu')

    expect(discoverCalls()).toHaveLength(1)
  })

  it('different page or sort', async () => {
    const service = await loadService()

    await service.getMoviesByCategories('kauhu')
    await service.getMoviesByCategories('kauhu', { page: 2 })
    await service.getMoviesByCategories('kauhu', { sortBy: 'vote_average.desc' })

    expect(discoverCalls()).toHaveLength(3)
  })
})

describe('getMoviesSorted', () => {
  let service

  beforeEach(async () => {
    service = await loadService()
  })

  it('no genres', async () => {
    const movies = await service.getMoviesSorted({ sortBy: 'vote_average.desc' })

    expect(paramsOf('/discover/movie')).not.toHaveProperty('with_genres')
    expect(paramsOf('/discover/movie').sort_by).toBe('vote_average.desc')
    expect(movies.results).toEqual([mapped(3), mapped(4)])
  })

  it('best rated needs votes', async () => {
    await service.getMoviesSorted({ sortBy: 'vote_average.desc' })

    expect(paramsOf('/discover/movie')['vote_count.gte']).toBe(200)
  })

  it('newest skips unreleased', async () => {
    await service.getMoviesSorted({ sortBy: 'primary_release_date.desc' })

    expect(paramsOf('/discover/movie')['primary_release_date.lte']).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('popularity has no guards', async () => {
    await service.getMoviesSorted({ sortBy: 'popularity.desc' })

    expect(paramsOf('/discover/movie')).not.toHaveProperty('vote_count.gte')
    expect(paramsOf('/discover/movie')).not.toHaveProperty('primary_release_date.lte')
  })

  it('cache', async () => {
    await service.getMoviesSorted({ sortBy: 'vote_average.desc' })
    await service.getMoviesSorted({ sortBy: 'vote_average.desc' })

    expect(discoverCalls()).toHaveLength(1)
  })
})

describe('getMovieSuggestions', () => {
  let service

  const searchCalls = () => get.mock.calls.filter(([url]) => url === '/search/movie')

  beforeEach(async () => {
    service = await loadService()
  })

  it('returns mapped movies with limit', async () => {
    const data = await service.getMovieSuggestions('matrix', { limit: 2 })

    expect(paramsOf('/search/movie').query).toBe('matrix')
    expect(paramsOf('/search/movie').include_adult).toBe(false)
    expect(data).toEqual({ results: [mapped(5), mapped(6)] })
  })

  it('empty query', async () => {
    await expect(service.getMovieSuggestions('   ')).rejects.toMatchObject({ status: 400 })
    expect(searchCalls()).toHaveLength(0)
  })

  it('cache', async () => {
    await service.getMovieSuggestions('matrix', { limit: 2 })
    await service.getMovieSuggestions('matrix', { limit: 3 })

    expect(searchCalls()).toHaveLength(1)
  })

  it('tmdb error', async () => {
    get.mockRejectedValueOnce({ response: { status: 500 } })

    await expect(service.getMovieSuggestions('matrix')).rejects.toMatchObject({ status: 502 })
  })
})

describe('getPopularMovies', () => {
  let service

  beforeEach(async () => {
    service = await loadService()
  })

  it('cache', async () => {
    await service.getPopularMovies(1)
    await service.getPopularMovies(2)

    expect(popularCalls()).toHaveLength(1)
  })

  it('page', async () => {
    await service.getPopularMovies(20, 1)
    await service.getPopularMovies(20, 2)

    expect(popularCalls()).toHaveLength(2)
    expect(paramsOf('/movie/popular').page).toBe(2)
  })

  it('total pages capped', async () => {
    const movies = await service.getPopularMovies()

    expect(movies.totalPages).toBe(500)
  })

  it('tmdb error', async () => {
    get.mockRejectedValueOnce({ response: { status: 500 } })

    await expect(service.getPopularMovies()).rejects.toMatchObject({ status: 502 })
  })

  it('network error', async () => {
    get.mockRejectedValueOnce(new Error('timeout'))

    await expect(service.getPopularMovies()).rejects.toMatchObject({ status: 504 })
  })
})

describe('api key', () => {
  it('503', async () => {
    const service = await loadService({ TMDB_KEY: '' })

    await expect(service.getMovieGenres()).rejects.toMatchObject({ status: 503 })
    expect(get).not.toHaveBeenCalled()
  })
})
