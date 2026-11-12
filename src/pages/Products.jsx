import { useEffect, useState } from 'react'
import api from '../api'
import { SITE_NAME, TAGLINE } from '../config.js'

export const emoji = n => ({ Electronics: '🎧', Clothing: '👕', Mobiles: '📱', Footwear: '👟', Books: '📚', 'Home & Kitchen': '🏠', Beauty: '💄', Sports: '⚽' }[n] || '🛍️')

export default function Products({ user }) {
  const [list, setList] = useState([]); const [cats, setCats] = useState([])
  const [q, setQ] = useState(''); const [cat, setCat] = useState(''); const [page, setPage] = useState(0); const [pages, setPages] = useState(1)
  const [msg, setMsg] = useState('')
  useEffect(() => { api.get('/categories').then(r => setCats(r.data)) }, [])
  useEffect(() => {
    api.get('/products', { params: { q: q || undefined, category: cat || undefined, page, size: 8 } })
      .then(r => { setList(r.data.content); setPages(r.data.totalPages) })
  }, [q, cat, page])  
  const add = async p => {
    if (!user) return setMsg('Please login first to add items to cart')
    await api.post('/cart', { productId: p.id, quantity: 1 }); setMsg(`✅ ${p.name} added to cart`)
  }
  return (
    <>
      <div className="hero"><h1>Welcome to {SITE_NAME}</h1><p>{TAGLINE} Best deals on electronics, fashion and more.</p></div>
      <div className="bar">
        <input placeholder="🔍 Search products..." value={q} onChange={e => { setQ(e.target.value); setPage(0) }} />
        <select value={cat} onChange={e => { setCat(e.target.value); setPage(0) }}>
          <option value="">All categories</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {msg && <div className="toast">{msg}</div>}
      <div className="grid">
        {list.map(p => (
          <div className="card pcard" key={p.id}>
            <div className="pimg">{p.imageUrl ? <img src={p.imageUrl} alt={p.name} /> : emoji(p.category?.name)}</div>
            <div className="pbody">
              {p.category && <span className="tag">{p.category.name}</span>}
              <h3>{p.name}</h3><p>{p.description}</p>
              <div className="price">₹{p.price}</div>
              <div className={p.stock > 0 ? 'stock' : 'stock out'}>{p.stock > 0 ? `In stock (${p.stock} left)` : 'Out of stock'}</div>
              <button className="btn" disabled={p.stock < 1} onClick={() => add(p)}>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p style={{ textAlign: 'center' }}>No products found.</p>}
      <div className="pager">
        <button className="btn" disabled={page === 0} onClick={() => setPage(page - 1)}>← Prev</button>
        <span>Page {page + 1} of {pages}</span>
        <button className="btn" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next →</button>
      </div>
    </>
  )
}
