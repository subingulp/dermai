import { Info } from 'lucide-react';

export default function Disclaimer({ children = 'AI results are for observation and reference, not medical diagnosis.' }) {
  return (
    <div className="note" role="note">
      <Info size={16} strokeWidth={2} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
