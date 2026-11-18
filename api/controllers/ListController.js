import validator from 'validator'
import { createList as createListModel, findListsByOwner } from '../models/List.js'

const MAX_NAME_LENGTH = 100

const trimmed = (value) => (typeof value === 'string' ? value.trim() : '')

const parseName = (body = {}) => {
  const name = trimmed(body.name)
  return validator.isLength(name, { min: 1, max: MAX_NAME_LENGTH }) ? name : null
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

export { getLists, createList }
