import { useEffect, useState } from 'react';
import { api, STATUSES } from '../api.js';

function Row({ item, onSaved }) {
  const [stock, setStock] = useState(item.stock); const [th, setTh] = useState(item.threshold);
  useEffect(() => { setStock(item.stock); setTh(item.threshold); }, [item.stock, item.threshold]);
  const low = item.stock < item.threshold;
  const save = async () => { await api(`/admin/inventory/${item._id}`, { method: 'PATCH', body: { stock: Number(stock), threshold: Number(th) } }); onSaved(); };
  return (
    <tr className={low ? 'bg-red-50' : ''}>
      <td className="p-2">{item.name}{low && <span className="ml-2 text-xs text-red-600 font-semibold">LOW</span>}</td>
      <td className="p-2 capitalize">{item.category}</td>
      <td className="p-2"><input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} className="w-20 border rounded p-1" /></td>
      <td className="p-2"><input type="number" min="0" value={th} onChange={e => setTh(e.target.value)} className="w-20 border rounded p-1" /></td>
      <td className="p-2"><button onClick={save} className="bg-red-700 text-white rounded px-3 py-1">Save</button></td>
    </tr>
  );
}
export default function Admin() {
  const [tab, setTab] = useState('inventory');
  const [inv, setInv] = useState([]); const [orders, setOrders] = useState([]);
  const loadInv = () => api('/admin/inventory').then(setInv).catch(() => {});
  const loadOrders = () => api('/admin/orders').then(setOrders).catch(() => {});
  useEffect(() => { loadInv(); loadOrders(); const t = setInterval(() => { loadOrders(); loadInv(); }, 5000); return () => clearInterval(t); }, []);
  const setStatus = async (id, status) => { await api(`/admin/orders/${id}`, { method: 'PATCH', body: { status } }); loadOrders(); };
  return (
    <main className="max-w-5xl mx-auto p-4">
      <div className="flex gap-2 mb-4">
        {['inventory', 'orders'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg capitalize ${tab === t ? 'bg-red-700 text-white' : 'bg-white'}`}>{t}</button>
        ))}
      </div>
      {tab === 'inventory' ? (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left"><thead className="bg-gray-100"><tr><th className="p-2">Item</th><th className="p-2">Type</th><th className="p-2">Stock</th><th className="p-2">Alert below</th><th /></tr></thead>
            <tbody>{inv.map(i => <Row key={i._id} item={i} onSaved={loadInv} />)}</tbody></table>
        </div>
      ) : (
        <div className="grid gap-3">
          {!orders.length && <p className="text-gray-500">No orders yet.</p>}
          {orders.map(o => (
            <div key={o._id} className="bg-white rounded-xl shadow p-4 flex flex-wrap justify-between gap-3 items-center">
              <div>
                <p className="font-semibold">{o.user?.name} <span className="text-xs text-gray-500">{o.user?.email}</span></p>
                <p className="text-sm text-gray-600">{o.details.base}, {o.details.sauce}, {o.details.cheese}{o.details.veggies.length ? ' + ' + o.details.veggies.join(', ') : ''} · ₹{o.amount}</p>
                <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <select value={o.status} onChange={e => setStatus(o._id, e.target.value)} className="border rounded p-2">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
