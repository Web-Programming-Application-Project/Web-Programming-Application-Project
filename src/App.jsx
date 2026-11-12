import './App.css'
import { Routes,Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/navbar/Navbar'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/Registerpage'
import NotFound from './pages/NotFound'
import Footer from './components/footer/Footer'
import Accountpage from './pages/Accountpage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <Navbar />
      <div id="container">
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/login" exact element={<Loginpage />} />
          <Route path="/register" exact element={<Registerpage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Accountpage />} />
          </Route>
          <Route path="/*" exact element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App
