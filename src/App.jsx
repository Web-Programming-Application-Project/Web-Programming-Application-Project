import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/navbar/Navbar'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/Registerpage'
import NotFound from './pages/NotFound'

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
      <Navbar />
      <div id="container">
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/login" exact element={<Loginpage />} />
          <Route path="/register" exact element={<Registerpage />} />
          <Route path="/*" exact element={<NotFound />} />
        </Routes>
      </div>
      <div className="card">
        {loading && <p>Loading...</p>}

        {data && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
            <h3>Data from Backend:</h3>
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
    </>
  )
}

export default App
