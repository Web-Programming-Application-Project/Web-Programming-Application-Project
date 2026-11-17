import jwt from 'jsonwebtoken'
import { findById } from '../models/User.js'
import { COOKIE_NAME, TOKEN_CLAIMS } from '../config.js'

const requirePageAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME]
    if (!token)
      return res.redirect('/login')

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      ...TOKEN_CLAIMS
    })

    const user = await findById(payload.sub)
    if (!user)
      return res.redirect('/login')

    next()
  } catch {
    return res.redirect('/login')
  }
}

export default requirePageAuth
