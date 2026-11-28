import { Router } from 'express'
import { getMovies, getGenres, searchMovies, suggestMovies } from '../controllers/MovieController.js'

const router = Router()

router.get('/genres', getGenres)
router.get('/search', searchMovies)
router.get('/suggestions', suggestMovies)
router.get('/', getMovies)

export default router
