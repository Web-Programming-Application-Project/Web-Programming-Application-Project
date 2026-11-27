import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './Searchbar.css'

const MIN_QUERY_LENGTH = 2
const SUGGESTION_LIMIT = 6
const DEBOUNCE_MS = 300

function SuggestionList({ id, movies, status, activeIndex, onHover, onSelect }) {
  return (
    <ul className="searchbar-suggestions" id={id} role="listbox" aria-label="Search suggestions">
      {status === 'loading' && (
        <li className="searchbar-status" role="presentation">
          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
          Haetaan ehdotuksia…
        </li>
      )}

      {status === 'done' && movies.length === 0 && (
        <li className="searchbar-status" role="presentation">Ei ehdotuksia</li>
      )}

      {movies.map((movie, index) => {
        const year = movie.releaseDate?.slice(0, 4)

        return (
          <li
            key={movie.id}
            id={`${id}-option-${index}`}
            className={`searchbar-suggestion ${index === activeIndex ? 'active' : ''}`}
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => onHover(index)}
            onClick={() => onSelect(movie)}
          >
            {movie.posterPath ? (
              <img
                className="searchbar-suggestion-poster"
                src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                alt=""
                loading="lazy"
              />
            ) : (
              <span
                className="searchbar-suggestion-poster searchbar-suggestion-poster--empty"
                aria-hidden="true"
              >
                <i className="bi bi-film"></i>
              </span>
            )}

            <span className="searchbar-suggestion-title">{movie.title}</span>
            {year && <span className="searchbar-suggestion-year">{year}</span>}
          </li>
        )
      })}
    </ul>
  )
}

function useSuggestions(term) {
  const [suggestions, setSuggestions] = useState([])
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    if (term.length < MIN_QUERY_LENGTH) {
      setSuggestions([])
      setStatus('idle')
      return
    }

    let cancelled = false
    setSuggestions([])
    setStatus('loading')

    const timer = setTimeout(() => {
      const params = new URLSearchParams({ q: term, limit: String(SUGGESTION_LIMIT) })

      api(`/movies/suggestions?${params}`)
        .then((data) => {
          if (cancelled) return
          setSuggestions(data.results ?? [])
          setStatus('done')
        })
        .catch(() => {
          if (cancelled) return
          setSuggestions([])
          setStatus('done')
        })
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [term])

  return { suggestions, status }
}

export default function Searchbar() {
  const navigate = useNavigate()
  const listId = useId()
  const wrapperRef = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const term = query.trim()
  const { suggestions, status } = useSuggestions(term)
  const showSuggestions = open && term.length >= MIN_QUERY_LENGTH

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function goToSearch(value) {
    const next = value.trim()
    if (!next) return

    setOpen(false)
    setActiveIndex(-1)
    navigate(`/search?q=${encodeURIComponent(next)}`)
  }

  function selectSuggestion(movie) {
    setQuery(movie.title)
    goToSearch(movie.title)
  }

  function submit(event) {
    event.preventDefault()
    const selected = suggestions[activeIndex]

    if (selected) selectSuggestion(selected)
    else goToSearch(query)
  }

  function handleChange(event) {
    setQuery(event.target.value)
    setOpen(true)
    setActiveIndex(-1)
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
      return
    }

    if (!showSuggestions || suggestions.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1))
    }
  }

  return (
    <div className="searchbar-wrapper" ref={wrapperRef}>
      <form className="searchbar" role="search" onSubmit={submit}>
        <input
          type="search"
          name="q"
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          aria-label="Search movie"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls={showSuggestions ? listId : undefined}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
          autoComplete="off"
        />

        <button type="submit" aria-label="Search">
          <i className="bi bi-search"></i>
        </button>
      </form>

      {showSuggestions && (
        <SuggestionList
          id={listId}
          movies={suggestions}
          status={status}
          activeIndex={activeIndex}
          onHover={setActiveIndex}
          onSelect={selectSuggestion}
        />
      )}
    </div>
  )
}
