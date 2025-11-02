import './App.css'
import {Routes ,Route}from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import Navbar from './components/Navbar'
import { useState, useEffect } from 'react'

const App = () => {
  const [user, setUser] = useState(null)

  // Check token on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUser(payload)
      } catch {
        localStorage.removeItem("token")
      }
    }
  }, [])

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<ProductsPage user={user}/>}/>
        <Route path="/login" element={<LoginPage setUser={setUser}/>}/>
        <Route path="/cart" element={<CartPage user={user}/>}/>
      </Routes>
    </>
  )
}

export default App
