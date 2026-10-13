export default function Badge({ tone = 'cream', children, className = '' }) {
  return <span className={`badge badge--${tone} ${className}`}>{children}</span>;
}
