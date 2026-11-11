const getMovies = async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_KEY}`
    )

    if (!response.ok) {
      const error = new Error('Failed to load movies')
      error.status = 502
      throw error
    }

    const data = await response.json()
    res.status(200).json(data.results.slice(0, 4))
  } catch (error) {
    next(error)
  }
}

export {
  getMovies
}