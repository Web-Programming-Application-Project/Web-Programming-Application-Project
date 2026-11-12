import { Router } from 'express'
import { getMovies, getGenres } from '../controllers/MovieController.js'

const router = Router()

router.get('/genres', getGenres)
router.get('/', getMovies)

export default router
