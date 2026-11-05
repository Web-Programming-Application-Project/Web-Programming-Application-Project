import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './authContext.js'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading)
    return <p>Tarkistetaan kirjautumista…</p>

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
