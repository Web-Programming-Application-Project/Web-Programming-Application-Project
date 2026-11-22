import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../components/authContext.js'
import FormField from '../components/FormField'
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
              <FormField label="Sähköposti" name="identifier" />
              <FormField label="Salasana" name="password" type="password" />
              <button className="btn btn-primary w-100" disabled={loading}>Kirjaudu</button>
            </form>
            {error && <p className="alert alert-danger" role='alert'>{error}</p>}
            <p className="text-center mt-3 mb-0">
              <Link to="/reset-password">Unohtuiko salasana?</Link>
            </p>
            <p className="text-center mt-2 mb-0">
              Eikö ole tiliä? <Link to="/register">Rekisteröidy</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
