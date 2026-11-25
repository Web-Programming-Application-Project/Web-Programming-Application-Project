import { pool } from './db.js'

const COLUMNS = 'id, owner_id, name, share_token, is_hidden, created_at'

const toList = (row) =>
  row
    ? {
      id: row.id,
      ownerId: row.owner_id,
      name: row.name,
      shareToken: row.share_token,
      isHidden: row.is_hidden,
      createdAt: row.created_at
    }
    : null

const createList = async ({ ownerId, name }) => {
  const result = await pool.query(
    `INSERT INTO lists (owner_id, name)
     VALUES ($1, $2)
     RETURNING ${COLUMNS}`,
    [ownerId, name]
  )
  return toList(result.rows[0])
}

const findListsByOwner = async (ownerId) => {
  const result = await pool.query(
    `SELECT ${COLUMNS}
     FROM lists
     WHERE owner_id = $1
     ORDER BY created_at DESC, id DESC`,
    [ownerId]
  )
  return result.rows.map(toList)
}

const findListById = async (id) => {
  const result = await pool.query(
    `SELECT ${COLUMNS} FROM lists WHERE id = $1`,
    [id]
  )
  return toList(result.rows[0])
}

const findListItems = async (listId) => {
  const result = await pool.query(
    `SELECT m.tmdb_id, li.added_at
     FROM list_items li
     JOIN movies m on m.id = li.movie_id
     WHERE li.list_id = $1
     ORDER BY li.added_at DESC, li.id DESC`,
    [listId]
  )
  return result.rows.map((row) => ({ tmdbId: row.tmdb_id, addedAt: row.added_at }))
}

const addListItem = async ({listId, tmdbId}) => {
  const movieResult = await pool.query(
    `INSERT INTO movies (tmdb_id)
     Values ($1)
     ON CONFLICT (tmdb_id) DO UPDATE SET tmdb_id = EXCLUDED.tmdb_id
     RETURNING id`,
    [tmdbId]
  )

  const itemResult = await pool.query(
    `INSERT INTO list_items (list_id, movie_id)
     VALUES ($1, $2)
     ON CONFLICT (list_id, movie_id) DO NOTHING
     RETURNING id`,
    [listId, movieResult.rows[0].id]
  )
  return {added: itemResult.rowCount > 0}
}

export { createList, findListsByOwner, findListById, findListItems, addListItem }