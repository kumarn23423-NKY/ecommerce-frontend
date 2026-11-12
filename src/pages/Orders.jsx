import { useEffect, useState } from 'react'
import api from '../api'
export default function Orders() {
  const [orders, setOrders] = useState([])
  const load = () => api.get('/orders').then(r => setOrders(r.data))
  useEffect(() => { load() }, [])
  const cancel = async id => { await api.post(`/orders/${id}/cancel`); load() }
  return (
    <>
      <h2>📦 My Orders</h2>
      {!orders.length && <div className="card sum">No orders yet.</div>}
      {orders.map(o => (
        <div className="card ord" key={o.id}>
          <div className="ohead"><b>Order #{o.id}</b><span className={`badge ${o.status}`}>{o.status}</span><span>₹{o.total}</span><span>{o.paymentMethod} · {o.paymentStatus}</span></div>
          <div style={{ color: '#6b7280', fontSize: 14 }}>📍 {o.address}</div>
          <ul>{o.items.map(i => <li key={i.id}>{i.product?.name} × {i.quantity}</li>)}</ul>
          {['PLACED', 'PACKED'].includes(o.status) && <button className="btn red sm" onClick={() => cancel(o.id)}>Cancel order</button>}
        </div>
      ))}
    </>
  )
}
