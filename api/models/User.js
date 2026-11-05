import { randomUUID } from 'node:crypto'

// muistis enne ku db yhdistys jne jne

const users = new Map()

const createUser = async ({ email, passwordHash }) => {
  const user = { id: randomUUID(), email, passwordHash }
  users.set(user.id, user)
  return user
}

const findByEmail = async (email) => {
  return [...users.values()].find((user) => user.email === email) || null
}

const findById = async (id) => {
  return users.get(id) || null
}

export { createUser, findByEmail, findById }
