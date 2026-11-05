import express from 'express'
import cookieParser from 'cookie-parser'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import csrfProtection from '../../../api/middleware/csrf.js'

// testataan vain csrf middlewarea.
const app = express()
app.use(cookieParser())
app.use(csrfProtection)
app.get('/api/ping', (_req, res) => res.json({ ok: true }))
app.post('/api/ping', (_req, res) => res.json({ ok: true }))

// lue tokenin arvo "set-cookie" otsikosta
const tokenFrom = (res) => {
  const cookie = res.headers['set-cookie'].find((c) => c.startsWith('csrf_token='))
  return cookie.slice('csrf_token='.length, cookie.indexOf(';'))
}

describe('csrf protection', () => {
  it('sends a token cookie with every response', async () => {
    const res = await request(app).get('/api/ping').expect(200)
    expect(tokenFrom(res)).toBeTruthy()
  })

  it('blocks POST without a token', async () => {
    await request(app).post('/api/ping').expect(403)
  })

  it('blocks POST with the wrong token', async () => {
    const agent = request.agent(app)
    await agent.get('/api/ping')

    await agent.post('/api/ping').set('X-CSRF-Token', 'wrong-token').expect(403)
  })

  it('allows POST with the right token', async () => {
    const agent = request.agent(app)
    const res = await agent.get('/api/ping')

    await agent.post('/api/ping').set('X-CSRF-Token', tokenFrom(res)).expect(200)
  })
})
