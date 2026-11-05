import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { createUser, findByEmail } from '../models/User.js'
import { COOKIE_NAME, TOKEN_CLAIMS } from '../config.js'

// http only turva per ohjeet

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
}

const isValidEmail = (email) => Boolean(email) && email.length <= 254

const isValidPassword = (password) =>
  typeof password === 'string' && password.length >= 8 && password.length <= 128

const validateCredentials = (body = {}) => {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = body.password
  return isValidEmail(email) && isValidPassword(password) ? { email, password } : null
}

const publicUser = (user) => ({ id: user.id, email: user.email })

// JWT 30 timeoutti
const issueCookie = (res, user) => {
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30m',
    algorithm: 'HS256',
    ...TOKEN_CLAIMS
  })
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 30 * 60 * 1000 })
}

// salasana argoni
const register = async (req, res, next) => {
  try {
    const credentials = validateCredentials(req.body)
    if (!credentials)
      return res.status(400).json({ error: 'Anna kelvollinen sähköposti ja salasana' })

    if (await findByEmail(credentials.email))
      return res.status(409).json({ error: 'Sähköposti on jo käytössä' })

    const passwordHash = await argon2.hash(credentials.password)
    const user = await createUser({ email: credentials.email, passwordHash })

    res.status(201).json({ message: 'Käyttäjä luotu', user: publicUser(user) })
  } catch (error) {
    next(error)
  }
}

// kirjautiminen chekataan argonilla
const login = async (req, res, next) => {
  try {
    const credentials = validateCredentials(req.body)
    const user = credentials ? await findByEmail(credentials.email) : null
    const passwordOk = user && await argon2.verify(user.passwordHash, credentials.password)

    if (!passwordOk)
      return res.status(401).json({ error: 'Virheellinen sähköposti tai salasana' })

    issueCookie(res, user)
    res.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
}

const me = (req, res) => res.json({ user: req.user })

export { register, login, me }
