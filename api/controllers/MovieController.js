import {
  getPopularMovies,
  getMoviesByCategories,
  getMoviesSorted,
  getMovieGenres,
  getMoviesBySearch
} from '../services/tmdb.js'

const SORTS = ['popularity.desc', 'vote_average.desc', 'primary_release_date.desc']

const badRequest = (message) => {
  const error = new Error(message)
  error.status = 400
  return error
}

const readLimit = (value) => {
  if (value === undefined) return 20

  const limit = Number(value)
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) throw badRequest('Virheellinen limit')
  return limit
}

const readPage = (value) => {
  if (value === undefined) return 1

  const page = Number(value)
  if (!Number.isInteger(page) || page < 1 || page > 500) throw badRequest('Virheellinen page')
  return page
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

const readSearchTerm = (value) => {
  const term = String(value ?? '').trim()
  if (!term) throw badRequest('Anna hakusana')
  return term
}


const findMovies = (query) => {
  const limit = readLimit(query.limit)
  const page = readPage(query.page)
  const sortBy = readSort(query.sort)

  if (query.genres) {
    return getMoviesByCategories(query.genres, { limit, page, sortBy, match: readMatch(query.match) })
  }

  // oletusjärjestyksellä käytetään suosituimpien listaa
  if (sortBy === 'popularity.desc') return getPopularMovies(limit, page)
  return getMoviesSorted({ limit, page, sortBy })
}

const getMovies = async (req, res, next) => {
  try {
    const movies = await findMovies(req.query)
    res.status(200).json(movies)
  } catch (error) {
    next(error)
  }
}

const searchMovies = async (req, res, next) => {
  try {
    const movies = await getMoviesBySearch(readSearchTerm(req.query.q), {
      limit: readLimit(req.query.limit),
      page: readPage(req.query.page)
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
  searchMovies,
  getGenres
}
