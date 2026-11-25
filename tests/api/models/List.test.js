import { beforeEach, describe, expect, it, vi } from 'vitest'

const { query } = vi.hoisted(() => ({
  query: vi.fn()
}))

vi.mock('../../../api/models/db.js', () => ({
  pool: { query }
}))

import { createList, findListsByOwner, findListItems, addListItem } from '../../../api/models/List.js'

describe('createList', () => {
  beforeEach(() => {
    query.mockReset()
  })

  it('inserts a list and returns the mapped row', async () => {
    query.mockResolvedValue({
      rows: [{
        id: '1',
        owner_id: '7',
        name: 'Katsottavat',
        share_token: null,
        is_hidden: false,
        created_at: '2026-11-17T10:00:00.000Z'
      }]
    })

    const list = await createList({ ownerId: '7', name: 'Katsottavat' })

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO lists'),
      ['7', 'Katsottavat']
    )
    expect(list).toEqual({
      id: '1',
      ownerId: '7',
      name: 'Katsottavat',
      shareToken: null,
      isHidden: false,
      createdAt: '2026-11-17T10:00:00.000Z'
    })
  })
})

describe('findListsByOwner', () => {
  beforeEach(() => {
    query.mockReset()
  })

  it('returns the owner lists', async () => {
    query.mockResolvedValue({ rows: [] })

    await expect(findListsByOwner('7')).resolves.toEqual([])
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE owner_id = $1'),
      ['7']
    )
  })
})

describe('findListItems', () => {
  beforeEach(() => {
    query.mockReset()
  })

  it('returns the list items mapped from rows', async () => {
    query.mockResolvedValue({
      rows: [
        { tmdb_id: 603, added_at: '2026-11-25T10:00:00.000Z' }
      ]
    })

    await expect(findListItems('12')).resolves.toEqual([
      { tmdbId: 603, addedAt: '2026-11-25T10:00:00.000Z' }
    ])
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('FROM list_items'),
      ['12']
    )
  })
})

describe('addListItem', () => {
  beforeEach(() => {
    query.mockReset()
  })

  it('adds a new movie to the list', async () => {
    query
      .mockResolvedValueOnce({ rows: [{ id: '5' }] })
      .mockResolvedValueOnce({ rowCount: 1 })

    await expect(addListItem({ listId: '12', tmdbId: 603 })).resolves.toEqual({ added: true })
    expect(query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('INSERT INTO movies'),
      [603]
    )
    expect(query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('INSERT INTO list_items'),
      ['12', '5']
    )
  })

  it('reports a duplicate as not added', async () => {
    query
      .mockResolvedValueOnce({ rows: [{ id: '5' }] })
      .mockResolvedValueOnce({ rowCount: 0 })

    await expect(addListItem({ listId: '12', tmdbId: 603 })).resolves.toEqual({ added: false })
  })
})