import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { emoji } from './Products.jsx'
export default function Cart() {
  const [items, setItems] = useState([]); const [address, setAddress] = useState(''); const [pay, setPay] = useState('COD'); const [err, setErr] = useState('')
  const nav = useNavigate()
  const load = () => api.get('/cart').then(r => setItems(r.data))
  useEffect(() => { load() }, [])
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const remove = async id => { await api.delete(`/cart/${id}`); load() }
  const place = async () => {
    setErr('')
    try { await api.post('/orders', { address, paymentMethod: pay }); nav('/orders') }
    catch (e) { setErr(e.response?.data?.error || 'Failed to place order') }
  }
  if (!items.length) return <div className="card sum" style={{ textAlign: 'center' }}><h2>🛒 Your cart is empty</h2><p>Add some products to get started.</p></div>
  return (
    <>
      <h2>🛒 Your Cart</h2>
      <div className="two">
        <div className="card">
          {items.map(i => (
            <div className="item" key={i.id}>
              <span className="em">{emoji(i.product.category?.name)}</span>
              <span className="nm">{i.product.name}<br /><small>₹{i.product.price} × {i.quantity}</small></span>
              <b>₹{i.product.price * i.quantity}</b>
              <button className="btn red sm" onClick={() => remove(i.id)}>Remove</button>
            </div>
          ))}
        </div>
        <div className="card sum">
          <h3>Order Summary</h3>
          <div className="line"><span>Items</span><span>{items.length}</span></div>
          <div className="line tot"><span>Total</span><span>₹{total}</span></div>
          <label>Delivery address</label><textarea rows="3" placeholder="House no, street, city, pincode" value={address} onChange={e => setAddress(e.target.value)} />
          <label>Payment method</label>
          <select value={pay} onChange={e => setPay(e.target.value)}><option value="COD">Cash on Delivery</option><option value="ONLINE">Online (test)</option></select>
          {err && <p className="err">{err}</p>}
          <button className="btn" style={{ marginTop: 16 }} disabled={!address} onClick={place}>Place order</button>
        </div>
      </div>
    </>
  )
}
