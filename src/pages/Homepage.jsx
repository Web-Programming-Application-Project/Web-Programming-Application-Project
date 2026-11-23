import { useState, useEffect } from 'react'
import { api } from '../api.js'
import { useCategories } from '../services/useCategories.js'
import MovieCard from '../components/moviecard/Moviecard.jsx'
import '../components/moviecard/Moviecard.css'

const sortOptions = [
  { value: 'popularity.desc', label: 'Suosituimmat' },
  { value: 'vote_average.desc', label: 'Parhaiten arvioidut' },
  { value: 'primary_release_date.desc', label: 'Uusimmat' }
]

function Filters({ category, sort, onCategory, onSort }) {
  const { categories, loading, error, refetch } = useCategories()

  return (
    <div className="row g-2 mb-4">
      <div className="col-12 col-sm-6 col-md-4">
        <label htmlFor="category" className="visually-hidden">Kategoria</label>
        <select
          id="category"
          className="form-select"
          value={category ?? ''}
          onChange={(e) => onCategory(e.target.value || null)}
          disabled={loading || Boolean(error)}
        >
          <option value="">{loading ? 'Ladataan kategorioita…' : 'Kaikki kategoriat'}</option>
          {categories.map((item) => (
            <option key={item.id} value={item.name}>{item.name}</option>
          ))}
        </select>
        {error && (
          <p className="text-danger small mt-1 mb-0">
            Kategorioiden lataus epäonnistui.{' '}
            <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={refetch}>
              Yritä uudelleen
            </button>
          </p>
        )}
      </div>

      <div className="col-12 col-sm-6 col-md-4">
        <label htmlFor="sort" className="visually-hidden">Järjestys</label>
        <select
          id="sort"
          className="form-select"
          value={sort}
          onChange={(e) => onSort(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function MovieList({ movies, loading, error }) {
  if (error) return <p className="alert alert-danger" role="alert">{error}</p>

  if (loading) {
    return (
      <div className="text-center text-muted py-5">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        Ladataan elokuvia…
      </div>
    )
  }

  if (movies.length === 0) return <p className="text-muted">Elokuvia ei löytynyt.</p>

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

function useMovies(category, sort, page) {
  const [result, setResult] = useState({ movies: [], totalPages: 1, loading: true, error: '' })

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ page, sort })
    if (category) params.set('genres', category)

    setResult((current) => ({ ...current, loading: true, error: '' }))

    api(`/movies?${params}`)
      .then((data) => {
        if (!cancelled) {
          setResult({ movies: data.results, totalPages: data.totalPages, loading: false, error: '' })
        }
      })
      .catch((err) => {
        // ei päivitetä tilaa jos komponentti on poistunut
        if (!cancelled) setResult({ movies: [], totalPages: 1, loading: false, error: err.message })
      })

    return () => {
      cancelled = true
    }
  }, [category, sort, page])

  return result
}

export default function Homepage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sort, setSort] = useState(sortOptions[0].value)
  const [page, setPage] = useState(1)
  const { movies, totalPages, loading, error } = useMovies(selectedCategory, sort, page)

  function selectCategory(category) {
    setSelectedCategory(category)
    setPage(1)
  }

  function selectSort(value) {
    setSort(value)
    setPage(1)
  }

  function changePage(next) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container py-4">
      <Filters
        category={selectedCategory}
        sort={sort}
        onCategory={selectCategory}
        onSort={selectSort}
      />

      <MovieList movies={movies} loading={loading} error={error} />
      <Pagination page={page} totalPages={totalPages} onChange={changePage} />
    </div>
  )
}
