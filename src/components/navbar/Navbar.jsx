import { Form, Link } from 'react-router-dom'

export default function Navbar() {
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

            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
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
