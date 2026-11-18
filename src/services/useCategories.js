import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    // haetaan kategoriat backendistä
    axios.get('/api/movies/genres')
      .then(({ data }) => {
        if (!cancelled) setCategories(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        // ei päivitetä tilaa jos komponentti on poistunut
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const refetch = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  return { categories, loading, error, refetch }
}
