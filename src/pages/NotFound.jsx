import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-4">404</h1>
      <p className="text-muted">Sivua ei löytynyt.</p>
      <Link className="btn btn-primary" to="/">Etusivulle</Link>
    </div>
  )
}
