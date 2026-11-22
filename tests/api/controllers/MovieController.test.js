import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../api/services/tmdb.js', () => ({
  getPopularMovies: vi.fn(),
  getMoviesByCategories: vi.fn(),
  getMoviesSorted: vi.fn(),
  getMovieGenres: vi.fn()
}))

import { getMovies } from '../../../api/controllers/MovieController.js'
import {
  getPopularMovies,
  getMoviesByCategories,
  getMoviesSorted
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
