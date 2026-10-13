// Wrapper that gives every screen the same page transition and scroll area.

import { motion } from 'motion/react'
import { BackButton } from './ui'
import { screenVariants } from './motionPresets'

export default function Screen({ children, scroll = true, className = '' }) {
  return (
    <motion.div className={`screen ${className}`} variants={screenVariants} initial="initial" animate="animate" exit="exit">
      {scroll ? (
        <div className="scroll">
          <div className="pad">{children}</div>
        </div>
      ) : (
        children
      )}
    </motion.div>
  )
}

export function ScreenHeader({ title, onBack, subtitle }) {
  return (
    <header className="screen-header">
      {onBack && <BackButton onClick={onBack} />}
      <h1 className="h1" style={{ fontSize: 26 }}>
        {title}
      </h1>
      {subtitle && <p className="small">{subtitle}</p>}
    </header>
  )
}
