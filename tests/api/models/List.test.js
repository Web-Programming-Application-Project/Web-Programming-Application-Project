import { beforeEach, describe, expect, it, vi } from 'vitest'

const { query } = vi.hoisted(() => ({
  query: vi.fn()
}))

vi.mock('../../../api/models/db.js', () => ({
  pool: { query }
}))

import { createList, findListsByOwner } from '../../../api/models/List.js'

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
