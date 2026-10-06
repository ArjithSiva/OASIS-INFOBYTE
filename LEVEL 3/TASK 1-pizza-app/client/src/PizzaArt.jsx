// Colours keyed by the item names used in the database seed.
const SAUCE = { 'Tomato Marinara': '#d63a1f', Pesto: '#5f9a3b', Barbecue: '#7a3418', 'White Garlic': '#f5ecd6', 'Spicy Arrabbiata': '#b0200e' };
const CHEESE = { Mozzarella: '#fbe9a8', Cheddar: '#f6ae2d', Parmesan: '#f7e0a0', 'Vegan Cheese': '#f2e6bd' };
// [crust thickness, dough colour]
const CRUST = {
  'Classic Hand-Tossed': [13, '#e6ad5f'], 'Thin Crust': [7, '#e8b56f'], 'Cheese Burst': [19, '#e2a350'],
  'Whole Wheat': [13, '#c78f4f'], Multigrain: [13, '#b98448'],
};
const VEG = { Onion: '#e8d3f0', Capsicum: '#3f9b4a', Mushroom: '#d8bf9c', Tomato: '#e23a2e', Olives: '#2a2a2a', 'Sweet Corn': '#ffd23f', Jalapeno: '#6fae3a', Paneer: '#fff1cf' };

export const COLORS = {
  base: Object.fromEntries(Object.entries(CRUST).map(([k, v]) => [k, v[1]])),
  sauce: SAUCE, cheese: CHEESE, veggie: VEG,
};

// small seeded random so each topping keeps its place when others are added or removed
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
}

function Piece({ name, x, y, rot }) {
  const c = VEG[name] || '#999';
  const t = `translate(${x} ${y}) rotate(${rot})`;
  switch (name) {
    case 'Onion': return <circle transform={t} r="6" fill="none" stroke={c} strokeWidth="2.2" />;
    case 'Capsicum': return <path transform={t} d="M-6 1 Q0 -7 6 1" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />;
    case 'Mushroom': return <g transform={t}><path d="M-6 2 A6 6 0 0 1 6 2 Z" fill={c} /><rect x="-2" y="2" width="4" height="4" fill={c} /></g>;
    case 'Tomato': return <g transform={t}><circle r="5.5" fill={c} /><circle r="2" fill="#f57a63" /></g>;
    case 'Olives': return <circle transform={t} r="4" fill="none" stroke={c} strokeWidth="2.4" />;
    case 'Sweet Corn': return <circle transform={t} r="2.6" fill={c} />;
    case 'Jalapeno': return <g transform={t}><circle r="4.6" fill={c} /><circle r="1.6" fill="#c9e59a" /></g>;
    case 'Paneer': return <rect transform={t} x="-4.5" y="-4.5" width="9" height="9" rx="2" fill={c} stroke="#e7cf9b" strokeWidth="1" />;
    default: return <circle transform={t} r="4" fill={c} />;
  }
}

const BUBBLES = [[78, 82, 5], [121, 74, 4], [104, 118, 6], [70, 120, 4], [132, 108, 5], [96, 62, 3.5], [88, 140, 4], [128, 136, 3.5]];

export default function PizzaArt({ base, sauce, cheese, veggies = [], size = 260, className = '' }) {
  const [crust, dough] = CRUST[base] || [13, '#e6ad5f'];
  const rSauce = 96 - crust;
  const sc = SAUCE[sauce];
  const cc = CHEESE[cheese];
  const limit = rSauce - 12;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="Pizza preview">
      <ellipse cx="100" cy="106" rx="96" ry="94" fill="#12392b" opacity=".16" />
      <circle cx="100" cy="100" r="96" fill={dough} />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#b9792f" strokeOpacity=".4" strokeWidth="2" />
      {base === 'Cheese Burst' && <circle cx="100" cy="100" r={96 - crust / 2} fill="none" stroke="#f6d77a" strokeWidth="6" opacity=".85" />}
      {sc && <circle cx="100" cy="100" r={rSauce} fill={sc} />}
      {cc && <circle cx="100" cy="100" r={rSauce - 3} fill={cc} />}
      {cc && BUBBLES.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#e0a43a" opacity=".45" />)}
      {(sc || cc) && veggies.map(v => {
        const rand = rng(v);
        const n = v === 'Sweet Corn' ? 10 : 6;
        return (
          <g key={v} className="topping-drop">
            {Array.from({ length: n }, (_, i) => {
              const a = rand() * Math.PI * 2;
              const d = Math.sqrt(rand()) * limit;
              return <Piece key={i} name={v} x={100 + Math.cos(a) * d} y={100 + Math.sin(a) * d} rot={rand() * 360} />;
            })}
          </g>
        );
      })}
      {sc && [0, 60, 120].map(a => (
        <line key={a} x1="100" y1="100" x2={100 + Math.cos((a * Math.PI) / 180) * rSauce} y2={100 + Math.sin((a * Math.PI) / 180) * rSauce}
          stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" transform="rotate(0 100 100)" />
      ))}
      {sc && [0, 60, 120].map(a => (
        <line key={'o' + a} x1="100" y1="100" x2={100 - Math.cos((a * Math.PI) / 180) * rSauce} y2={100 - Math.sin((a * Math.PI) / 180) * rSauce}
          stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight">
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="#e6ad5f" />
        <circle cx="16" cy="16" r="11" fill="#d63318" />
        <circle cx="12" cy="13" r="2.4" fill="#fbe9a8" />
        <circle cx="20" cy="12" r="2" fill="#fbe9a8" />
        <circle cx="17" cy="20" r="2.6" fill="#fbe9a8" />
      </svg>
      Forno
    </span>
  );
}
