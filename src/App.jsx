import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get('/api/tests')
      setData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <h1>Docker sample</h1>
      <div className="card">
        {loading && <p>Loading...</p>}
        
        {data && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
            <h3>Data from:</h3>
            <ul style={{ textAlign: 'left', margin: '10px 0' }}>
              { data.map((item) => (
                <li key={item.id} style={{ marginBottom: '10px' }}>
                  {`ID: ${item.id} - ${item.description}`}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {error && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#ffebee', color: 'red' }}>
            <h3>Error:</h3>
            <p>{error}</p>
          </div>
        )}
      </div>

      {/*FOOTER*/}
      <footer id="contact">
        {/*<div>*/}
          {/*<h2>FindMovie</h2>*/}
        {/*</div>*/}

        <div>
          <h3>Somet</h3>
          <p><a href="#tiktok">Tik Tok</a></p>
          <p><a href="#YT">YouTube</a></p>
        </div>

        <div>
          <h3>Yhteystiedot</h3>
          <p>Email: ur@screwed.fi</p>
          <p>Phone: 69</p>
        </div>

        <p>
          © 2026 FindMovie. Ryhmä 8.
        </p>
      </footer>
    </>
  )
}

export default App