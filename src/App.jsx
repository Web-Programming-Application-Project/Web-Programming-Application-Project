import { useState, useEffect } from 'react'
import { api } from './api.js'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/navbar/Navbar'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/Registerpage'
import NotFound from './pages/NotFound'
import Footer from './components/footer/Footer'

function App() {

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
        <Footer />
      </div>
    </>
  )
}

export default App
