import { useEffect, useState } from 'react';
import { api, STATUSES } from '../api.js';

const CATS = [['base', 'Pizza bases'], ['sauce', 'Sauces'], ['cheese', 'Cheeses'], ['veggie', 'Veggies']];
const FORWARD = ['Start cooking', 'Send to delivery'];
const EMPTY = ['No new orders.', 'Nothing in the kitchen right now.', 'Nothing out for delivery.'];

function StockRow({ item, onSaved }) {
  const [stock, setStock] = useState(item.stock);
  const [th, setTh] = useState(item.threshold);
  const [state, setState] = useState('idle');       // idle | saving | saved | error
  useEffect(() => { setStock(item.stock); setTh(item.threshold); }, [item.stock, item.threshold]);

  const low = item.stock < item.threshold;
  const dirty = Number(stock) !== item.stock || Number(th) !== item.threshold;
  const pct = Math.min(100, Math.round((item.stock / Math.max(item.threshold * 3, 1)) * 100));

  const save = async () => {
    if (!(Number(stock) >= 0) || !(Number(th) >= 0)) { setState('error'); return; }
    setState('saving');
    try {
      await api(`/admin/inventory/${item._id}`, { method: 'PATCH', body: { stock: Number(stock), threshold: Number(th) } });
      await onSaved();
      setState('saved');
      setTimeout(() => setState('idle'), 1500);
    } catch { setState('error'); }
  };

  return (
    <li className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line py-3">
      <div className="w-44">
        <p className="font-semibold">{item.name}</p>
        {low && <p className="text-sm font-semibold text-tomato-deep">Low stock</p>}
      </div>
      <div role="img" aria-label={`${item.stock} in stock`} className="h-2 min-w-24 flex-1 rounded-full bg-line">
        <div className={`h-2 rounded-full ${low ? 'bg-tomato' : 'bg-leaf'}`} style={{ width: `${pct}%` }} />
      </div>
      <label className="text-sm text-mute">In stock
        <input type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} className="field ml-2 inline-block w-20 py-1.5" />
      </label>
      <label className="text-sm text-mute">Alert below
        <input type="number" min="0" value={th} onChange={e => setTh(e.target.value)} className="field ml-2 inline-block w-20 py-1.5" />
      </label>
      <button className="btn btn-basil btn-sm w-20" disabled={!dirty || state === 'saving'} onClick={save}>
        {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved' : 'Save'}
      </button>
      {state === 'error' && <p role="alert" className="w-full text-sm text-tomato-deep">Couldn't save. Enter whole numbers of 0 or more and try again.</p>}
    </li>
  );
}

function OrderCard({ o, col, move }) {
  const d = o.details;
  const lines = [d.base, d.sauce, d.cheese, ...d.veggies];
  return (
    <li className="rounded-xl bg-paper p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex justify-between gap-2">
        <p className="font-semibold">{o.user?.name || 'Customer'}</p>
        <p className="font-display font-bold">₹{o.amount}</p>
      </div>
      <p className="text-xs text-mute">{o.user?.email}</p>
      <p className="text-xs text-mute">{new Date(o.createdAt).toLocaleString()}</p>
      <p className="mt-2 text-sm">{lines.join(', ')}</p>
      <div className="mt-3 flex items-center justify-between">
        {col > 0
          ? <button className="text-sm text-mute underline underline-offset-4" onClick={() => move(o, col - 1)}>Move back</button>
          : <span />}
        {col < FORWARD.length && (
          <button className="btn btn-basil btn-sm" onClick={() => move(o, col + 1)}>{FORWARD[col]}</button>
        )}
      </div>
    </li>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('orders');
  const [inv, setInv] = useState([]);
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState('');

  const loadInv = () => api('/admin/inventory').then(setInv).catch(e => setErr(e.message));
  const loadOrders = () => api('/admin/orders').then(setOrders).catch(e => setErr(e.message));

  useEffect(() => {                         // orders refresh every 5s
    loadOrders();
    const t = setInterval(loadOrders, 5000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {                         // stock refreshes on the orders tab; on the stock tab it only reloads after a save so edits aren't overwritten
    loadInv();
    if (tab !== 'orders') return;
    const t = setInterval(loadInv, 15000);
    return () => clearInterval(t);
  }, [tab]);

  const move = async (o, to) => {
    setOrders(list => list.map(x => x._id === o._id ? { ...x, status: STATUSES[to] } : x));   // update the board immediately
    try { await api(`/admin/orders/${o._id}`, { method: 'PATCH', body: { status: STATUSES[to] } }); }
    catch (e) { setErr(e.message); }
    loadOrders();
  };

  const count = s => orders.filter(o => o.status === s).length;
  const lowCount = inv.filter(i => i.stock < i.threshold).length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-extrabold text-basil">Orders and stock</h1>
        <div className="flex gap-1 rounded-full bg-white p-1" role="group" aria-label="Section">
          {[['orders', 'Orders'], ['inventory', 'Inventory']].map(([k, label]) => (
            <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)}
              className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${tab === k ? 'bg-basil text-white' : 'text-basil hover:bg-basil/10'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="my-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-4">
        {[['New orders', count(STATUSES[0])], ['In the kitchen', count(STATUSES[1])], ['Out for delivery', count(STATUSES[2])], ['Items low on stock', lowCount]].map(([label, n]) => (
          <div key={label} className="bg-paper px-5 py-4">
            <p className={`font-display text-3xl font-extrabold ${label === 'Items low on stock' && n > 0 ? 'text-tomato-deep' : 'text-basil'}`}>{n}</p>
            <p className="text-sm text-mute">{label}</p>
          </div>
        ))}
      </div>

      {err && <p role="alert" className="mb-6 rounded-lg bg-tomato/10 px-3 py-2 text-sm text-tomato-deep">{err}</p>}

      {tab === 'orders' ? (
        <div className="grid gap-5 md:grid-cols-3">
          {STATUSES.map((s, col) => {
            const list = orders.filter(o => o.status === s);
            return (
              <section key={s} aria-label={s} className="rounded-2xl bg-basil/5 p-3">
                <h2 className="mb-3 flex items-center justify-between px-1 text-lg font-bold">
                  {s}
                  <span className="rounded-full bg-basil px-2.5 py-0.5 text-sm text-white">{list.length}</span>
                </h2>
                {list.length
                  ? <ul className="space-y-3">{list.map(o => <OrderCard key={o._id} o={o} col={col} move={move} />)}</ul>
                  : <p className="px-1 py-6 text-sm text-mute">{EMPTY[col]}</p>}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-10">
          {CATS.map(([key, title]) => (
            <section key={key}>
              <h2 className="text-2xl font-bold">{title}</h2>
              <ul className="mt-2">
                {inv.filter(i => i.category === key).map(i => <StockRow key={i._id} item={i} onSaved={loadInv} />)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
