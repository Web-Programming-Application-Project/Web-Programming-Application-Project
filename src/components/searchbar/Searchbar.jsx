import { useNavigate } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './Searchbar.css'

function Searchbar() {
  const navigate = useNavigate()

  function submit(e) {
    e.preventDefault()
    const query = e.target.elements.q.value.trim()

    if (query) navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form className="searchbar" role="search" onSubmit={submit}>
      <input
        type="search"
        name="q"
        placeholder="Search..."
        aria-label="Search movie"
      />

      <button type="submit" aria-label="Search">
        <i className="bi bi-search"></i>
      </button>
    </form>
  )
}

export default Searchbar
