import 'bootstrap-icons/font/bootstrap-icons.css'
import './Searchbar.css'

function Searchbar() {
  return (
    <form action="/search" method="GET" className="searchbar">
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
