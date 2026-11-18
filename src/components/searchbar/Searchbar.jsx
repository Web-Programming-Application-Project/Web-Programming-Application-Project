import "./Searchbar.css";

function Searchbar() {
    return (
        <form action="/search" method="GET" className="searchbar">
            <input
            type="search"
            name="q"
            placeholder="Search..."
            aria-label="Search movie"
            />
        
        <button type="submit">

        </button>
        </form>
    );
}

export default Searchbar;