// Front-end demo only: real apps must hash and verify passwords on a server.
const USERS_KEY = 'auth-users', SESSION_KEY = 'auth-session';
const form = document.getElementById('auth-form');
const msg = document.getElementById('msg');
let mode = 'login';

if (getSession()) location.replace('dashboard.html');

function getSession() { try { return localStorage.getItem(SESSION_KEY); } catch { return null; } }
function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; } }

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function show(text, ok = false) { msg.textContent = text; msg.className = ok ? 'msg ok' : 'msg'; }

document.getElementById('switch-link').addEventListener('click', e => {
  e.preventDefault();
  mode = mode === 'login' ? 'register' : 'login';
  const reg = mode === 'register';
  document.getElementById('heading').textContent = reg ? 'Register' : 'Login';
  document.getElementById('submit').textContent = reg ? 'Register' : 'Login';
  document.getElementById('switch-text').textContent = reg ? 'Have an account?' : 'No account?';
  e.target.textContent = reg ? 'Login' : 'Register';
  show('');
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  if (!email || !password) return show('Please fill in both fields.');
  if (!/^\S+@\S+\.\S+$/.test(email)) return show('Please enter a valid email address.');
  const users = getUsers();

  if (mode === 'register') {
    if (password.length < 8 || !/\d/.test(password)) return show('Password needs 8+ characters and at least 1 number.');
    if (users[email]) return show('An account with this email already exists.');
    const salt = crypto.randomUUID();
    users[email] = { salt, hash: await sha256(salt + password) };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    show('Registered! You can now log in.', true);
    document.getElementById('switch-link').click();
    show('Registered! You can now log in.', true);
  } else {
    const u = users[email];
    const ok = u && (await sha256(u.salt + password)) === u.hash;
    if (!ok) return show('Invalid email or password.');
    localStorage.setItem(SESSION_KEY, email);
    location.href = 'dashboard.html';
  }
});
