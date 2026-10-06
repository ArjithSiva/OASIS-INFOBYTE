import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, session, STATUSES } from '../api.js';
import PizzaArt from '../PizzaArt.jsx';

function Ticket({ o }) {
  const idx = STATUSES.indexOf(o.status);
  const done = idx === STATUSES.length - 1;
  const d = o.details;
  const lines = [d.base, d.sauce, d.cheese, ...d.veggies];
  const rule = <hr className="my-3 border-t-2 border-dashed border-line" />;
  const when = new Date(o.createdAt);
  return (
    <div className="ticket-wrap">
      <article className="ticket px-5 pb-8 pt-5 font-ticket text-sm">
        <div className="flex justify-between gap-2">
          <b>Order #{o._id.slice(-5)}</b>
          <span>{when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <p className="text-mute">{when.toLocaleDateString()}</p>
        {rule}
        <ul className="space-y-0.5">{lines.map((l, i) => <li key={i}>1 × {l}</li>)}</ul>
        {rule}
        <p className="flex justify-between font-semibold"><span>Total</span><span>₹{o.amount}</span></p>
        {rule}
        <ol className="space-y-2">
          {STATUSES.map((s, i) => {
            const complete = i < idx || (i === idx && done);
            return (
              <li key={s} className={`flex items-center gap-2 ${i > idx ? 'text-mute' : ''} ${i === idx ? 'font-semibold' : ''}`}>
                <span aria-hidden="true" className={`h-3 w-3 rounded-full ${complete ? 'bg-leaf' : i === idx ? 'live-dot bg-tomato' : 'border-2 border-line'}`} />
                {s}
              </li>
            );
          })}
        </ol>
      </article>
    </div>
  );
}

export default function Dashboard() {
  const nav = useNavigate();
  const placed = useLocation().state?.placed;
  const name = session().name?.split(' ')[0];
  const [menu, setMenu] = useState({ pizzas: [], options: null });
  const [orders, setOrders] = useState(null);

  useEffect(() => { api('/menu').then(setMenu).catch(() => {}); }, []);
  useEffect(() => {                       // poll every 5s so status changes show up on their own
    const load = () => api('/orders/mine').then(setOrders).catch(() => {});
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const priceOf = p => {
    if (!menu.options) return null;
    const cost = (cat, n) => menu.options[cat].find(o => o.name === n)?.price ?? 0;
    return cost('base', p.base) + cost('sauce', p.sauce) + cost('cheese', p.cheese) + p.veggies.reduce((s, v) => s + cost('veggie', v), 0);
  };

  return (
    <>
      <section className="dark-surface relative overflow-hidden bg-basil text-white">
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-14 md:py-20">
          <h1 className="max-w-xl text-5xl font-extrabold leading-[1.02] md:text-6xl">
            {name ? `${name}, what are we baking tonight?` : 'What are we baking tonight?'}
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/80">
            Pick a pizza from the menu, or build your own from base, sauce, cheese and veggies.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/build" className="btn btn-tomato">Build your pizza</Link>
            <a href="#menu" className="btn btn-light">See the menu</a>
          </div>
        </div>
        <PizzaArt className="pointer-events-none absolute -bottom-28 -right-20 hidden rotate-12 md:block" size={470}
          base="Classic Hand-Tossed" sauce="Tomato Marinara" cheese="Mozzarella" veggies={['Tomato', 'Olives', 'Capsicum', 'Mushroom']} />
      </section>

      <main className="mx-auto max-w-6xl px-6">
        {placed && (
          <p role="status" className="mt-8 rounded-lg bg-leaf/10 px-4 py-3 font-semibold text-leaf">
            Payment received. Your order is in, and its status will update below.
          </p>
        )}

        <section id="menu" className="scroll-mt-20 py-14">
          <h2 className="text-3xl font-extrabold text-basil">The menu</h2>
          <ul className="mt-4 grid gap-x-14 lg:grid-cols-2">
            {menu.pizzas.map(p => {
              const price = priceOf(p);
              return (
                <li key={p._id} className="flex gap-4 border-b border-line py-5">
                  <PizzaArt size={76} base={p.base} sauce={p.sauce} cheese={p.cheese} veggies={p.veggies} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-end gap-2">
                      <h3 className="text-xl font-bold">{p.name}</h3>
                      <span aria-hidden="true" className="mb-1.5 flex-1 border-b-2 border-dotted border-mute/40" />
                      {price !== null && <span className="font-display text-xl font-bold">₹{price}</span>}
                    </div>
                    <p className="mt-1 text-sm text-mute">{p.description}</p>
                    <p className="mt-1 text-sm text-mute">{p.base} base with {p.sauce.toLowerCase()} and {p.cheese.toLowerCase()}.</p>
                    <button className="mt-2 font-semibold text-tomato-deep underline-offset-4 hover:underline"
                      onClick={() => nav('/build', { state: { preset: p } })}>
                      Customise and order
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="pb-20">
          <h2 className="text-3xl font-extrabold text-basil">Your orders</h2>
          <p className="mt-1 text-mute">Status updates on its own, so you can leave this page open.</p>
          {orders && !orders.length && (
            <p className="mt-6 rounded-xl border-2 border-dashed border-line p-6 text-mute">
              No orders yet. Pick a pizza from the menu or <Link to="/build" className="font-semibold text-tomato-deep underline">build your own</Link>.
            </p>
          )}
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {orders?.map(o => <Ticket key={o._id} o={o} />)}
          </div>
        </section>
      </main>
    </>
  );
}
