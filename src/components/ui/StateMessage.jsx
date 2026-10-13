import Button from './Button';

/** Used for empty, error and not-found states so they all look alike. */
export default function StateMessage({ icon: Icon, title, children, actionLabel, onAction, secondaryLabel, onSecondary, compact }) {
  return (
    <div className={`state${compact ? ' state--compact' : ''}`} role="status">
      {Icon && (
        <span className="state__icon">
          <Icon size={22} strokeWidth={2} aria-hidden="true" />
        </span>
      )}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {secondaryLabel && (
        <Button variant="secondary" onClick={onSecondary}>
          {secondaryLabel}
        </Button>
      )}
    </div>
  );
}
