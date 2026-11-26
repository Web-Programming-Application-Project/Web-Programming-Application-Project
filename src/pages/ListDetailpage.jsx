import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import MovieCard from '../components/moviecard/Moviecard.jsx'

export default function ListDetailpage() {
  const { id } = useParams()
  const [result, setResult] = useState({ list: null, movies: [], loading: true, error: '' })

  useEffect(() => {
    let cancelled = false

    setResult((current) => ({ ...current, loading: true, error: '' }))

    api(`/lists/${id}`)
      .then((data) => {
        if (!cancelled) {
          setResult({ list: data.list, movies: data.movies ?? [], loading: false, error: '' })
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setResult({ list: null, movies: [], loading: false, error: err.message })
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const { list, movies, loading, error } = result

  function handleRemoved(tmdbId) {
    setResult((current) => ({
      ...current,
      movies: current.movies.filter((movie) => movie.id !== tmdbId)
    }))
  }

  return (
    <div className="container py-4">
      <Link to="/lists" className="small text-decoration-none">
        <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
        Omat listat
      </Link>

      {loading ? (
        <div className="text-center text-muted py-5">
          <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
          Ladataan listaa…
        </div>
      ) : error ? (
        <p className="alert alert-danger mt-4" role="alert">{error}</p>
      ) : (
        <>
          <h1 className="h3 mt-3 mb-1">{list.name}</h1>
          <p className="text-muted mb-4">{movies.length} elokuvaa</p>

          {movies.length === 0 ? (
            <p className="text-muted">
              Lista on tyhjä. Lisää elokuvia etusivun tai haun plussapainikkeella.
            </p>
          ) : (
            <div className="row g-3 g-md-4 mb-4">
              {movies.map((movie) => (
                <div key={movie.id} className="col-6 col-md-4 col-lg-3">
                  <MovieCard movie={movie} listId={list.id} listName={list.name} onRemoved={handleRemoved} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
