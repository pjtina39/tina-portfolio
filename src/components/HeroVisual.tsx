// Abstract hero illustration: scattered records on the left flow through a
// model node and come out aligned on the right. Operations → production AI.

const NAVY = "#1b2a4a";
const BRONZE = "#8a5a24";

const messy = [
  [38, 60], [80, 34], [62, 112], [24, 150], [96, 168], [48, 214], [90, 246], [30, 286], [74, 318], [112, 96], [118, 280],
];
const ordered = Array.from({ length: 11 }, (_, i) => [372 + (i % 2) * 34, 44 + i * 26]);
const hub: [number, number] = [230, 180];

export function HeroVisual() {
  return (
    <svg viewBox="0 0 460 360" className="h-auto w-full" role="img" aria-label="Scattered records flowing through a model and coming out aligned">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={BRONZE} stopOpacity="0.18" />
          <stop offset="100%" stopColor={BRONZE} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={hub[0]} cy={hub[1]} r="120" fill="url(#glow)" />

      {messy.map(([x, y], i) => (
        <path key={`in${i}`} d={`M${x},${y} C${(x + hub[0]) / 2},${y} ${hub[0] - 60},${hub[1]} ${hub[0]},${hub[1]}`} fill="none" stroke={NAVY} strokeOpacity="0.22" strokeWidth="1" className="flow" style={{ animationDelay: `${i * -0.3}s` }} />
      ))}
      {ordered.map(([x, y], i) => (
        <path key={`out${i}`} d={`M${hub[0]},${hub[1]} C${hub[0] + 60},${hub[1]} ${(x + hub[0]) / 2},${y} ${x},${y}`} fill="none" stroke={BRONZE} strokeOpacity="0.45" strokeWidth="1" className="flow" style={{ animationDelay: `${i * -0.2}s` }} />
      ))}

      {messy.map(([x, y], i) => (
        <g key={`m${i}`} className="drift" style={{ animationDelay: `${i * -0.7}s` }}>
          <rect x={x - 9} y={y - 6} width={18 + (i % 3) * 6} height="12" rx="3" fill="#fff" stroke={NAVY} strokeOpacity="0.35" transform={`rotate(${(i % 5) * 7 - 14} ${x} ${y})`} />
        </g>
      ))}

      {ordered.map(([x, y], i) => (
        <g key={`o${i}`}>
          <rect x={x} y={y - 7} width="28" height="14" rx="3" fill={i % 3 === 0 ? BRONZE : NAVY} fillOpacity={i % 3 === 0 ? 0.9 : 0.85} />
        </g>
      ))}

      <circle cx={hub[0]} cy={hub[1]} r="10" fill="none" stroke={BRONZE} className="pulse" />
      <circle cx={hub[0]} cy={hub[1]} r="26" fill={NAVY} />
      <text x={hub[0]} y={hub[1] + 4} textAnchor="middle" fontSize="11" fill="#f8f6f1" fontFamily="var(--font-newsreader), serif" fontStyle="italic">
        LLM
      </text>
      <text x="70" y="348" textAnchor="middle" fontSize="11" fill={NAVY} fillOpacity="0.6" fontFamily="var(--font-geist-sans), sans-serif" letterSpacing="2">MANUAL</text>
      <text x="402" y="348" textAnchor="middle" fontSize="11" fill={BRONZE} fontFamily="var(--font-geist-sans), sans-serif" letterSpacing="2">ALIGNED</text>
    </svg>
  );
}
