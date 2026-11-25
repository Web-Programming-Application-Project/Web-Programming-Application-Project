import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { api } from '../../api.js'

export default function AddToListButton({ movie }) {
  const [open, setOpen] = useState(false)
  const [lists, setLists] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [statuses, setStatuses] = useState({})
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!open) return

    document.body.classList.add('modal-open')

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function loadLists() {
    setLoading(true)
    setError('')

    try {
      const data = await api('/lists')
      setLists(data.lists ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function openModal() {
    setOpen(true)
    setActionError('')
    if (!lists) loadLists()
  }

  async function addToList(listId) {
    setActionError('')
    setStatuses((current) => ({ ...current, [listId]: 'adding' }))

    try {
      await api(`/lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbId: movie.id })
      })

      setStatuses((current) => ({ ...current, [listId]: 'added' }))
      setAdded(true)
    } catch (err) {
      if (err.status === 409) {
        setStatuses((current) => ({ ...current, [listId]: 'added' }))
        setAdded(true)
        return
      }

      setStatuses((current) => ({ ...current, [listId]: 'idle' }))
      setActionError(err.message)
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn add-to-list-button"
        onClick={openModal}
        aria-label={`Lisää ${movie.title} listalle`}
        title="Lisää listalle"
      >
        <i className={`bi ${added ? 'bi-check-lg' : 'bi-plus-lg'}`} aria-hidden="true"></i>
      </button>

      {open && createPortal(
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`add-to-list-title-${movie.id}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false)
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-6" id={`add-to-list-title-${movie.id}`}>
                    Lisää listalle
                  </h2>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Sulje"
                    onClick={() => setOpen(false)}
                    autoFocus
                  ></button>
                </div>

                <div className="modal-body">
                  <p className="small text-muted">{movie.title}</p>

                  {loading && (
                    <div className="text-center text-muted py-3">
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Ladataan listoja…
                    </div>
                  )}

                  {!loading && error && (
                    <div className="alert alert-danger mb-0" role="alert">
                      {error}
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 ms-1 align-baseline"
                        onClick={loadLists}
                      >
                        Yritä uudelleen
                      </button>
                    </div>
                  )}

                  {!loading && !error && lists?.length === 0 && (
                    <p className="text-muted small mb-0">
                      Sinulla ei ole vielä listoja.{' '}
                      <Link to="/lists" onClick={() => setOpen(false)}>Luo ensimmäinen lista</Link>.
                    </p>
                  )}

                  {!loading && !error && lists?.length > 0 && (
                    <div className="list-group">
                      {lists.map((list) => {
                        const status = statuses[list.id] ?? 'idle'

                        return (
                          <button
                            key={list.id}
                            type="button"
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            onClick={() => addToList(list.id)}
                            disabled={status === 'adding' || status === 'added'}
                          >
                            <span>{list.name}</span>

                            {status === 'adding' ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : status === 'added' ? (
                              <i className="bi bi-check-lg text-success" aria-hidden="true"></i>
                            ) : (
                              <i className="bi bi-plus-lg" aria-hidden="true"></i>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {actionError && (
                    <p className="alert alert-danger small mt-3 mb-0" role="alert">{actionError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" onClick={() => setOpen(false)}></div>
        </>,
        document.body
      )}
    </>
  )
}