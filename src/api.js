import axios from 'axios'

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
  if (method !== 'GET' && method !== 'HEAD') {
    headers['X-CSRF-Token'] = readCsrfToken()
  }

  return headers
}

const client = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true,
  headers: { Accept: 'application/json' }
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const wrapped = new Error(parseError(error.response?.data || {}))
    wrapped.status = error.response?.status
    return Promise.reject(wrapped)
  }
)

export async function api(path, options = {}) {
  const { body, ...config } = options
  const response = await client.request({
    ...config,
    url: path,
    data: config.data ?? body,
    headers: buildHeaders(options)
  })
  return response.data
}
