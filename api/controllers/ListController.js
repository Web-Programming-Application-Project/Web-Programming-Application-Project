import validator from 'validator'
import { createList as createListModel, findListsByOwner, findListById, findListItems, addListItem as addListItemModel } from '../models/List.js'
import { getMovieDetails } from '../services/tmdb.js'

const MAX_NAME_LENGTH = 100

const trimmed = (value) => (typeof value === 'string' ? value.trim() : '')

const parseName = (body = {}) => {
  const name = trimmed(body.name)
  return validator.isLength(name, { min: 1, max: MAX_NAME_LENGTH }) ? name : null
}

const parseId = (value) => {
  if (typeof value !== 'string' && typeof value !== 'number') return null

  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

// Lista palautetaan vain omistajalle, jotta muiden listojen olemassaolo ei paljastu
const findOwnedList = async (id, userId) => {
  const list = await findListById(id)
  return list && String(list.ownerId) === String(userId) ? list : null
}

const getLists = async (req, res, next) => {
  try {
    const lists = await findListsByOwner(req.user.id)
    res.status(200).json({ lists })
  } catch (error) {
    next(error)
  }
}

const createList = async (req, res, next) => {
  try {
    const name = parseName(req.body)
    if (!name)
      return res.status(400).json({ error: `Anna listalle nimi (1–${MAX_NAME_LENGTH} merkkiä)` })

    const list = await createListModel({ ownerId: req.user.id, name })
    res.status(201).json({ list })
  } catch (error) {
    next(error)
  }
}

const getList = async (req, res, next) => {
  try {
    const listId = parseId(req.params.id)
    if (!listId) return res.status(400).json({error: 'Virheellinen lista'})
    
    const list = await findOwnedList(listId, req.user.id)
    if (!list) return res.status(404).json({ error: 'Listaa ei löydy' })

    const items = await findListItems(list.id)
    const movies = await Promise.all(items.map((item) => getMovieDetails(item.tmdbId)))

    res.status(200).json({ list, movies })
  } catch (error) {
    next(error)
  }
}

const addListItem = async (req, res, next) => {
  try {
    const listId = parseId(req.params.id)
    const tmdbId = parseId(req.body?.tmdbId)

    if (!listId) return res.status(400).json({ error: 'Virheellinen lista' })
    if (!tmdbId) return res.status(400).json({ error: 'Anna kelvollinen elokuvan tunniste' })

    const list = await findOwnedList(listId, req.user.id)
    if (!list) return res.status(404).json({ error: 'Listaa ei löydy' })

    const { added } = await addListItemModel({ listId: list.id, tmdbId })
    if (!added) return res.status(409).json({ error: 'Elokuva on jo listalla' })

    res.status(201).json({ added: true })
  } catch (error) {
    next(error)
  }
}

export { getLists, createList, getList, addListItem }
