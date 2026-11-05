export async function api(path, options = {}) {
  const response = await fetch('/api' + path, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Pyyntö epäonnistui')
  return data
}
