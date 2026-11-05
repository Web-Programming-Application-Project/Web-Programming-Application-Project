import { pool } from './db.js'

const COLUMNS = 'id, username, email, hashed_password'

const toUser = (row) =>
  row
    ? {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.hashed_password
    }
    : null

const createUser = async ({ username, email, passwordHash }) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, hashed_password)
     VALUES ($1, $2, $3)
     RETURNING ${COLUMNS}`,
    [username, email, passwordHash]
  )
  return toUser(result.rows[0])
}

const findByEmail = async (email) => {
  const result = await pool.query(`SELECT ${COLUMNS} FROM users WHERE email = $1`, [email])
  return toUser(result.rows[0])
}

const findByUsername = async (username) => {
  const result = await pool.query(`SELECT ${COLUMNS} FROM users WHERE username = $1`, [username])
  return toUser(result.rows[0])
}

const findById = async (id) => {
  const result = await pool.query(`SELECT ${COLUMNS} FROM users WHERE id = $1`, [id])
  return toUser(result.rows[0])
}

const findByIdentifier = async (identifier) => {
  const result = await pool.query(
    `SELECT ${COLUMNS} FROM users
     WHERE email = lower($1) OR lower(username) = lower($1)
     LIMIT 1`,
    [identifier]
  )
  return toUser(result.rows[0])
}

export { createUser, findByEmail, findByUsername, findByIdentifier, findById }