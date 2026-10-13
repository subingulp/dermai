// Small reusable UI building blocks: Button, Badge, Notice, Toggle, CountUp...

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, Info } from 'lucide-react'

export function Button({ variant = 'primary', block = true, size, className = '', children, ...props }) {
  const cls = ['btn', `btn--${variant}`, block && variant !== 'text' ? 'btn--block' : '', size ? `btn--${size}` : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <motion.button
      type="button"
      className={cls}
      whileHover={props.disabled ? undefined : { y: -1 }}
      whileTap={props.disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function Badge({ tone = 'sun', children, className = '' }) {
  return <span className={`badge badge--${tone} ${className}`}>{children}</span>
}

export function Notice({ children, tone, icon: Icon = Info, role }) {
  return (
    <div className={`notice ${tone ? `notice--${tone}` : ''}`} role={role}>
      <Icon size={16} strokeWidth={2} />
      <div>{children}</div>
    </div>
  )
}

export function BackButton({ onClick, label = 'Go back' }) {
  return (
    <motion.button type="button" className="icon-btn" onClick={onClick} aria-label={label} whileTap={{ scale: 0.92 }}>
      <ArrowLeft size={18} />
    </motion.button>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className="toggle" onClick={() => onChange(!checked)}>
      <motion.span className="toggle__knob" layout transition={{ type: 'spring', stiffness: 500, damping: 34 }} />
    </button>
  )
}

// Counts a number up from its previous value. Skips the animation when the
// user prefers reduced motion.
export function CountUp({ value, suffix = '%', duration = 0.9 }) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? value : 0)
  const from = useRef(reduce ? value : 0)

  useEffect(() => {
    if (reduce) {
      setShown(value)
      from.current = value
      return undefined
    }
    const controls = animate(from.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setShown(Math.round(v)),
      onComplete: () => {
        from.current = value
      },
    })
    return () => controls.stop()
  }, [value, reduce, duration])

  return (
    <>
      {shown}
      {suffix}
    </>
  )
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon size={22} />
      </div>
      <p className="empty__title">{title}</p>
      {children && <p className="small">{children}</p>}
      {action}
    </div>
  )
}
