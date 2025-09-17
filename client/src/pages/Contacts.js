import { useEffect, useState } from 'react'
import { api, attachToken } from '../lib/api'
import { useAuth } from '../store/auth'

export default function Contacts () {
  const { token, logout } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' })
  const [err, setErr] = useState('')

  useEffect(() => {
    attachToken(token)
    fetchList()
  }, [token])

  async function fetchList () {
    try {
      const { data } = await api.get('/api/contacts')
      setItems(data.items)
    } catch (e) {
      setErr(e?.response?.data?.message || 'Erreur de chargement')
    }
  }

  async function addContact (e) {
    e.preventDefault()
    setErr('')
    try {
      const { data } = await api.post('/api/contacts', form)
      setItems(prev => [data, ...prev])
      setForm({ firstName: '', lastName: '', phone: '' })
    } catch (e) {
      setErr(e?.response?.data?.message || 'Échec de création')
    }
  }

  async function remove (id) {
    try {
      await api.delete(`/api/contacts/${id}`)
      setItems(prev => prev.filter(x => x._id !== id))
    } catch (e) {
      setErr(e?.response?.data?.message || 'Échec de suppression')
    }
  }

  return (
    <div className="container">
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 12 }}>
        <h1>Mes contacts</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <form onSubmit={addContact}
            style={{ display:'grid', gap:12, gridTemplateColumns:'1fr 1fr 1fr auto' }}>
        <input placeholder='First name'
               value={form.firstName}
               onChange={e => setForm({ ...form, firstName: e.target.value })}
               required />
        <input placeholder='Last name'
               value={form.lastName}
               onChange={e => setForm({ ...form, lastName: e.target.value })}
               required />
        <input placeholder='Phone'
               value={form.phone}
               onChange={e => setForm({ ...form, phone: e.target.value })}
               required />
        <button type='submit'>Ajouter</button>
      </form>

      {err && <p style={{color:'crimson', marginTop:8}}>{err}</p>}

      <ul className="contact-list">
        {items.map(c => (
          <li key={c._id}>
            <span>{c.firstName}</span>
            <span>{c.lastName}</span>
            <span>{c.phone}</span>
            <button onClick={() => remove(c._id)}>Supprimer</button>
          </li>
        ))}
        {items.length === 0 && <p>Aucun contact</p>}
      </ul>
    </div>
  )
}