import jwt from 'jsonwebtoken'
import { findById } from '../models/User.js'
import { COOKIE_NAME, TOKEN_CLAIMS } from '../config.js'

// Tarkistaa evästeen JWT
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token)
      return res.status(401).json({ error: 'Kirjautuminen vaaditaan' })

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      ...TOKEN_CLAIMS
    })

    const user = await findById(payload.sub)
    if (!user)
      return res.status(401).json({ error: 'Käyttäjää ei löydy' })

    req.user = { id: user.id, username: user.username, email: user.email }
    next()
  } catch {
    return res.status(401).json({ error: 'Istunto ei ole voimassa' })
  }
}

export default requireAuth