export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
    body: body && JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
export const session = () => ({ token: localStorage.getItem('token'), role: localStorage.getItem('role'), name: localStorage.getItem('name') });
export const saveSession = d => { localStorage.setItem('token', d.token); localStorage.setItem('role', d.role); localStorage.setItem('name', d.name); };
export const clearSession = () => localStorage.clear();
export const STATUSES = ['Order Received', 'In Kitchen', 'Sent to Delivery'];
