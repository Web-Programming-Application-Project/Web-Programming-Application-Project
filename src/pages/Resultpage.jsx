import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api.js'
import MovieCard from '../components/moviecard/Moviecard.jsx'

function useSearchResults(query, page) {
  const [result, setResult] = useState({ movies: [], totalPages: 1, loading: true, error: '' })

  useEffect(() => {
    if (!query) {
      setResult({ movies: [], totalPages: 1, loading: false, error: '' })
      return
    }

    let cancelled = false
    const params = new URLSearchParams({ q: query, page })

    setResult((current) => ({ ...current, loading: true, error: '' }))

    api(`/movies/search?${params}`)
      .then((data) => {
        if (!cancelled) {
          setResult({ movies: data.results, totalPages: data.totalPages, loading: false, error: '' })
        }
      })
      .catch((err) => {
        if (!cancelled) setResult({ movies: [], totalPages: 1, loading: false, error: err.message })
      })

    return () => {
      cancelled = true
    }
  }, [query, page])

  return result
}

function Results({ query, movies, loading, error }) {
  if (error) return <p className="alert alert-danger" role="alert">{error}</p>

  if (loading) {
    return (
      <div className="text-center text-muted py-5">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        Haetaan elokuvia…
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <p className="text-muted">
        Elokuvia ei löytynyt haulle <strong>{query}</strong>.
      </p>
    )
  }

  return (
    <div className="row g-3 g-md-4 mb-4">
      {movies.map((movie) => (
        <div key={movie.id} className="col-6 col-md-4 col-lg-3">
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const first = page <= 1
  const last = page >= totalPages

  return (
    <nav aria-label="Sivutus">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${first ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            disabled={first}
            onClick={() => onChange(page - 1)}
          >
            Edellinen
          </button>
        </li>
        <li className="page-item disabled">
          <span className="page-link">Sivu {page}</span>
        </li>
        <li className={`page-item ${last ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            disabled={last}
            onClick={() => onChange(page + 1)}
          >
            Seuraava
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default function Resultspage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = (searchParams.get('q') || '').trim()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const { movies, totalPages, loading, error } = useSearchResults(query, page)

  function changePage(next) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(next))
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container py-4">
      <h1 className="h4 mb-4">
        {query ? <>Tulokset haulle: “{query}”</> : 'Haku'}
      </h1>

      {query ? (
        <>
          <Results query={query} movies={movies} loading={loading} error={error} />
          <Pagination page={page} totalPages={totalPages} onChange={changePage} />
        </>
      ) : (
        <p className="text-muted">
          Kirjoita hakusana hakukenttään tai <Link to="/">palaa etusivulle</Link>.
        </p>
      )}
    </div>
  )
}
