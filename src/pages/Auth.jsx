import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { SITE_NAME, TAGLINE } from '../config.js'
export default function Auth({ mode, onAuth }) {
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const login = mode === 'login'
  const submit = async e => {
    e.preventDefault(); setErr('')
    try { const { data } = await api.post(`/auth/${mode}`, f); onAuth(data) }
    catch (ex) { setErr(ex.response?.data?.error || 'Something went wrong. Check details and try again.') }
  }
  const set = k => e => setF({ ...f, [k]: e.target.value })
  return (
    <div className="card auth">
      <div className="side">
        <h2>{login ? 'Welcome back!' : `Join ${SITE_NAME}`}</h2>
        <p>{TAGLINE}<br />Thousands of products, secure checkout and easy order tracking — all in one place.</p>
      </div>
      <form onSubmit={submit}>
        <h2>{login ? 'Login' : 'Create account'}</h2>
        <p className="sub">{login ? 'Enter your details to continue' : 'It takes less than a minute'}</p>
        {!login && <><label>Full name</label><input placeholder="Nitish Kumar" value={f.name} onChange={set('name')} required /></>}
        <label>Email</label><input type="email" placeholder="you@example.com" value={f.email} onChange={set('email')} required />
        <label>Password</label>
        <div className="pw">
          <input type={show ? 'text' : 'password'} placeholder="Min 6 characters" value={f.password} onChange={set('password')} required minLength={6} />
          <button type="button" className="eye" onClick={() => setShow(!show)} title={show ? 'Hide' : 'Show'}>{show ? '🙈' : '👁️'}</button>
        </div>
        {err && <p className="err">{err}</p>}
        <button className="btn">{login ? 'Login' : 'Create account'}</button>
        <p className="alt">{login ? <>New here? <Link to="/register">Register</Link></> : <>Already have an account? <Link to="/login">Login</Link></>}</p>
      </form>
    </div>
  )
}
