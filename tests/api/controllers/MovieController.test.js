import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../api/services/tmdb.js', () => ({
  getPopularMovies: vi.fn(),
  getMoviesByCategories: vi.fn(),
  getMoviesSorted: vi.fn(),
  getMovieGenres: vi.fn(),
  getMovieSuggestions: vi.fn()
}))

import { getMovies, suggestMovies } from '../../../api/controllers/MovieController.js'
import {
  getPopularMovies,
  getMoviesByCategories,
  getMoviesSorted,
  getMovieSuggestions
} from '../../../api/services/tmdb.js'

const PAGE = { results: [], page: 1, totalPages: 1 }

const run = async (query) => {
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
  const next = vi.fn()

  await getMovies({ query }, res, next)
  return { res, next }
}

describe('getMovies', () => {
  beforeEach(() => {
    getPopularMovies.mockReset().mockResolvedValue(PAGE)
    getMoviesByCategories.mockReset().mockResolvedValue(PAGE)
    getMoviesSorted.mockReset().mockResolvedValue(PAGE)
  })

  it('default uses popular', async () => {
    const { res } = await run({})

    expect(getPopularMovies).toHaveBeenCalledWith(20, 1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(PAGE)
  })

  it('page', async () => {
    await run({ page: '3' })

    expect(getPopularMovies).toHaveBeenCalledWith(20, 3)
  })

  it('sort without genres', async () => {
    await run({ sort: 'vote_average.desc', page: '2' })

    expect(getMoviesSorted).toHaveBeenCalledWith({ limit: 20, page: 2, sortBy: 'vote_average.desc' })
    expect(getPopularMovies).not.toHaveBeenCalled()
  })

  it('genres with sort', async () => {
    await run({ genres: 'Kauhu', sort: 'primary_release_date.desc' })

    expect(getMoviesByCategories).toHaveBeenCalledWith('Kauhu', {
      limit: 20,
      page: 1,
      sortBy: 'primary_release_date.desc',
      match: 'or'
    })
  })

  it.each([
    [{ page: '0' }],
    [{ page: '501' }],
    [{ page: 'x' }],
    [{ sort: 'random' }],
    [{ limit: '21' }]
  ])('invalid %j', async (query) => {
    const { res, next } = await run(query)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }))
    expect(res.json).not.toHaveBeenCalled()
  })
})

describe('suggestMovies', () => {
  const SUGGESTIONS = { results: [{ id: 1, title: 'Movie 1' }] }

  const runSuggest = async (query) => {
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
    const next = vi.fn()

    await suggestMovies({ query }, res, next)
    return { res, next }
  }

  beforeEach(() => {
    getMovieSuggestions.mockReset().mockResolvedValue(SUGGESTIONS)
  })

  it('returns suggestions', async () => {
    const { res } = await runSuggest({ q: 'matrix', limit: '6' })

    expect(getMovieSuggestions).toHaveBeenCalledWith('matrix', { limit: 6 })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(SUGGESTIONS)
  })

  it('default limit', async () => {
    await runSuggest({ q: 'matrix' })

    expect(getMovieSuggestions).toHaveBeenCalledWith('matrix', { limit: 20 })
  })

  it.each([
    [{}],
    [{ q: '   ' }],
    [{ q: 'matrix', limit: '0' }],
    [{ q: 'matrix', limit: '21' }],
    [{ q: 'matrix', limit: 'x' }]
  ])('invalid %j', async (query) => {
    const { res, next } = await runSuggest(query)

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }))
    expect(getMovieSuggestions).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('passes service errors to next', async () => {
    const error = Object.assign(new Error('tmdb'), { status: 502 })
    getMovieSuggestions.mockRejectedValue(error)

    const { res, next } = await runSuggest({ q: 'matrix' })

    expect(next).toHaveBeenCalledWith(error)
    expect(res.json).not.toHaveBeenCalled()
  })
})
