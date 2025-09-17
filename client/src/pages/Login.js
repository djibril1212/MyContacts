import { useState } from 'react'
import { api, attachToken } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Login () {
  const nav = useNavigate()
  const { setToken, setUser } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')

  async function submit (e) {
    e.preventDefault()
    setErr('')
    try {
      const { data } = await api.post('/api/auth/login', form)
      setToken(data.token)
      setUser(data.user)
      attachToken(data.token)
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h1 style={{ marginBottom: 12 }}>Login</h1>
      <form onSubmit={submit}>
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      {err && <p style={{ color: 'crimson', marginTop: 8 }}>{err}</p>}
      <p style={{ marginTop: 12 }}>
        Pas de compte ? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}