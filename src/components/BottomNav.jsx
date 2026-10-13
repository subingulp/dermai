import { motion } from 'motion/react'
import { ChartNoAxesCombined, House, UserRound } from 'lucide-react'

const TABS = [
  { id: 'main', label: 'Main', icon: House },
  { id: 'data', label: 'Data', icon: ChartNoAxesCombined },
  { id: 'me', label: 'Me', icon: UserRound },
]

// Exactly three tabs. The pale-blue pill slides between them (layoutId).
export default function BottomNav({ tab, onChange }) {
  return (
    <nav className="nav" aria-label="Main navigation">
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = tab === id
        return (
          <motion.button
            key={id}
            type="button"
            className="nav__tab"
            aria-current={active ? 'page' : undefined}
            onClick={() => onChange(id)}
            whileTap={{ scale: 0.95 }}
          >
            {active && (
              <motion.span
                layoutId="nav-pill"
                className="nav__pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="nav__content">
              <Icon size={22} strokeWidth={2} />
              {label}
            </span>
          </motion.button>
        )
      })}
    </nav>
  )
}
