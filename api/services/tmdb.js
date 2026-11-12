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

const fetchPopular = (apiKey) =>
  cached(`popular:${language()}`, popularTtl, async () => {
    const { data } = await tmdb.get('/movie/popular', {
      params: { api_key: apiKey, language: language(), page: 1 }
    })
    return Array.isArray(data?.results) ? data.results : []
  })

const fetchDiscover = async (apiKey, { genreIds, match, sortBy }) => {
  const { data } = await tmdb.get('/discover/movie', {
    params: {
      api_key: apiKey,
      language: language(),
      page: 1,
      sort_by: sortBy,
      with_genres: genreIds.join(match === 'and' ? ',' : '|')
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
  limit: options.limit ?? 20,
  match: options.match ?? 'or',
  sortBy: options.sortBy ?? 'popularity.desc'
})

const getMoviesByCategories = async (categories, options = {}) => {
  const apiKey = requireApiKey()
  const { limit, match, sortBy } = discoverOptions(options)

  try {
    const genreIds = await resolveGenreIds(apiKey, categories)
    const results = await fetchDiscover(apiKey, { genreIds, match, sortBy })
    return results.slice(0, limit).map(toMovie)
  } catch (error) {
    throw serviceError(error)
  }
}

export { getPopularMovies, getMovieGenres, getMoviesByCategories }
