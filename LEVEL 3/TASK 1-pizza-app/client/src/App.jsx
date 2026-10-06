import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { session, clearSession } from './api.js';
import { Login, Register, Forgot, Reset, AdminLogin } from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Builder from './pages/Builder.jsx';
import Admin from './pages/Admin.jsx';

function Guard({ role, children }) {
  const s = session();
  if (!s.token || s.role !== role) return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  return children;
}
function Nav() {
  const nav = useNavigate(); const s = session();
  if (!s.token) return null;
  return (
    <header className="bg-red-700 text-white">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link to={s.role === 'admin' ? '/admin' : '/'} className="text-xl font-bold">🍕 Pizzeria</Link>
        <div className="flex items-center gap-4 text-sm">
          <span>Hi, {s.name}</span>
          <button className="bg-white/20 rounded px-3 py-1 hover:bg-white/30" onClick={() => { clearSession(); nav('/login'); }}>Logout</button>
        </div>
      </div>
    </header>
  );
}
export default function App() {
  return (
    <div className="min-h-screen bg-orange-50 text-gray-800">
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
    </div>
  );
}
