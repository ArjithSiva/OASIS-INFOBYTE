const valueEl = document.getElementById('value');
const unitEl = document.getElementById('unit');
const errorEl = document.getElementById('error');
const resultEl = document.getElementById('result');

const toCelsius = { C: v => v, F: v => (v - 32) * 5 / 9, K: v => v - 273.15 };

function convert() {
  errorEl.textContent = '';
  resultEl.innerHTML = '';
  const raw = valueEl.value.trim();
  if (raw === '' || isNaN(Number(raw))) {
    errorEl.textContent = 'Please enter a valid number.';
    return;
  }
  const c = toCelsius[unitEl.value](Number(raw));
  if (c < -273.15 - 1e-9) {
    errorEl.textContent = 'That is below absolute zero (−273.15 °C) – impossible!';
    return;
  }
  const out = { 'Celsius': [c, '°C'], 'Fahrenheit': [c * 9 / 5 + 32, '°F'], 'Kelvin': [c + 273.15, 'K'] };
  for (const [name, [val, sym]] of Object.entries(out)) {
    const li = document.createElement('li');
    li.textContent = `${name}: ${val.toFixed(2)} ${sym}`;
    resultEl.appendChild(li);
  }
}
document.getElementById('convert').addEventListener('click', convert);
valueEl.addEventListener('keydown', e => { if (e.key === 'Enter') convert(); });
