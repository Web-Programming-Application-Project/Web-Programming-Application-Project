import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/authContext.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(e.target.identifier.value, e.target.password.value)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1>Kirjaudu</h1>
      <form onSubmit={submit}>
        <label>
          Sähköposti tai käyttäjänimi
          <input name='identifier' type='text' required />
        </label>
        <label>
          Salasana
          <input name='password' type='password' required />
        </label>
        <button>Kirjaudu</button>
      </form>
      {error && <p role='alert'>{error}</p>}
    </>
  )
}