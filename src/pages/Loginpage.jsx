import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/authContext.js'
import './Loginpage.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(e.target.identifier.value, e.target.password.value)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
     <div className="login-wrapper">
      <div className="card shadow login-card">
        <div className="card-body p-4">
          <h1 className="h3 text-center mb-4">Kirjaudu</h1>
          <form onSubmit={submit}>
            <div className="mb-3">
            <label className="form-label">
              Sähköposti
              <input className="form-control" name='email' type='email' required />
            </label>
            </div>
            <div className="mb-3">
            <label className="form-label">
              Salasana
              <input className="form-control" name='password' type='password' required />
            </label>
            </div>
            <button className="btn btn-primary w-100" disabled={loading}>Kirjaudu</button>
          </form>
          {error && <p className="alert alert-danger" role='alert'>{error}</p>}
          </div>
        </div>
      </div>
      </>
  )
}
