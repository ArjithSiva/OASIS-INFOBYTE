import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import PizzaArt, { COLORS } from '../PizzaArt.jsx';

const STEPS = [
  { key: 'base', tab: 'Base', title: 'Pick a base', hint: 'Choose one.' },
  { key: 'sauce', tab: 'Sauce', title: 'Pick a sauce', hint: 'Choose one.' },
  { key: 'cheese', tab: 'Cheese', title: 'Pick a cheese', hint: 'Choose one.' },
  { key: 'veggie', tab: 'Veggies', title: 'Add veggies', hint: 'Add as many as you like, or none.' },
  { key: 'review', tab: 'Review' },
];

function loadRazorpay() {
  return new Promise((res, rej) => {
    if (window.Razorpay) return res();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = res;
    s.onerror = () => rej(new Error("Couldn't load Razorpay. Check your connection and try again."));
    document.body.appendChild(s);
  });
}

function Option({ o, cat, on, onClick }) {
  return (
    <button type="button" disabled={!o.inStock} onClick={onClick} aria-pressed={on}
      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors disabled:opacity-40 ${on ? 'border-basil bg-white shadow-sm' : 'border-line bg-white/60 hover:border-basil/50'}`}>
      <span aria-hidden="true" className="h-7 w-7 shrink-0 rounded-full border border-black/10" style={{ background: COLORS[cat]?.[o.name] || '#ddd' }} />
      <span className="flex-1">
        <span className="block font-semibold">{o.name}</span>
        {!o.inStock && <span className="block text-sm text-tomato-deep">Sold out</span>}
      </span>
      <span className="font-display font-bold">₹{o.price}</span>
      <span aria-hidden="true" className={`grid h-6 w-6 place-items-center rounded-full text-sm ${on ? 'bg-basil text-white' : 'border-2 border-line'}`}>{on && '✓'}</span>
    </button>
  );
}

export default function Builder() {
  const nav = useNavigate();
  const preset = useLocation().state?.preset;
  const [opts, setOpts] = useState(null);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState({ base: null, sauce: null, cheese: null, veggies: [] });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/menu').then(({ options }) => {
      setOpts(options);
      if (preset) {                                // prefill from a menu pizza, then jump to the review
        const f = (cat, n) => options[cat].find(o => o.name === n)?._id || null;
        setSel({ base: f('base', preset.base), sauce: f('sauce', preset.sauce), cheese: f('cheese', preset.cheese),
          veggies: preset.veggies.map(v => f('veggie', v)).filter(Boolean) });
        setStep(4);
      }
    }).catch(e => setErr(e.message));
  }, []);

  if (!opts) return <p className="mx-auto max-w-6xl px-6 py-10">{err || 'Loading the menu…'}</p>;

  const find = (cat, id) => opts[cat].find(o => o._id === id);
  const picked = {
    base: find('base', sel.base), sauce: find('sauce', sel.sauce), cheese: find('cheese', sel.cheese),
    veggies: sel.veggies.map(v => find('veggie', v)).filter(Boolean),
  };
  const chosen = [picked.base, picked.sauce, picked.cheese, ...picked.veggies].filter(Boolean);
  const total = chosen.reduce((s, i) => s + i.price, 0);
  const complete = !!(sel.base && sel.sauce && sel.cheese);
  const maxStep = !sel.base ? 0 : !sel.sauce ? 1 : !sel.cheese ? 2 : 4;
  const cat = STEPS[step].key;
  const canNext = step === 3 || !!sel[cat];

  const toggleVeg = id => setSel(s => ({ ...s, veggies: s.veggies.includes(id) ? s.veggies.filter(v => v !== id) : [...s.veggies, id] }));

  const pay = async () => {
    setErr(''); setBusy(true);
    try {
      const c = await api('/orders/checkout', { method: 'POST', body: sel });
      await loadRazorpay();
      new window.Razorpay({
        key: c.key, amount: c.amount, currency: 'INR', order_id: c.razorpayOrderId, name: 'Forno', description: 'Your pizza',
        theme: { color: '#d63318' },
        handler: async r => {
          try { await api('/orders/verify', { method: 'POST', body: { orderId: c.orderId, ...r } }); nav('/', { state: { placed: true } }); }
          catch (e) { setErr(e.message); setBusy(false); }
        },
        modal: { ondismiss: () => setBusy(false) },
      }).open();
    } catch (e) { setErr(e.message); setBusy(false); }
  };

  const groups = [
    ['Base', picked.base ? [picked.base] : [], 0],
    ['Sauce', picked.sauce ? [picked.sauce] : [], 1],
    ['Cheese', picked.cheese ? [picked.cheese] : [], 2],
    ['Veggies', picked.veggies, 3],
  ];

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div>
        <ol className="mb-8 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <li key={s.key}>
              <button type="button" disabled={i > maxStep} onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 ${i === step ? 'bg-basil text-white' : 'bg-white text-basil hover:bg-basil/10'}`}>
                <span className={`grid h-5 w-5 place-items-center rounded-full text-xs ${i === step ? 'bg-white text-basil' : 'bg-basil/10'}`}>{i < step ? '✓' : i + 1}</span>
                {s.tab}
              </button>
            </li>
          ))}
        </ol>

        {step < 4 ? (
          <section>
            <h1 className="text-4xl font-extrabold text-basil">{STEPS[step].title}</h1>
            <p className="mb-6 mt-1 text-mute">{STEPS[step].hint}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {opts[cat].map(o => {
                const on = cat === 'veggie' ? sel.veggies.includes(o._id) : sel[cat] === o._id;
                return (
                  <Option key={o._id} o={o} cat={cat} on={on}
                    onClick={() => cat === 'veggie' ? toggleVeg(o._id) : setSel({ ...sel, [cat]: o._id })} />
                );
              })}
            </div>
          </section>
        ) : (
          <section>
            <h1 className="text-4xl font-extrabold text-basil">Check your order</h1>
            <p className="mb-6 mt-1 text-mute">Make sure everything looks right, then pay to send it to the kitchen.</p>
            <div className="ticket-wrap max-w-md">
              <div className="ticket px-6 pb-9 pt-6 font-ticket text-sm">
                {groups.map(([label, items, stepIdx]) => (
                  <div key={label} className="mb-4">
                    <div className="flex items-center justify-between">
                      <b>{label}</b>
                      <button type="button" onClick={() => setStep(stepIdx)} className="text-tomato-deep underline underline-offset-4">Change</button>
                    </div>
                    {items.length ? items.map(i => (
                      <p key={i._id} className="flex justify-between"><span>{i.name}</span><span>₹{i.price}</span></p>
                    )) : <p className="text-mute">{label === 'Veggies' ? 'No veggies' : 'Nothing picked yet'}</p>}
                  </div>
                ))}
                <hr className="my-3 border-t-2 border-dashed border-line" />
                <p className="flex justify-between text-base font-semibold"><span>Total</span><span>₹{total}</span></p>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm text-mute">Test mode: in the Razorpay window choose any method, then click Success.</p>
          </section>
        )}

        {err && <p role="alert" className="mt-5 max-w-md rounded-lg bg-tomato/10 px-3 py-2 text-sm text-tomato-deep">{err}</p>}

        <div className="mt-8 flex gap-3">
          <button type="button" className="btn btn-line" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
          {step < 4
            ? <button type="button" className="btn btn-basil" disabled={!canNext} onClick={() => setStep(step + 1)}>{step === 3 ? 'Review order' : 'Next'}</button>
            : <button type="button" className="btn btn-tomato" disabled={busy || !complete} onClick={pay}>{busy ? 'Opening payment…' : `Pay ₹${total}`}</button>}
        </div>
      </div>

      <aside className="self-start lg:sticky lg:top-24">
        <div className="gingham grid place-items-center rounded-2xl p-6">
          <div className="rounded-full bg-paper p-4 shadow-[0_18px_36px_-14px_rgba(18,57,43,.5)]">
            <PizzaArt size={260} base={picked.base?.name} sauce={picked.sauce?.name} cheese={picked.cheese?.name} veggies={picked.veggies.map(v => v.name)} />
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="text-sm text-mute">
            {chosen.length ? chosen.map(i => i.name).join(', ') : 'Plain dough so far. Pick a base to begin.'}
          </p>
          <p className="font-display text-3xl font-extrabold text-basil">₹{total}</p>
        </div>
      </aside>
    </main>
  );
}
