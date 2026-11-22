import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../authContext'
import 'bootstrap-icons/font/bootstrap-icons.css'

const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

function NavSearch() {
  const navigate = useNavigate()

  function submit(e) {
    e.preventDefault()
    const query = e.target.elements.q.value.trim()

    if (query) navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form className="d-flex" role="search" onSubmit={submit}>
      <input
        className="form-control me-2"
        type="search"
        name="q"
        placeholder="Search..."
        aria-label="Search"
      />
      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  )
}

function NavLinks({ user, onLogout }) {
  return (
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <NavLink className={linkClass} to="/" end>Home</NavLink>
      </li>

      {user ? (
        <>
          <li className="nav-item">
            <NavLink className={linkClass} to="/profile">Account</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={linkClass} to="/lists">Lists</NavLink>
          </li>
          <li className="nav-item">
            <button type="button" className="nav-link" onClick={onLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <li className="nav-item">
          <NavLink className={linkClass} to="/login">Login</NavLink>
        </li>
      )}
    </ul>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate('/', { replace: true })
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          <i className="bi bi-film me-2"></i>Findmovie
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <NavLinks user={user} onLogout={handleLogout} />
          <NavSearch />
        </div>
      </div>
    </nav>
  )
}
