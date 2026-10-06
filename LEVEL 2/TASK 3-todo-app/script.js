const input = document.getElementById('task-input');
const lists = { pending: document.getElementById('pending-list'), completed: document.getElementById('completed-list') };
const KEY = 'todo-tasks';
let tasks = [];
let editingId = null;

try { tasks = JSON.parse(localStorage.getItem(KEY)) || []; } catch { tasks = []; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch { } };
const stamp = ts => new Date(ts).toLocaleString();

function addTask() {
  const text = input.value.trim();
  if (!text) { input.focus(); return; }
  tasks.push({ id: Date.now(), text, done: false, added: Date.now(), completedAt: null });
  input.value = '';
  update();
}
function makeButton(label, cls, handler) {
  const b = document.createElement('button');
  b.textContent = label; b.className = cls;
  b.addEventListener('click', handler);
  return b;
}
function renderTask(t) {
  const li = document.createElement('li');
  if (t.done) li.classList.add('done');
  if (editingId === t.id) {
    const edit = document.createElement('input');
    edit.type = 'text'; edit.value = t.text; edit.className = 'edit-input';
    const saveEdit = () => { const v = edit.value.trim(); if (v) t.text = v; editingId = null; update(); };
    edit.addEventListener('keydown', e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { editingId = null; update(); } });
    li.append(edit, makeButton('Save', 'btn-done', saveEdit));
    setTimeout(() => edit.focus());
  } else {
    const span = document.createElement('span');
    span.className = 'text'; span.textContent = t.text;
    li.append(span,
      makeButton(t.done ? 'Undo' : 'Mark Complete', 'btn-done', () => { t.done = !t.done; t.completedAt = t.done ? Date.now() : null; update(); }),
      makeButton('Edit', 'btn-edit', () => { editingId = t.id; update(); }),
      makeButton('Delete', 'btn-del', () => { tasks = tasks.filter(x => x.id !== t.id); update(); }));
  }
  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = `Added ${stamp(t.added)}` + (t.completedAt ? ` · Completed ${stamp(t.completedAt)}` : '');
  li.appendChild(time);
  return li;
}
function update() {
  save();
  const groups = { pending: tasks.filter(t => !t.done), completed: tasks.filter(t => t.done) };
  for (const key of ['pending', 'completed']) {
    lists[key].innerHTML = '';
    groups[key].forEach(t => lists[key].appendChild(renderTask(t)));
    if (!groups[key].length) {
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = key === 'pending' ? 'Nothing pending – enjoy your day! 🎉' : 'No completed tasks yet. You got this!';
      lists[key].appendChild(li);
    }
    document.getElementById(`${key}-count`).textContent = `${groups[key].length} ${key}`;
  }
}
document.getElementById('add-btn').addEventListener('click', addTask);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
update();
