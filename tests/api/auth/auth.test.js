import argon2 from 'argon2'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ei db versio
vi.mock('../../../api/models/User.js', () => ({
  createUser: vi.fn(),
  findByEmail: vi.fn(),
  findByUsername: vi.fn(),
  findByIdentifier: vi.fn(),
  findById: vi.fn()
}))

import { createUser, findByEmail, findByIdentifier } from '../../../api/models/User.js'
import app from '../../../api/app.js'

process.env.JWT_SECRET ||= 'test-secret'

const PASSWORD = 'salasana123'

let agent
let csrfToken

// corssi fixi
const readCsrfToken = (res) => {
  const cookie = res.headers['set-cookie'].find((c) => c.startsWith('csrf_token='))
  return cookie.slice('csrf_token='.length, cookie.indexOf(';'))
}

beforeEach(async () => {
  vi.resetAllMocks()
  agent = request.agent(app)
  csrfToken = readCsrfToken(await agent.get('/api/auth/me'))
})

const post = (path, body) => agent.post(path).set('X-CSRF-Token', csrfToken).send(body)

describe('POST /api/auth/register', () => {
  it('creates a user when the details are valid', async () => {
    // rekisteröinti vastaa 201 ja palauttaa uuden käyttäjän.
    createUser.mockResolvedValue({
      id: 1,
      username: 'testaaja',
      email: 'testaaja@example.com',
      passwordHash: 'hash'
    })

    const res = await post('/api/auth/register', {
      username: 'testaaja',
      email: 'Testaaja@Example.com',
      password: PASSWORD
    }).expect(201)

    expect(res.body.user).toEqual({ id: 1, username: 'testaaja', email: 'testaaja@example.com' })
    // Salasana hashi.
    expect(createUser.mock.calls[0][0].passwordHash).not.toBe(PASSWORD)
  })

  it('rejects invalid details', async () => {
    // Liian lyhyt salasana vastaa 400 eikä tee tiliä.
    await post('/api/auth/register', {
      username: 'testaaja',
      email: 'testaaja@example.com',
      password: 'lyhyt'
    }).expect(400)

    expect(createUser).not.toHaveBeenCalled()
  })

  it('rejects an email that is already in use', async () => {
    // Sähköposti on jo käytössä, vastaa 409.
    findByEmail.mockResolvedValue({
      id: 7,
      username: 'vanha',
      email: 'testaaja@example.com',
      passwordHash: 'hash'
    })

    await post('/api/auth/register', {
      username: 'testaaja',
      email: 'testaaja@example.com',
      password: PASSWORD
    }).expect(409)

    expect(createUser).not.toHaveBeenCalled()
  })
})

describe('POST /api/auth/login', () => {
  it('logs in when the password matches', async () => {
    // Oikeat tunnukset palauttavat käyttäjän ja asettavat JWT:n.
    findByIdentifier.mockResolvedValue({
      id: 1,
      username: 'testaaja',
      email: 'testaaja@example.com',
      passwordHash: await argon2.hash(PASSWORD)
    })

    const res = await post('/api/auth/login', {
      identifier: 'testaaja',
      password: PASSWORD
    }).expect(200)

    expect(res.body.user.username).toBe('testaaja')
    expect(res.headers['set-cookie'].some((c) => c.startsWith('auth='))).toBe(true)
  })

  it('refuses a wrong password', async () => {
    // Väärä salasana vastaa 401 eikä jwtä anneta.
    findByIdentifier.mockResolvedValue({
      id: 1,
      username: 'testaaja',
      email: 'testaaja@example.com',
      passwordHash: await argon2.hash(PASSWORD)
    })

    const res = await post('/api/auth/login', {
      identifier: 'testaaja',
      password: 'vaarasalasana'
    }).expect(401)

    expect((res.headers['set-cookie'] ?? []).some((c) => c.startsWith('auth='))).toBe(false)
  })
})
