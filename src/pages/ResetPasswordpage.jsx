import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api.js'
import FormField from '../components/FormField'
import './Loginpage.css'

const send = (action, body) =>
  api(`/auth/password-reset/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

// uusi salasana jos on token, muuten palautuslinkin pyyntö
const sendReset = (token, form) =>
  token
    ? send('confirm', { token, password: form.password.value })
    : send('request', { email: form.email.value })

const TEXTS = {
  confirm: { title: 'Uusi salasana', label: 'Uusi salasana', button: 'Vaihda salasana' },
  request: { title: 'Unohtuiko salasana?', label: 'Sähköposti', button: 'Lähetä palautuslinkki' },
}

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const text = token ? TEXTS.confirm : TEXTS.request

  async function submit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const data = await sendReset(token, e.target)
      if (token) navigate('/login', { replace: true })
      else setMessage(data.message)
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
          <h1 className="h3 text-center mb-4">{text.title}</h1>
          <form onSubmit={submit}>
            {token
              ? <FormField label={text.label} name="password" type="password" minLength={8} maxLength={128} />
              : <FormField label={text.label} name="email" type="email" />}
            <button className="btn btn-primary w-100" disabled={loading}>{text.button}</button>
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
