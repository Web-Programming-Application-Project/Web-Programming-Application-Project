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

export { createList, findListsByOwner, findListById }
