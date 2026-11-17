import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../../api/models/User.js', () => ({
  createUser: vi.fn(),
  findByEmail: vi.fn(),
  findByUsername: vi.fn(),
  findByIdentifier: vi.fn(),
  findById: vi.fn(),
  updatePassword: vi.fn()
}))

// ei oikeaa sähköpostin lähetystä
vi.mock('../../../api/services/mailer.js', () => ({
  sendPasswordResetEmail: vi.fn()
}))

import { findByEmail, findById, updatePassword } from '../../../api/models/User.js'
import { sendPasswordResetEmail } from '../../../api/services/mailer.js'

import app from '../../../api/app.js'

process.env.JWT_SECRET ||= 'test-secret'

const USER = { id: 1, username: 'testaaja', email: 'testaaja@example.com', passwordHash: 'hash' }

let agent
let csrfToken

// corssi again
const readCsrfToken = (res) => {
  const cookie = res.headers['set-cookie'].find((c) => c.startsWith('csrf_token='))
  return cookie.slice('csrf_token='.length, cookie.indexOf(';'))
}

beforeEach(async () => {
  vi.resetAllMocks()
  sendPasswordResetEmail.mockResolvedValue()
  agent = request.agent(app)
  csrfToken = readCsrfToken(await agent.get('/api/auth/me'))
})

const post = (path, body) => agent.post(path).set('X-CSRF-Token', csrfToken).send(body)

// pyytää palautuslinkin ja palauttaa sen tokenin
const requestToken = async () => {
  findByEmail.mockResolvedValue(USER)
  await post('/api/auth/password-reset/request', { email: USER.email }).expect(200)
  return new URL(sendPasswordResetEmail.mock.calls[0][1]).searchParams.get('token')
}

describe('POST /api/auth/password-reset/request', () => {
  it('sends a reset link when the email exists', async () => {
    // Olemassa oleva sähköposti vastaa 200 ja lähettää linkin tokenilla.
    findByEmail.mockResolvedValue(USER)

    const res = await post('/api/auth/password-reset/request', { email: 'Testaaja@Example.com' }).expect(200)

    expect(res.body.message).toBeDefined()
    expect(findByEmail).toHaveBeenCalledWith('testaaja@example.com')
    expect(sendPasswordResetEmail).toHaveBeenCalledOnce()
    expect(sendPasswordResetEmail.mock.calls[0][1]).toContain('/reset-password?token=')
  })

  it('gives the same answer when the email does not exist', async () => {
    // Tuntematon sähköposti vastaa samoin 200, mutta viestiä ei lähetetä. Ei paljasta tilejä.
    findByEmail.mockResolvedValue(null)

    const res = await post('/api/auth/password-reset/request', { email: 'ei@example.com' }).expect(200)

    expect(res.body.message).toBeDefined()
    expect(sendPasswordResetEmail).not.toHaveBeenCalled()
  })

  it('rejects an invalid email', async () => {
    // Virheellinen sähköposti vastaa 400 eikä hae käyttäjää.
    await post('/api/auth/password-reset/request', { email: 'ei-sahkoposti' }).expect(400)

    expect(findByEmail).not.toHaveBeenCalled()
  })
})

describe('POST /api/auth/password-reset/confirm', () => {
  it('changes the password with a valid token', async () => {
    // Oikea token vaihtaa salasanan ja tallentaa hashin.
    const token = await requestToken()
    findById.mockResolvedValue(USER)

    await post('/api/auth/password-reset/confirm', { token, password: 'uusisalasana123' }).expect(200)

    expect(updatePassword).toHaveBeenCalledWith(1, expect.not.stringMatching('uusisalasana123'))
  })

  it('rejects the token once the password has changed', async () => {
    // Linkki on kertakäyttöinen, vaihdetun salasanan jälkeen vanha token vastaa 400.
    const token = await requestToken()
    findById.mockResolvedValue({ ...USER, passwordHash: 'uusi-hash' })

    await post('/api/auth/password-reset/confirm', { token, password: 'uusisalasana123' }).expect(400)

    expect(updatePassword).not.toHaveBeenCalled()
  })

  it('rejects a garbage token', async () => {
    // Väärä token vastaa 400 eikä vaihda salasanaa.
    await post('/api/auth/password-reset/confirm', { token: 'roskaa', password: 'uusisalasana123' }).expect(400)

    expect(updatePassword).not.toHaveBeenCalled()
  })

  it('rejects a too short password', async () => {
    // Liian lyhyt salasana vastaa 400 eikä vaihda salasanaa.
    await post('/api/auth/password-reset/confirm', { token: 'abc', password: 'lyhyt' }).expect(400)

    expect(updatePassword).not.toHaveBeenCalled()
  })
})
