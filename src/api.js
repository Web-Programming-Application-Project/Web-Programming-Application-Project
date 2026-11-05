const parseError = (data) => {
  if (typeof data.error === 'string') return data.error
  return data.error?.message || 'Pyyntö epäonnistui'
}

export async function api(path, options = {}) {
  const headers = { ...options.headers }
  if (options.body) headers['Content-Type'] = 'application/json'

  const response = await fetch('/api' + path, {
    ...options,
    credentials: 'same-origin',
    headers,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(parseError(data))
  return data
}
