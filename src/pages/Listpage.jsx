import { useEffect, useState } from 'react'
import { api } from '../api.js'
import './Listpage.css'

const MAX_NAME_LENGTH = 100

function ListForm({ name, onNameChange, onSubmit, creating }) {
  return (
    <form className="card shadow-sm mb-4" onSubmit={onSubmit}>
      <div className="card-body">
        <label className="form-label" htmlFor="list-name">Listan nimi</label>
        <div className="input-group">
          <input
            id="list-name"
            className="form-control"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            placeholder="Esim. Katsottavat"
            required
          />
          <button className="btn btn-primary" type="submit" disabled={creating}>
            {creating ? 'Luodaan…' : 'Luo lista'}
          </button>
        </div>
      </div>
    </form>
  )
}

function ListCard({ list }) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h2 className="h5 card-title">{list.name}</h2>
          <p className="card-text text-muted mb-0">
            Luotu {new Date(list.createdAt).toLocaleDateString('fi-FI')}
          </p>
        </div>
      </div>
    </div>
  )
}

function useLists() {
  const [lists, setLists] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let cancelled = false

    api('/lists')
      .then((data) => {
        if (!cancelled) setLists(data.lists ?? [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function createList(name) {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Anna listalle nimi')
      return false
    }

    setError('')
    setCreating(true)
    try {
      const data = await api('/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed })
      })
      setLists((current) => [data.list, ...current])
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setCreating(false)
    }
  }

  return { lists, error, loading, creating, createList }
}

export default function Listpage() {
  const { lists, error, loading, creating, createList } = useLists()
  const [name, setName] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (await createList(name)) setName('')
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Omat listat</h1>

      <ListForm
        name={name}
        onNameChange={setName}
        onSubmit={submit}
        creating={creating}
      />

      {error && <p className="alert alert-danger" role="alert">{error}</p>}

      {loading ? (
        <p className="text-muted">Ladataan listoja…</p>
      ) : lists.length === 0 ? (
        <p className="text-muted">Sinulla ei ole vielä listoja. Luo ensimmäinen lista yllä.</p>
      ) : (
        <div className="row g-3">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  )
}
