import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, saveSession } from '../api.js';

function Card({ title, children }) {
  return (
    <div className="min-h-[80vh] grid place-items-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-red-700 mb-4 text-center">{title}</h1>{children}
      </div>
    </div>
  );
}
const Field = props => <input className="w-full border rounded-lg p-2 mb-3 focus:outline-red-500" {...props} />;
const Btn = ({ children }) => <button className="w-full bg-red-700 text-white rounded-lg p-2 font-semibold hover:bg-red-800">{children}</button>;
const Msg = ({ m }) => m && <p className={`mb-3 text-sm ${m.ok ? 'text-green-700' : 'text-red-600'}`}>{m.text}</p>;

function useForm(action) {
  const [f, setF] = useState({}); const [msg, setMsg] = useState(null);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setMsg(null);
    try { const m = await action(f); if (m) setMsg({ ok: true, text: m }); } catch (err) { setMsg({ text: err.message }); }
  };
  return { set, submit, msg };
}

export function Login() {
  const nav = useNavigate(); const [q] = useSearchParams();
  const { set, submit, msg } = useForm(async f => { saveSession(await api('/auth/login', { method: 'POST', body: f })); nav('/'); });
  return (
    <Card title="Login">
      {q.get('verified') === '1' && <p className="text-green-700 text-sm mb-3">Email verified! Please log in.</p>}
      <form onSubmit={submit}><Field type="email" placeholder="Email" required onChange={set('email')} />
        <Field type="password" placeholder="Password" required onChange={set('password')} /><Msg m={msg} /><Btn>Login</Btn></form>
      <div className="flex justify-between text-sm mt-3"><Link className="text-red-700" to="/register">Create account</Link><Link className="text-red-700" to="/forgot">Forgot password?</Link></div>
    </Card>
  );
}
export function Register() {
  const { set, submit, msg } = useForm(async f => (await api('/auth/register', { method: 'POST', body: f })).message);
  return (
    <Card title="Register"><form onSubmit={submit}>
      <Field placeholder="Name" required onChange={set('name')} /><Field type="email" placeholder="Email" required onChange={set('email')} />
      <Field type="password" placeholder="Password (8+ chars)" minLength={8} required onChange={set('password')} /><Msg m={msg} /><Btn>Register</Btn></form>
      <p className="text-sm mt-3 text-center">Have an account? <Link className="text-red-700" to="/login">Login</Link></p></Card>
  );
}
export function Forgot() {
  const { set, submit, msg } = useForm(async f => (await api('/auth/forgot', { method: 'POST', body: f })).message);
  return (
    <Card title="Forgot password"><form onSubmit={submit}><Field type="email" placeholder="Your email" required onChange={set('email')} /><Msg m={msg} /><Btn>Send reset link</Btn></form>
      <p className="text-sm mt-3 text-center"><Link className="text-red-700" to="/login">Back to login</Link></p></Card>
  );
}
export function Reset() {
  const { token } = useParams();
  const { set, submit, msg } = useForm(async f => (await api(`/auth/reset/${token}`, { method: 'POST', body: f })).message);
  return (
    <Card title="Reset password"><form onSubmit={submit}><Field type="password" placeholder="New password (8+ chars)" minLength={8} required onChange={set('password')} /><Msg m={msg} /><Btn>Update password</Btn></form>
      <p className="text-sm mt-3 text-center"><Link className="text-red-700" to="/login">Go to login</Link></p></Card>
  );
}
export function AdminLogin() {
  const nav = useNavigate();
  const { set, submit, msg } = useForm(async f => { saveSession(await api('/auth/admin-login', { method: 'POST', body: f })); nav('/admin'); });
  return (
    <Card title="Admin Login"><form onSubmit={submit}><Field type="email" placeholder="Admin email" required onChange={set('email')} />
      <Field type="password" placeholder="Password" required onChange={set('password')} /><Msg m={msg} /><Btn>Login</Btn></form></Card>
  );
}
