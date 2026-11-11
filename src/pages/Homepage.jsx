import { useState, useEffect } from 'react'
import { api } from '../api.js'
import './Homepage.css'

export default function Homepage() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await api('/movies')
        setMovies(data)
      } catch (err) {
        console.error(err)
      }
    }

    loadMovies()
  }, [])

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Findmovie</h1>
      <h1 className="h3 mb-4">Top movies:</h1>

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