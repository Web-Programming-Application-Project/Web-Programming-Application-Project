import { useAuth } from '../authContext.js'
import AddToListButton from './AddToListButton.jsx'
import './Moviecard.css'
//credit EnkryptattuDev siirsin vaan omaan tiedostoon.
export default function MovieCard({ movie }) {
  const { user } = useAuth()
  const year = movie.releaseDate?.slice(0, 4)

  return (
    <div className="card movie-card h-100 border-0 shadow-sm">
      {user && <AddToListButton movie={movie} />}
      {movie.posterPath ? (
        <img
          className="card-img-top"
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="movie-no-poster">Ei julistetta</div>
      )}
      <div className="card-body">
        <h5 className="card-title fs-6">{movie.title}</h5>
        <p className="card-text small text-muted mb-0">
          {year}
          {movie.voteAverage > 0 && (
            <span className="float-end">
              <i className="bi bi-star-fill text-warning"></i> {movie.voteAverage.toFixed(1)}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
