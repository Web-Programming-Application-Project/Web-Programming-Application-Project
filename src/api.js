const parseError = (data) => {
  if (typeof data.error === 'string') return data.error
  return data.error?.message || 'Pyyntö epäonnistui'
}

// csrf token evästeestä
const readCsrfToken = () => {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/)
  return match ? match[1] : ''
}

// otsikot json body ja csrf token
const buildHeaders = (options) => {
  const headers = { ...options.headers }
  if (options.body) headers['Content-Type'] = 'application/json'

  const method = (options.method || 'GET').toUpperCase()
  if (method !== 'GET' && method !== 'HEAD')
    headers['X-CSRF-Token'] = readCsrfToken()

  return headers
}

export async function api(path, options = {}) {
  const response = await fetch('/api' + path, {
    ...options,
    credentials: 'same-origin',
    headers: buildHeaders(options),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(parseError(data))
  return data
}
