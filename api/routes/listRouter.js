import { Router } from 'express'
import { getLists, createList, getList, addListItem, removeListItem } from '../controllers/ListController.js'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

router.get('/', getLists)
router.post('/', createList)
router.get('/:id', getList)
router.post('/:id/items', addListItem)
router.delete('/:id/items/:tmdbId', removeListItem)

export default router
