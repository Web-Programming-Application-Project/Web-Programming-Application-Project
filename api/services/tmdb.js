import axios from 'axios'

const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  timeout: Number(process.env.TMDB_TIMEOUT_MS || 5000),
  headers: { Accept: 'application/json' }
})

const toMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  posterPath: movie.poster_path,
  releaseDate: movie.release_date,
  voteAverage: movie.vote_average
})

const requireApiKey = () => {
  if (!process.env.TMDB_KEY) {
    const error = new Error('TMDB_KEY puuttuu')
    error.status = 503
    throw error
  }
  return process.env.TMDB_KEY
}

const fetchPopular = async (apiKey) => {
  const { data } = await tmdb.get('/movie/popular', {
    params: {
      api_key: apiKey,
      language: process.env.TMDB_LANGUAGE || 'fi-FI',
      page: 1
    }
  })
  return Array.isArray(data?.results) ? data.results : []
}

const getPopularMovies = async (limit = 4) => {
  const apiKey = requireApiKey()

  try {
    const results = await fetchPopular(apiKey)
    return results.slice(0, limit).map(toMovie)
  } catch (error) {
    const wrapped = new Error('Elokuvapalvelu ei ole käytettävissä')
    wrapped.status = error.response ? 502 : 504
    throw wrapped
  }
}

export { getPopularMovies }
