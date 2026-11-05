import argon2 from 'argon2'
import { createUser, findByEmail, findByUsername } from './models/User.js'

// Luo kehitystestikäyttäjän envin arvoilla

const readConfig = () => {
  const username = process.env.TEST_USER_USERNAME
  const email = process.env.TEST_USER_EMAIL?.toLowerCase()
  const password = process.env.TEST_USER_PASSWORD
  return username && email && password ? { username, email, password } : null
}

const userExists = async ({ username, email }) =>
  Boolean(await findByEmail(email) || await findByUsername(username))

const seedTestUser = async () => {
  const config = readConfig()
  if (!config || process.env.NODE_ENV === 'production') return
  if (await userExists(config)) return

  const passwordHash = await argon2.hash(config.password)
  await createUser({ username: config.username, email: config.email, passwordHash })
  console.log(`Testikäyttäjä luotu: ${config.username}`)
}

export default seedTestUser
