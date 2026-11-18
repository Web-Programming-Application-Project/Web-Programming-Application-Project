import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api.js'
import './Loginpage.css'

const send = (action, body) =>
  api(`/auth/password-reset/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (token) {
        await send('confirm', { token, password: e.target.password.value })
        navigate('/login', { replace: true })
      } else {
        const data = await send('request', { email: e.target.email.value })
        setMessage(data.message)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="card shadow login-card">
        <div className="card-body p-4">
          <h1 className="h3 text-center mb-4">{token ? 'Uusi salasana' : 'Unohtuiko salasana?'}</h1>
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">
                {token ? 'Uusi salasana' : 'Sähköposti'}
                {token
                  ? <input className="form-control" name='password' type='password' minLength={8} maxLength={128} required />
                  : <input className="form-control" name='email' type='email' required />}
              </label>
            </div>
            <button className="btn btn-primary w-100" disabled={loading}>
              {token ? 'Vaihda salasana' : 'Lähetä palautuslinkki'}
            </button>
          </form>
          {message && <p className="alert alert-success mt-3" role='status'>{message}</p>}
          {error && <p className="alert alert-danger mt-3" role='alert'>{error}</p>}
          <p className="text-center mt-3 mb-0">
            <Link to="/login">Takaisin kirjautumiseen</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
