import './App.css'
import { Routes,Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/navbar/Navbar'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/Registerpage'
import ResetPasswordpage from './pages/ResetPasswordpage'
import NotFound from './pages/NotFound'
import Footer from './components/footer/Footer'
import Accountpage from './pages/Accountpage'
import ProtectedRoute from './components/ProtectedRoute'
import Listpage from './pages/Listpage'
import Resultspage from './pages/Resultpage'

function App() {

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div id="container">
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/login" exact element={<Loginpage />} />
          <Route path="/register" exact element={<Registerpage />} />
          <Route path="/reset-password" element={<ResetPasswordpage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Accountpage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/lists" element={<Listpage />} />
          </Route>
          <Route path="/search" element={<Resultspage />} />
          <Route path="/*" exact element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}

export default App
