import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../api/models/List.js', () => ({
  createList: vi.fn(),
  findListsByOwner: vi.fn(),
  findListById: vi.fn(),
  findListItems: vi.fn(),
  addListItem: vi.fn()
}))

vi.mock('../../../api/services/tmdb.js', () => ({
  getMovieDetails: vi.fn()
}))

import {
  findListById,
  findListItems,
  addListItem as addListItemModel
} from '../../../api/models/List.js'
import { getMovieDetails } from '../../../api/services/tmdb.js'
import { getList, addListItem } from '../../../api/controllers/ListController.js'

const OWNER = '7'

const list = {
  id: '12',
  ownerId: OWNER,
  name: 'Katsottavat',
  shareToken: null,
  isHidden: false,
  createdAt: '2026-11-18T12:00:00.000Z'
}

const movie = {
  id: 603,
  title: 'The Matrix',
  overview: '',
  posterPath: '/poster.jpg',
  releaseDate: '1999-03-31',
  voteAverage: 8.2,
  genreIds: [28]
}

const makeRes = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn()
})

const run = async (handler, req) => {
  const res = makeRes()
  const next = vi.fn()
  await handler(req, res, next)
  return { res, next }
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('getList', () => {
  it('returns the owned list and its movies', async () => {
    findListById.mockResolvedValue(list)
    findListItems.mockResolvedValue([{ tmdbId: 603, addedAt: '2026-11-25T10:00:00.000Z' }])
    getMovieDetails.mockResolvedValue(movie)

    const { res, next } = await run(getList, {
      params: { id: '12' },
      user: { id: OWNER }
    })

    expect(findListById).toHaveBeenCalledWith(12)
    expect(findListItems).toHaveBeenCalledWith('12')
    expect(getMovieDetails).toHaveBeenCalledWith(603)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ list, movies: [movie] })
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects an invalid list id', async () => {
    const { res } = await run(getList, {
      params: { id: 'abc' },
      user: { id: OWNER }
    })

    expect(res.status).toHaveBeenCalledWith(400)
    expect(findListById).not.toHaveBeenCalled()
  })

  it('hides lists owned by another user', async () => {
    findListById.mockResolvedValue({ ...list, ownerId: '99' })

    const { res } = await run(getList, {
      params: { id: '12' },
      user: { id: OWNER }
    })

    expect(res.status).toHaveBeenCalledWith(404)
    expect(findListItems).not.toHaveBeenCalled()
  })

  it('passes TMDB errors to next', async () => {
    findListById.mockResolvedValue(list)
    findListItems.mockResolvedValue([{ tmdbId: 603, addedAt: '2026-11-25T10:00:00.000Z' }])
    getMovieDetails.mockRejectedValue(Object.assign(new Error('tmdb down'), { status: 502 }))

    const { res, next } = await run(getList, {
      params: { id: '12' },
      user: { id: OWNER }
    })

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 502 }))
    expect(res.json).not.toHaveBeenCalled()
  })
})

describe('addListItem', () => {
  it('adds a movie to an owned list', async () => {
    findListById.mockResolvedValue(list)
    addListItemModel.mockResolvedValue({ added: true })

    const { res } = await run(addListItem, {
      params: { id: '12' },
      body: { tmdbId: 603 },
      user: { id: OWNER }
    })

    expect(addListItemModel).toHaveBeenCalledWith({ listId: '12', tmdbId: 603 })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ added: true })
  })

  it('rejects an invalid tmdbId', async () => {
    const { res } = await run(addListItem, {
      params: { id: '12' },
      body: { tmdbId: 'abc' },
      user: { id: OWNER }
    })

    expect(res.status).toHaveBeenCalledWith(400)
    expect(findListById).not.toHaveBeenCalled()
  })

  it('returns 404 for a list owned by another user', async () => {
    findListById.mockResolvedValue({ ...list, ownerId: '99' })

    const { res } = await run(addListItem, {
      params: { id: '12' },
      body: { tmdbId: 603 },
      user: { id: OWNER }
    })

    expect(res.status).toHaveBeenCalledWith(404)
    expect(addListItemModel).not.toHaveBeenCalled()
  })

  it('returns 409 when the movie is already on the list', async () => {
    findListById.mockResolvedValue(list)
    addListItemModel.mockResolvedValue({ added: false })

    const { res } = await run(addListItem, {
      params: { id: '12' },
      body: { tmdbId: 603 },
      user: { id: OWNER }
    })

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ error: 'Elokuva on jo listalla' })
  })

  it('passes unexpected errors to next', async () => {
    findListById.mockRejectedValue(new Error('db down'))

    const { res, next } = await run(addListItem, {
      params: { id: '12' },
      body: { tmdbId: 603 },
      user: { id: OWNER }
    })

    expect(next).toHaveBeenCalledWith(expect.any(Error))
    expect(res.json).not.toHaveBeenCalled()
  })
})