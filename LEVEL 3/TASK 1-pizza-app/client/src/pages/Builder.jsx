import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

const STEPS = [['base', 'Choose your base'], ['sauce', 'Choose your sauce'], ['cheese', 'Choose your cheese'], ['veggie', 'Choose your veggies']];

function loadRazorpay() {
  return new Promise((res, rej) => {
    if (window.Razorpay) return res();
    const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = res; s.onerror = () => rej(new Error('Could not load Razorpay.')); document.body.appendChild(s);
  });
}
export default function Builder() {
  const nav = useNavigate(); const preset = useLocation().state?.preset;
  const [opts, setOpts] = useState(null);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState({ base: null, sauce: null, cheese: null, veggies: [] });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/menu').then(({ options }) => {
      setOpts(options);
      if (preset) {                                // prefill from a menu pizza (matched by name)
        const f = (cat, n) => options[cat].find(o => o.name === n)?._id || null;
        setSel({ base: f('base', preset.base), sauce: f('sauce', preset.sauce), cheese: f('cheese', preset.cheese),
          veggies: preset.veggies.map(v => f('veggie', v)).filter(Boolean) });
      }
    }).catch(e => setErr(e.message));
  }, []);
  if (!opts) return <p className="p-6">{err || 'Loading…'}</p>;

  const find = (cat, id) => opts[cat].find(o => o._id === id);
  const chosen = [find('base', sel.base), find('sauce', sel.sauce), find('cheese', sel.cheese), ...sel.veggies.map(v => find('veggie', v))].filter(Boolean);
  const total = chosen.reduce((s, i) => s + i.price, 0);
  const cat = STEPS[step]?.[0];
  const canNext = cat === 'veggie' ? true : !!sel[cat];

  const toggleVeg = id => setSel(s => ({ ...s, veggies: s.veggies.includes(id) ? s.veggies.filter(v => v !== id) : [...s.veggies, id] }));
  const pay = async () => {
    setErr(''); setBusy(true);
    try {
      const c = await api('/orders/checkout', { method: 'POST', body: sel });
      await loadRazorpay();
      new window.Razorpay({
        key: c.key, amount: c.amount, currency: 'INR', order_id: c.razorpayOrderId, name: 'Pizzeria', description: 'Custom pizza',
        handler: async r => {
          try { await api('/orders/verify', { method: 'POST', body: { orderId: c.orderId, ...r } }); nav('/'); }
          catch (e) { setErr(e.message); setBusy(false); }
        },
        modal: { ondismiss: () => setBusy(false) },
      }).open();
    } catch (e) { setErr(e.message); setBusy(false); }
  };

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div className="flex gap-1 mb-4">{[...STEPS, ['sum']].map((_, i) => <div key={i} className={`h-2 flex-1 rounded ${i <= step ? 'bg-red-600' : 'bg-gray-200'}`} />)}</div>
      {step < 4 ? (
        <>
          <h2 className="text-2xl font-bold mb-3">Step {step + 1}: {STEPS[step][1]}{cat === 'veggie' && ' (multiple)'}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {opts[cat].map(o => {
              const on = cat === 'veggie' ? sel.veggies.includes(o._id) : sel[cat] === o._id;
              return (
                <button key={o._id} disabled={!o.inStock}
                  onClick={() => cat === 'veggie' ? toggleVeg(o._id) : setSel({ ...sel, [cat]: o._id })}
                  className={`text-left rounded-xl p-3 border-2 bg-white disabled:opacity-40 ${on ? 'border-red-600 bg-red-50' : 'border-transparent shadow'}`}>
                  <span className="font-semibold">{o.name}</span> <span className="text-sm text-gray-500">₹{o.price}</span>
                  {!o.inStock && <span className="block text-xs text-red-600">Out of stock</span>}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-2xl font-bold mb-3">Order summary</h2>
          <ul className="divide-y">
            {chosen.map(i => <li key={i._id} className="flex justify-between py-2"><span>{i.name}</span><span>₹{i.price}</span></li>)}
          </ul>
          <p className="flex justify-between font-bold text-lg mt-3"><span>Total</span><span>₹{total}</span></p>
          <p className="text-xs text-gray-500 mt-2">Test mode: in the Razorpay popup choose any method and click “Success”.</p>
        </div>
      )}
      {err && <p className="text-red-600 mt-3">{err}</p>}
      <div className="flex justify-between mt-5">
        <button disabled={step === 0} onClick={() => setStep(step - 1)} className="px-4 py-2 rounded-lg border disabled:opacity-40">Back</button>
        {step < 4
          ? <button disabled={!canNext} onClick={() => setStep(step + 1)} className="px-5 py-2 rounded-lg bg-red-700 text-white disabled:opacity-40">{step === 3 ? 'Review order' : 'Next'}</button>
          : <button disabled={busy} onClick={pay} className="px-5 py-2 rounded-lg bg-green-600 text-white disabled:opacity-40">{busy ? 'Processing…' : `Pay ₹${total}`}</button>}
      </div>
    </main>
  );
}
