import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { createUser, findByEmail, findByUsername, findByIdentifier } from '../models/User.js'
import { COOKIE_NAME, TOKEN_CLAIMS } from '../config.js'
import validator from 'validator'

// http only turva per ohjeet

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
}

const UNIQUE_VIOLATION = '23505'

const trimmed = (value) => (typeof value === 'string' ? value.trim() : '')

const isValidEmail = (email) => validator.isEmail(email) && email.length <= 254

const isValidUsername = (username) =>
  validator.isLength(username, { min: 3, max: 30 }) &&
  validator.isAlphanumeric(username, 'fi-FI', { ignore: '_.-' })

const isValidPassword = (password) =>
  typeof password === 'string' && password.length >= 8 && password.length <= 128

const isValidRegistration = ({ username, email, password }) =>
  isValidUsername(username) && isValidEmail(email) && isValidPassword(password)

const parseRegistration = (body = {}) => {
  const data = {
    username: trimmed(body.username),
    email: trimmed(body.email).toLowerCase(),
    password: body.password
  }
  return isValidRegistration(data) ? data : null
}

const parseLogin = (body = {}) => {
  const identifier = trimmed(body.identifier)
  const { password } = body
  const valid = validator.isLength(identifier, { min: 1, max: 254 }) && isValidPassword(password)
  return valid ? { identifier, password } : null
}

const publicUser = (user) => ({ id: user.id, username: user.username, email: user.email })

// JWT 30 timeoutti
const issueCookie = (res, user) => {
  const token = jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, {
    expiresIn: '30m',
    algorithm: 'HS256',
    ...TOKEN_CLAIMS
  })
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 30 * 60 * 1000 })
}

// palauttaa virheviestin jos sähköposti tai käyttäjänimi on varattu
const findConflict = async (username, email) => {
  if (await findByEmail(email)) return 'Sähköposti on jo käytössä'
  if (await findByUsername(username)) return 'Käyttäjänimi on jo käytössä'
  return null
}

const handleRegisterError = (error, res, next) => {
  if (error.code === UNIQUE_VIOLATION)
    return res.status(409).json({ error: 'Käyttäjänimi tai sähköposti on jo käytössä' })
  next(error)
}

// salasana argoni
const register = async (req, res, next) => {
  try {
    const data = parseRegistration(req.body)
    if (!data)
      return res.status(400).json({ error: 'Anna kelvollinen käyttäjänimi, sähköposti ja salasana' })

    const conflict = await findConflict(data.username, data.email)
    if (conflict) return res.status(409).json({ error: conflict })

    const passwordHash = await argon2.hash(data.password)
    const user = await createUser({ username: data.username, email: data.email, passwordHash })

    res.status(201).json({ message: 'Käyttäjä luotu', user: publicUser(user) })
  } catch (error) {
    handleRegisterError(error, res, next)
  }
}

// palauttaa käyttäjän jos tunnus ja salasana täsmäävät, muuten null
const authenticate = async (body) => {
  const input = parseLogin(body)
  const user = input ? await findByIdentifier(input.identifier) : null
  const passwordOk = user && await argon2.verify(user.passwordHash, input.password)
  return passwordOk ? user : null
}

// kirjautuminen: email tai username
const login = async (req, res, next) => {
  try {
    const user = await authenticate(req.body)
    if (!user)
      return res.status(401).json({ error: 'Virheellinen tunnus tai salasana' })

    issueCookie(res, user)
    res.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
}

const me = (req, res) => res.json({ user: req.user })

export { register, login, me }