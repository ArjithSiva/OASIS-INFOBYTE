const display = document.getElementById('display');
const exprEl = document.getElementById('expr');
const SYM = { '+': '+', '-': '−', '*': '×', '/': '÷' };

let current = '0';   // number being typed
let stored = null;   // accumulated result
let pendingOp = null;
let justEvaluated = false;
let error = false;

function compute(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : a / b;
  }
}
const fmt = n => String(parseFloat(n.toPrecision(12)));

function render() {
  display.textContent = error ? 'Error: ÷ by 0' : current;
  exprEl.textContent = stored !== null && pendingOp ? `${fmt(stored)} ${SYM[pendingOp]}` : '';
}
function reset() { current = '0'; stored = null; pendingOp = null; justEvaluated = false; error = false; }

function inputNumber(ch) {
  if (error) reset();
  if (justEvaluated) { current = '0'; justEvaluated = false; }
  if (ch === '.') { if (!current.includes('.')) current += '.'; }
  else current = current === '0' ? ch : current + ch;
}
function applyPending() {
  const b = parseFloat(current);
  if (stored === null || !pendingOp) { stored = b; return true; }
  const r = compute(stored, pendingOp, b);
  if (r === null) { error = true; stored = null; pendingOp = null; current = '0'; return false; }
  stored = r; return true;
}
function inputOperator(op) {
  if (error) reset();
  if (!justEvaluated && !(pendingOp && current === '' )) { if (!applyPending()) return; }
  else if (stored === null) stored = parseFloat(current);
  pendingOp = op; current = fmt(stored); justEvaluated = true;
}
function equals() {
  if (error || !pendingOp) return;
  if (!applyPending()) return;
  current = fmt(stored); stored = null; pendingOp = null; justEvaluated = true;
}
function backspace() {
  if (error) return reset();
  if (justEvaluated) return;
  current = current.length > 1 ? current.slice(0, -1) : '0';
}

document.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => {
  const { num, op, action } = btn.dataset;
  if (num !== undefined) inputNumber(num);
  else if (op) inputOperator(op);
  else if (action === 'equals') equals();
  else if (action === 'clear') reset();
  else if (action === 'back') backspace();
  render();
}));
render();
