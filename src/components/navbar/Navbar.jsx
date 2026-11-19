import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../authContext'


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
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Account</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/lists">Lists</Link>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="nav-link btn btn-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>

              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>

          <form className="d-flex"
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              const query = e.target.elements.q.value.trim()

              if (query) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`
              }
            }}
           >

           <input className="form-control me-2"
              type="search"
              name="q"
              placeholder="Search..."
              aria-label="Search"
           />

            <button className="btn-outline-success"
              type="submit">
              Search
            </button>
          </form>

        </div>
      </div>
    </nav>
  )
}
