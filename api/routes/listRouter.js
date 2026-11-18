import { Router } from 'express'
import { getLists, createList } from '../controllers/ListController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

router.get('/', getLists)
router.post('/', createList)

export default router
