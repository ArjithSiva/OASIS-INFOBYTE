import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, STATUSES } from '../api.js';

function Tracker({ status }) {
  const idx = STATUSES.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-2">
      {STATUSES.map((s, i) => (
        <div key={s} className="flex-1">
          <div className={`h-2 rounded ${i <= idx ? 'bg-green-500' : 'bg-gray-200'}`} />
          <p className={`text-xs mt-1 ${i === idx ? 'font-bold text-green-700' : 'text-gray-500'}`}>{s}</p>
        </div>
      ))}
    </div>
  );
}
export default function Dashboard() {
  const nav = useNavigate();
  const [pizzas, setPizzas] = useState([]); const [orders, setOrders] = useState([]);
  useEffect(() => { api('/menu').then(d => setPizzas(d.pizzas)).catch(() => {}); }, []);
  useEffect(() => {                       // polling: refresh order status every 5s
    const load = () => api('/orders/mine').then(setOrders).catch(() => {});
    load(); const t = setInterval(load, 5000); return () => clearInterval(t);
  }, []);
  return (
    <main className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Our Pizzas</h2>
        <Link to="/build" className="bg-red-700 text-white px-4 py-2 rounded-lg font-semibold">Build your own</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pizzas.map(p => (
          <div key={p._id} className="bg-white rounded-xl shadow p-4 flex flex-col">
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-sm text-gray-600 flex-1">{p.description}</p>
            <p className="text-xs text-gray-500 mt-2">{p.base} · {p.sauce} · {p.cheese}</p>
            <button className="mt-3 border border-red-700 text-red-700 rounded-lg py-1 hover:bg-red-50"
              onClick={() => nav('/build', { state: { preset: p } })}>Customise & order</button>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-3">My Orders <span className="text-xs font-normal text-gray-500">(live)</span></h2>
      {!orders.length && <p className="text-gray-500">No orders yet.</p>}
      <div className="grid gap-3">
        {orders.map(o => (
          <div key={o._id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between"><b>₹{o.amount}</b><span className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</span></div>
            <p className="text-sm text-gray-600">{o.details.base}, {o.details.sauce}, {o.details.cheese}{o.details.veggies.length ? ' + ' + o.details.veggies.join(', ') : ''}</p>
            <Tracker status={o.status} />
          </div>
        ))}
      </div>
    </main>
  );
}
