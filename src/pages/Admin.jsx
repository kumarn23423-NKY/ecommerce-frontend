import { useEffect, useState } from 'react'
import api from '../api'
import SAMPLE from '../sampleProducts.js'
const STATUSES = ['PLACED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const empty = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' }
export default function Admin() {
  const [orders, setOrders] = useState([]); const [products, setProducts] = useState([]); const [cats, setCats] = useState([])
  const [p, setP] = useState(empty); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState('')
  const load = () => { api.get('/admin/orders').then(r => setOrders(r.data)); api.get('/products', { params: { size: 200 } }).then(r => setProducts(r.data.content)); api.get('/categories').then(r => setCats(r.data)) }
  useEffect(() => { load() }, [])
  const add = async e => {
    e.preventDefault()
    const body = { name: p.name, description: p.description, price: +p.price, stock: +p.stock, imageUrl: p.imageUrl || null, category: p.categoryId ? { id: +p.categoryId } : null }
    await api.post('/admin/products', body); setP(empty); load()
  }
  const seed = async () => {  
    setBusy(true); setMsg('Adding products, please wait...')
    try {
      let all = (await api.get('/categories')).data
      for (const n of [...new Set(SAMPLE.map(s => s[4]))]) if (!all.find(c => c.name === n)) await api.post('/admin/categories', { name: n })
      all = (await api.get('/categories')).data
      const have = (await api.get('/products', { params: { size: 200 } })).data.content.map(x => x.name)
      for (const [name, description, price, stock, cat] of SAMPLE) {
        if (have.includes(name)) continue
        await api.post('/admin/products', { name, description, price, stock, category: { id: all.find(c => c.name === cat).id } })
      }
      setMsg('✅ Sample products added! Home page par jaakar dekhein.')
    } catch (e) { setMsg('Error: ' + (e.response?.data?.error || e.message)) }
    setBusy(false); load()
  }
  const del = async id => { await api.delete(`/admin/products/${id}`); load() }
  const setStatus = async (id, status) => { await api.put(`/admin/orders/${id}/status`, null, { params: { status } }); load() }
  const f = k => e => setP({ ...p, [k]: e.target.value })
  const sales = orders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0)
  return (
    <>
      <h2>⚙️ Admin Dashboard</h2>
      <div className="stats"><div className="card stat">📦 Orders<b>{orders.length}</b></div><div className="card stat">💰 Sales<b>₹{sales}</b></div><div className="card stat">🛍️ Products<b>{products.length}</b></div></div>
      <div className="card sum" style={{ marginBottom: 22 }}>
        <h3>Quick add</h3>
        <button className="btn" disabled={busy} onClick={seed}>{busy ? 'Adding...' : '➕ Add 36 sample products (all categories)'}</button>
        {msg && <p>{msg}</p>}
      </div>
      <h3>Add product</h3>
      <form className="card form2" onSubmit={add}>
        <input placeholder="Name" value={p.name} onChange={f('name')} required />
        <select value={p.categoryId} onChange={f('categoryId')}><option value="">Category</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input className="full" placeholder="Description" value={p.description} onChange={f('description')} />
        <input type="number" placeholder="Price" value={p.price} onChange={f('price')} required />
        <input type="number" placeholder="Stock" value={p.stock} onChange={f('stock')} required />
        <input className="full" placeholder="Image URL (optional)" value={p.imageUrl} onChange={f('imageUrl')} />
        <button className="btn full">Add product</button>
      </form>
      <h3>Products</h3>
      <table><thead><tr><th>Name</th><th>Price</th><th>Stock</th><th></th></tr></thead>
        <tbody>{products.map(x => <tr key={x.id}><td>{x.name}</td><td>₹{x.price}</td><td>{x.stock}</td><td><button className="btn red sm" onClick={() => del(x.id)}>Delete</button></td></tr>)}</tbody></table>
      <h3>Orders</h3>
      <table><thead><tr><th>ID</th><th>Total</th><th>Address</th><th>Status</th></tr></thead>
        <tbody>{orders.map(o => <tr key={o.id}><td>#{o.id}</td><td>₹{o.total}</td><td>{o.address}</td>
          <td><select value={o.status} onChange={e => setStatus(o.id, e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>
    </>
  )
}


