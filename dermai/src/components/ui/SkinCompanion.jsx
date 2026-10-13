// The friendly face mascot. Drawn as SVG so it stays crisp at any size.
export default function SkinCompanion({ width = 114, height = 154, className = '' }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 114 154" aria-hidden="true" focusable="false">
      <ellipse cx="57" cy="96" rx="40" ry="50" fill="#f7d6c6" />
      <path
        d="M15 82 C9 34 30 5 58 5 C86 5 106 30 99 82 C91 62 77 53 62 48 C48 58 30 63 15 82 Z"
        fill="#172b53"
      />
      <circle cx="42" cy="97" r="3.2" fill="#172b53" />
      <circle cx="72" cy="97" r="3.2" fill="#172b53" />
      <ellipse cx="33" cy="109" rx="9" ry="5" fill="#f2b8a8" opacity="0.85" />
      <ellipse cx="81" cy="109" rx="9" ry="5" fill="#f2b8a8" opacity="0.85" />
      <path d="M48 112 Q57 122 66 112" fill="none" stroke="#172b53" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
