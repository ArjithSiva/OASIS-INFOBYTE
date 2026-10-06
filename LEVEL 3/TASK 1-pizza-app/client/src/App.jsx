import { Routes, Route, Navigate, Link, NavLink, useNavigate } from 'react-router-dom';
import { session, clearSession } from './api.js';
import { Logo } from './PizzaArt.jsx';
import { Login, Register, Forgot, Reset, AdminLogin } from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Builder from './pages/Builder.jsx';
import Admin from './pages/Admin.jsx';

function Guard({ role, children }) {
  const s = session();
  if (!s.token || s.role !== role) return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  return children;
}

const tab = ({ isActive }) =>
  `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${isActive ? 'bg-white text-basil' : 'text-white/80 hover:text-white'}`;

function Nav() {
  const nav = useNavigate();
  const s = session();
  if (!s.token) return null;
  const admin = s.role === 'admin';
  return (
    <header className="dark-surface sticky top-0 z-20 bg-basil text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-6">
          <Link to={admin ? '/admin' : '/'} aria-label="Forno home"><Logo /></Link>
          {admin ? <span className="text-sm text-white/70">Staff</span> : (
            <nav className="flex gap-1" aria-label="Main">
              <NavLink to="/" end className={tab}>Menu</NavLink>
              <NavLink to="/build" className={tab}>Build a pizza</NavLink>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-white/80">{s.name}</span>
          <button className="font-semibold underline-offset-4 hover:underline" onClick={() => { clearSession(); nav(admin ? '/admin/login' : '/login'); }}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset/:token" element={<Reset />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/" element={<Guard role="user"><Dashboard /></Guard>} />
        <Route path="/build" element={<Guard role="user"><Builder /></Guard>} />
        <Route path="/admin" element={<Guard role="admin"><Admin /></Guard>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
