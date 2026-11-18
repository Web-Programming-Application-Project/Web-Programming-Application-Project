import { getPopularMovies, getMoviesByCategories, getMovieGenres } from '../services/tmdb.js'

const SORTS = ['popularity.desc', 'vote_average.desc', 'primary_release_date.desc']

const badRequest = (message) => {
  const error = new Error(message)
  error.status = 400
  return error
}

const readLimit = (value) => {
  if (value === undefined) return 4

  const limit = Number(value)
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) throw badRequest('Virheellinen limit')
  return limit
}

const readMatch = (value) => {
  if (value === undefined) return 'or'
  if (value !== 'or' && value !== 'and') throw badRequest('Virheellinen match')
  return value
}

const readSort = (value) => {
  if (value === undefined) return 'popularity.desc'
  if (!SORTS.includes(value)) throw badRequest('Virheellinen sort')
  return value
}

const getMovies = async (req, res, next) => {
  try {
    const limit = readLimit(req.query.limit)

    if (!req.query.genres) {
      const movies = await getPopularMovies(limit)
      return res.status(200).json(movies)
    }

    const movies = await getMoviesByCategories(req.query.genres, {
      limit,
      match: readMatch(req.query.match),
      sortBy: readSort(req.query.sort)
    })
    res.status(200).json(movies)
  } catch (error) {
    next(error)
  }
}

const getGenres = async (req, res, next) => {
  try {
    const genres = await getMovieGenres()
    res.status(200).json(genres)
  } catch (error) {
    next(error)
  }
}

export {
  getMovies,
  getGenres
}
