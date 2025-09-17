import { useEffect, useState } from 'react'
import { api, attachToken } from '../lib/api'
import { useAuth } from '../store/auth'

export default function Contacts () {
  const { token, logout } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' })
  const [err, setErr] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '' })
  const [loadingId, setLoadingId] = useState(null) // pour désactiver un bouton pendant une requête

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

  function startEdit (c) {
    setEditingId(c._id)
    setEditForm({ firstName: c.firstName, lastName: c.lastName, phone: c.phone })
  }

  function cancelEdit () {
    setEditingId(null)
    setEditForm({ firstName: '', lastName: '', phone: '' })
  }

  async function saveEdit (id) {
    try {
      setLoadingId(id)
      const { data } = await api.patch(`/api/contacts/${id}`, editForm)
      setItems(prev => prev.map(x => (x._id === id ? data : x)))
      cancelEdit()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Échec de la mise à jour')
    } finally {
      setLoadingId(null)
    }
  }

  async function remove (id) {
    try {
      setLoadingId(id)
      await api.delete(`/api/contacts/${id}`)
      setItems(prev => prev.filter(x => x._id !== id))
    } catch (e) {
      setErr(e?.response?.data?.message || 'Échec de suppression')
    } finally {
      setLoadingId(null)
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
        {items.map(c => {
          const isEditing = editingId === c._id
          return (
            <li key={c._id} style={{ alignItems: 'center' }}>
              {isEditing ? (
                <>
                  <input
                    value={editForm.firstName}
                    onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                  <input
                    value={editForm.lastName}
                    onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                  <input
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                  <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                    <button type="button" onClick={() => saveEdit(c._id)} disabled={loadingId === c._id}>
                      {loadingId === c._id ? '...' : 'Sauver'}
                    </button>
                    <button type="button" onClick={cancelEdit} style={{ background:'#6c757d' }}>
                      Annuler
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{c.firstName}</span>
                  <span>{c.lastName}</span>
                  <span>{c.phone}</span>
                  <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                    <button type="button" onClick={() => startEdit(c)}>Modifier</button>
                    <button type="button" onClick={() => remove(c._id)} disabled={loadingId === c._id} style={{ background:'#dc3545' }}>
                      {loadingId === c._id ? '...' : 'Supprimer'}
                    </button>
                  </div>
                </>
              )}
            </li>
          )
        })}
        {items.length === 0 && <p>Aucun contact</p>}
      </ul>
    </div>
  )
}