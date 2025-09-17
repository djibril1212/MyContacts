import { useState } from 'react'
import { api, attachToken } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Register () {
  const nav = useNavigate()
  const { setToken, setUser } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [err, setErr] = useState('')

  async function submit (e) {
    e.preventDefault()
    setErr('')
    try {
      const { data } = await api.post('/api/auth/register', form)
      setToken(data.token)
      setUser(data.user)
      attachToken(data.token)
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h1 style={{ marginBottom: 12 }}>Register</h1>
      <form onSubmit={submit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
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
        <button type="submit">Create account</button>
      </form>
      {err && <p style={{ color: 'crimson', marginTop: 8 }}>{err}</p>}
      <p style={{ marginTop: 12 }}>
        Déjà inscrit ? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}