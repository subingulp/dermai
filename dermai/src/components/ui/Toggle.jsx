export default function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <div className={`toggle-row${disabled ? ' is-disabled' : ''}`}>
      <div>
        <p className="toggle-row__label">{label}</p>
        {description && <p className="toggle-row__desc">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        className={`switch${checked ? ' is-on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="switch__knob" />
      </button>
    </div>
  );
}
