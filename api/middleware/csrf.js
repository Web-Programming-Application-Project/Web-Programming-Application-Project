import crypto from 'node:crypto'

// csrf suojaus double submit cookie methodilla:
// serveri asettaa satunnaisen tokenin evästeeseen (luettavissa frontille)
// ja vaatii saman tokenin X-CSRF-Token otsikossa kaikissa muutoksissa tekevissä pyynnöissä.

const CSRF_COOKIE = 'csrf_token'
const CSRF_HEADER = 'x-csrf-token'
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

const createToken = () => crypto.randomBytes(32).toString('base64url')

// Vertaa aikaturvallisesti, arvoja ei voi arvata vertailun keston perusteella
const tokensMatch = (headerToken, cookieToken) => {
  if (typeof headerToken !== 'string' || typeof cookieToken !== 'string') return false
  const a = Buffer.from(headerToken)
  const b = Buffer.from(cookieToken)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

const csrfProtection = (req, res, next) => {
  // aseta token kaikille pyynnöille jos sitä ei vielä ole
  if (!req.cookies?.[CSRF_COOKIE]) {
    const token = createToken()
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // frontend lukee tämän ja lähettää otsikossa
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })
    req.cookies = { ...req.cookies, [CSRF_COOKIE]: token }
  }

  // Turvalliset HTTP methodit eivät tarvitse tarkistusta
  if (SAFE_METHODS.has(req.method)) return next()

  const headerToken = req.get(CSRF_HEADER)
  if (!tokensMatch(headerToken, req.cookies[CSRF_COOKIE]))
    return res.status(403).json({ error: 'CSRF-tarkistus epäonnistui' })

  next()
}

export default csrfProtection
