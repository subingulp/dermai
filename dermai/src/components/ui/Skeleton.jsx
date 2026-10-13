export default function Skeleton({ height = 80, radius = 24, className = '' }) {
  return <div className={`skeleton ${className}`} style={{ height, borderRadius: radius }} aria-hidden="true" />;
}
