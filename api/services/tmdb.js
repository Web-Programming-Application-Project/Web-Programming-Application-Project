import axios from 'axios'

const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  timeout: Number(process.env.TMDB_TIMEOUT_MS || 5000),
  headers: { Accept: 'application/json' }
})


// cache movieille
const cache = new Map()

const genreTtl = Number(process.env.TMDB_GENRE_TTL_MS || 24 * 60 * 60 * 1000)
const popularTtl = Number(process.env.TMDB_POPULAR_TTL_MS || 5 * 60 * 1000)

const cached = (key, ttl, load) => {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.at < ttl) return entry.promise

  const promise = load()
  cache.set(key, { at: Date.now(), promise })
  promise.catch(() => cache.delete(key))
  return promise
}

const language = () => process.env.TMDB_LANGUAGE || 'fi-FI'

const toMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  posterPath: movie.poster_path,
  releaseDate: movie.release_date,
  voteAverage: movie.vote_average,
  genreIds: movie.genre_ids ?? []
})

const serviceError = (error) => {
  if (error.status) return error

  const wrapped = new Error('Elokuvapalvelu ei ole käytettävissä :(')
  wrapped.status = error.response ? 502 : 504
  return wrapped
}

const requireApiKey = () => {
  if (!process.env.TMDB_KEY) {
    const error = new Error('TMDB_KEY puuttuu')
    error.status = 503
    throw error
  }
  return process.env.TMDB_KEY
}

const slug = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')

const badRequest = (message) => {
  const error = new Error(message)
  error.status = 400
  return error
}

// genre jutut

const fetchGenres = async (apiKey, lang) => {
  const { data } = await tmdb.get('/genre/movie/list', {
    params: { api_key: apiKey, language: lang }
  })
  return Array.isArray(data?.genres) ? data.genres : []
}

const loadGenres = (apiKey) =>
  cached('genres', genreTtl, async () => {
    const lang = language()
    const [local, english] = await Promise.all([
      fetchGenres(apiKey, lang),
      lang === 'en-US' ? [] : fetchGenres(apiKey, 'en-US')
    ])

    const lookup = new Map()
    const list = local.map((genre) => {
      lookup.set(String(genre.id), genre.id)
      lookup.set(slug(genre.name), genre.id)
      return { id: genre.id, name: genre.name }
    })
    english.forEach((genre) => lookup.set(slug(genre.name), genre.id))
    return { list, lookup }
  })

const parseCategories = (categories) => {
  const values = Array.isArray(categories) ? categories : String(categories ?? '').split(',')
  const names = values.map((value) => String(value).trim()).filter(Boolean)
  if (!names.length) throw badRequest('Anna vähintään yksi kategoria')
  return names
}

const resolveGenreIds = async (apiKey, categories) => {
  const { lookup } = await loadGenres(apiKey)
  const ids = []
  const unknown = []

  parseCategories(categories).forEach((name) => {
    const id = lookup.get(slug(name))
    if (id === undefined) unknown.push(name)
    else if (!ids.includes(id)) ids.push(id)
  })

  if (unknown.length) throw badRequest(`Tuntematon kategoria: ${unknown.join(', ')}`)
  return ids
}

// tmdb palauttaa max 500 sivua
const maxPages = 500

const toPage = (data, page, limit) => ({
  results: (Array.isArray(data?.results) ? data.results : []).slice(0, limit).map(toMovie),
  page,
  totalPages: Math.min(Number(data?.total_pages) || 1, maxPages)
})

const fetchPopular = (apiKey, page) =>
  cached(`popular:${language()}:${page}`, popularTtl, async () => {
    const { data } = await tmdb.get('/movie/popular', {
      params: { api_key: apiKey, language: language(), page }
    })
    return data
  })

// piilotetaan vähän äänestetyt ja julkaisemattomat elokuvat
const sortGuards = (sortBy) => {
  if (sortBy === 'vote_average.desc') return { 'vote_count.gte': 200 }
  if (sortBy === 'primary_release_date.desc') {
    return { 'primary_release_date.lte': new Date().toISOString().slice(0, 10) }
  }
  return {}
}

const fetchDiscover = (apiKey, { genreIds, match, sortBy, page }) => {
  const genres = genreIds.join(match === 'and' ? ',' : '|')

  return cached(`discover:${language()}:${genres}:${sortBy}:${page}`, popularTtl, async () => {
    const params = {
      api_key: apiKey,
      language: language(),
      page,
      sort_by: sortBy,
      ...sortGuards(sortBy)
    }
    if (genres) params.with_genres = genres

    const { data } = await tmdb.get('/discover/movie', { params })
    return data
  })
}

const getPopularMovies = async (limit = 20, page = 1) => {
  const apiKey = requireApiKey()

  try {
    const data = await fetchPopular(apiKey, page)
    return toPage(data, page, limit)
  } catch (error) {
    throw serviceError(error)
  }
}

const getMovieGenres = async () => {
  const apiKey = requireApiKey()

  try {
    const { list } = await loadGenres(apiKey)
    return list
  } catch (error) {
    throw serviceError(error)
  }
}

const discoverOptions = (options = {}) => ({
  limit: 20,
  match: 'or',
  sortBy: 'popularity.desc',
  page: 1,
  ...options
})

const getMoviesByCategories = async (categories, options = {}) => {
  const apiKey = requireApiKey()
  const { limit, match, sortBy, page } = discoverOptions(options)

  try {
    const genreIds = await resolveGenreIds(apiKey, categories)
    const data = await fetchDiscover(apiKey, { genreIds, match, sortBy, page })
    return toPage(data, page, limit)
  } catch (error) {
    throw serviceError(error)
  }
}

const getMoviesSorted = async (options = {}) => {
  const apiKey = requireApiKey()
  const { limit, sortBy, page } = discoverOptions(options)

  try {
    const data = await fetchDiscover(apiKey, { genreIds: [], match: 'or', sortBy, page })
    return toPage(data, page, limit)
  } catch (error) {
    throw serviceError(error)
  }
}

export { getPopularMovies, getMovieGenres, getMoviesByCategories, getMoviesSorted }
