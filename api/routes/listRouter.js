import { Router } from 'express'
import { getLists, createList, getList, addListItem } from '../controllers/ListController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

router.get('/', getLists)
router.post('/', createList)
router.get('/:id', getList)
router.post('/:id/items', addListItem)

export default router
