import { useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Products from './pages/Products.jsx'
import Auth from './pages/Auth.jsx'
import Cart from './pages/Cart.jsx'
import Orders from './pages/Orders.jsx'
import Admin from './pages/Admin.jsx'
import { SITE_NAME } from './config.js'

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const nav = useNavigate()
  const login = d => { localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify({ name: d.name, role: d.role })); setUser({ name: d.name, role: d.role }); nav('/') }
  const logout = () => { localStorage.clear(); setUser(null); nav('/') }
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">🛍️ {SITE_NAME.slice(0, -4)}<span>{SITE_NAME.slice(-4)}</span></Link><span className="sp" />
        <Link to="/">Home</Link>
        {user && <><Link to="/cart">🛒 Cart</Link><Link to="/orders">📦 Orders</Link></>}
        {user?.role === 'ADMIN' && <Link to="/admin">⚙️ Admin</Link>}
        {user ? <button onClick={logout}>Logout ({user.name})</button> : <><Link to="/login">Login</Link><Link to="/register" className="cta">Register</Link></>}
      </header>
      <div className="wrap">
        <Routes>
          <Route path="/" element={<Products user={user} />} />
          <Route path="/login" element={<Auth mode="login" onAuth={login} />} />
          <Route path="/register" element={<Auth mode="register" onAuth={login} />} />
          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'ADMIN' ? <Admin /> : <Navigate to="/" />} />
        </Routes>
      </div>
      <footer className="foot"><b>{SITE_NAME}</b> — Quality products, fast delivery, easy returns.<br />© 2026 {SITE_NAME}. All rights reserved.</footer>
    </>
  )
}
