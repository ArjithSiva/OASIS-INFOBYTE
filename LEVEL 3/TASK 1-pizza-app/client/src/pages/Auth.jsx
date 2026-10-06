import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, saveSession } from '../api.js';
import PizzaArt, { Logo } from '../PizzaArt.jsx';

function Shell({ title, lead, children }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[1.05fr_1fr]">
      <aside className="gingham hidden place-items-center p-10 md:grid">
        <div className="grid justify-items-center gap-7">
          <div className="rounded-full bg-paper p-6 shadow-[0_22px_44px_-14px_rgba(18,57,43,.5)]">
            <PizzaArt size={300} base="Classic Hand-Tossed" sauce="Tomato Marinara" cheese="Mozzarella" veggies={['Tomato', 'Olives', 'Capsicum']} />
          </div>
          <p className="max-w-[18rem] bg-paper px-5 py-3 text-center font-display text-xl font-bold leading-snug text-basil">
            Pick every layer, then watch it leave the kitchen.
          </p>
        </div>
      </aside>
      <main className="grid place-items-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/login" className="text-basil" aria-label="Forno home"><Logo /></Link>
          <h1 className="mt-10 text-4xl font-extrabold text-basil">{title}</h1>
          <p className="mb-8 mt-2 text-mute">{lead}</p>
          {children}
        </div>
      </main>
    </div>
  );
}

const Field = ({ label, ...props }) => (
  <label className="mb-4 block">
    <span className="mb-1.5 block text-sm font-semibold">{label}</span>
    <input className="field" {...props} />
  </label>
);
const Btn = ({ busy, children }) => (
  <button className="btn btn-tomato w-full" disabled={busy}>{busy ? 'Please wait…' : children}</button>
);
const Msg = ({ m }) => m ? (
  <p role="alert" className={`mb-4 rounded-lg px-3 py-2 text-sm ${m.ok ? 'bg-leaf/10 text-leaf' : 'bg-tomato/10 text-tomato-deep'}`}>{m.text}</p>
) : null;
const A = ({ to, children }) => (
  <Link to={to} className="font-semibold text-tomato-deep underline-offset-4 hover:underline">{children}</Link>
);

function useForm(action) {
  const [f, setF] = useState({});
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  const submit = async e => {
    e.preventDefault(); setMsg(null); setBusy(true);
    try { const m = await action(f); if (m) setMsg({ ok: true, text: m }); }
    catch (err) { setMsg({ text: err.message }); }
    setBusy(false);
  };
  return { set, submit, msg, busy };
}

export function Login() {
  const nav = useNavigate();
  const [q] = useSearchParams();
  const { set, submit, msg, busy } = useForm(async f => { saveSession(await api('/auth/login', { method: 'POST', body: f })); nav('/'); });
  const verified = q.get('verified');
  return (
    <Shell title="Welcome back" lead="Sign in to build your pizza and track your orders.">
      {verified === '1' && <Msg m={{ ok: true, text: 'Email confirmed. Sign in to continue.' }} />}
      {verified === '0' && <Msg m={{ text: 'That confirmation link is invalid or already used.' }} />}
      <form onSubmit={submit}>
        <Field label="Email" type="email" autoComplete="email" required onChange={set('email')} />
        <Field label="Password" type="password" autoComplete="current-password" required onChange={set('password')} />
        <Msg m={msg} />
        <Btn busy={busy}>Sign in</Btn>
      </form>
      <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm">
        <span>New here? <A to="/register">Create an account</A></span>
        <A to="/forgot">Forgot your password?</A>
      </div>
    </Shell>
  );
}

export function Register() {
  const { set, submit, msg, busy } = useForm(async f => (await api('/auth/register', { method: 'POST', body: f })).message);
  return (
    <Shell title="Create your account" lead="We'll email you a link to confirm your address.">
      <form onSubmit={submit}>
        <Field label="Name" autoComplete="name" required onChange={set('name')} />
        <Field label="Email" type="email" autoComplete="email" required onChange={set('email')} />
        <Field label="Password (at least 8 characters)" type="password" autoComplete="new-password" minLength={8} required onChange={set('password')} />
        <Msg m={msg} />
        <Btn busy={busy}>Create account</Btn>
      </form>
      <p className="mt-6 text-sm">Already have an account? <A to="/login">Sign in</A></p>
    </Shell>
  );
}

export function Forgot() {
  const { set, submit, msg, busy } = useForm(async f => (await api('/auth/forgot', { method: 'POST', body: f })).message);
  return (
    <Shell title="Reset your password" lead="Enter your email and we'll send you a reset link.">
      <form onSubmit={submit}>
        <Field label="Email" type="email" autoComplete="email" required onChange={set('email')} />
        <Msg m={msg} />
        <Btn busy={busy}>Send reset link</Btn>
      </form>
      <p className="mt-6 text-sm"><A to="/login">Back to sign in</A></p>
    </Shell>
  );
}

export function Reset() {
  const { token } = useParams();
  const { set, submit, msg, busy } = useForm(async f => (await api(`/auth/reset/${token}`, { method: 'POST', body: f })).message);
  return (
    <Shell title="Choose a new password" lead="Use at least 8 characters.">
      <form onSubmit={submit}>
        <Field label="New password" type="password" autoComplete="new-password" minLength={8} required onChange={set('password')} />
        <Msg m={msg} />
        <Btn busy={busy}>Save password</Btn>
      </form>
      <p className="mt-6 text-sm"><A to="/login">Go to sign in</A></p>
    </Shell>
  );
}

export function AdminLogin() {
  const nav = useNavigate();
  const { set, submit, msg, busy } = useForm(async f => { saveSession(await api('/auth/admin-login', { method: 'POST', body: f })); nav('/admin'); });
  return (
    <main className="grid min-h-screen place-items-center bg-basil px-6">
      <div className="w-full max-w-sm rounded-2xl bg-paper p-8">
        <span className="text-basil"><Logo /></span>
        <h1 className="mt-8 text-3xl font-extrabold text-basil">Staff sign-in</h1>
        <p className="mb-6 mt-2 text-mute">Manage orders and stock.</p>
        <form onSubmit={submit}>
          <Field label="Email" type="email" autoComplete="username" required onChange={set('email')} />
          <Field label="Password" type="password" autoComplete="current-password" required onChange={set('password')} />
          <Msg m={msg} />
          <Btn busy={busy}>Sign in</Btn>
        </form>
      </div>
    </main>
  );
}
