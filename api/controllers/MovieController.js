import { getPopularMovies } from '../services/tmdb.js'

const getMovies = async (req, res, next) => {
  try {
    const movies = await getPopularMovies(4)
    res.status(200).json(movies)
  } catch (error) {
    next(error)
  }
}

export {
  getMovies
}