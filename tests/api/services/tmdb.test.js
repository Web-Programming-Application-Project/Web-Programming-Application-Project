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
  if (url === '/discover/movie') return { results: [movie(3), movie(4)] }
  if (url === '/movie/popular') return { results: [movie(1), movie(2)] }
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
    expect(movies).toEqual([mapped(3), mapped(4)])
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
    await expect(service.getMoviesByCategories('kauhu', { limit: 1 })).resolves.toEqual([mapped(3)])
  })

  it('unknown category', async () => {
    await expect(service.getMoviesByCategories('kauhu,scifi')).rejects.toMatchObject({ status: 400 })
    expect(discoverCalls()).toHaveLength(0)
  })

  it('empty categories', async () => {
    await expect(service.getMoviesByCategories('')).rejects.toMatchObject({ status: 400 })
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
