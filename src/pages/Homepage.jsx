import { useState, useEffect } from 'react'
import { api } from '../api.js'
import { useCategories } from '../services/useCategories.js'
import './Homepage.css'

function CategoryFilter({ selected, onSelect }) {
  const { categories, loading, error, refetch } = useCategories()

  if (loading) return <p className="text-muted mb-3">Ladataan kategorioita…</p>

  if (error) {
    return (
      <p className="text-danger mb-3">
        Kategorioiden lataus epäonnistui.{' '}
        <button type="button" className="btn btn-link btn-sm p-0" onClick={refetch}>
          Yritä uudelleen
        </button>
      </p>
    )
  }

  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      <button
        type="button"
        className={`btn btn-sm ${selected ? 'btn-outline-dark' : 'btn-dark'}`}
        onClick={() => onSelect(null)}
      >
        Kaikki
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`btn btn-sm ${selected === category.name ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => onSelect(category.name)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default function Homepage() {
  const [movies, setMovies] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadMovies() {
      try {
        const query = selectedCategory
          ? `?genres=${encodeURIComponent(selectedCategory)}`
          : ''
        const data = await api(`/movies${query}`)

        if (!cancelled) setMovies(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      }
    }

    loadMovies()

    return () => {
      cancelled = true
    }
  }, [selectedCategory])

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Findmovie</h1>
      <h1 className="h3 mb-4">Top movies:</h1>

      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-6 col-md-3 mb-4">
            <div className="card h-100">
              <img
                className="card-img-top"
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={movie.title}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
