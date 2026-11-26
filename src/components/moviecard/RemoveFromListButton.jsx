import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { api } from '../../api.js'

export default function RemoveFromListButton({ movie, listId, listName, onRemoved }) {
  const [open, setOpen] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    document.body.classList.add('modal-open')

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !removing) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, removing])

  function openModal() {
    setError('')
    setOpen(true)
  }

  async function removeFromList() {
    setError('')
    setRemoving(true)

    try {
      await api(`/lists/${listId}/items/${movie.id}`, { method: 'DELETE' })
      setOpen(false)
      onRemoved?.(movie.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn remove-from-list-button"
        onClick={openModal}
        aria-label={`Poista ${movie.title} listalta`}
        title="Poista listalta"
      >
        <i className="bi bi-trash" aria-hidden="true"></i>
      </button>

      {open && createPortal(
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`remove-from-list-title-${movie.id}`}
            onClick={(event) => {
              if (event.target === event.currentTarget && !removing) setOpen(false)
            }}
          >
            <div className="modal-dialog modal-dialog-centered modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-6" id={`remove-from-list-title-${movie.id}`}>
                    Poista listalta
                  </h2>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Sulje"
                    onClick={() => setOpen(false)}
                    disabled={removing}
                    autoFocus
                  ></button>
                </div>

                <div className="modal-body">
                  <p className="small text-muted mb-0">
                    Poistetaanko <strong>{movie.title}</strong> listalta: <strong>{listName}</strong>?
                  </p>

                  {error && (
                    <p className="alert alert-danger small mt-3 mb-0" role="alert">{error}</p>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setOpen(false)}
                    disabled={removing}
                  >
                    Peruuta
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={removeFromList}
                    disabled={removing}
                  >
                    {removing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Poistetaan…
                      </>
                    ) : (
                      'Poista'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" onClick={() => !removing && setOpen(false)}></div>
        </>,
        document.body
      )}
    </>
  )
}
