let session = null;
try { session = localStorage.getItem('auth-session'); } catch { }
if (!session) {
  location.replace('index.html');
} else {
  document.getElementById('user').textContent = session;
  document.getElementById('dash').hidden = false;
}
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('auth-session');
  location.replace('index.html');
});
