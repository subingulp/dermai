import { motion } from 'motion/react'
import { FlaskConical, ShieldCheck, SlidersHorizontal, Sparkles, UserRound } from 'lucide-react'
import { SkinCompanion } from '../components/Illustration'
import { item, stagger } from '../components/motionPresets'

const ROWS = [
  { to: 'profile', label: 'My Skin Profile', icon: UserRound },
  { to: 'routine', label: 'My Skincare Routine', icon: FlaskConical },
  { to: 'settings', label: 'AI Analysis Settings', icon: SlidersHorizontal },
  { to: 'privacy', label: 'Privacy & Data', icon: ShieldCheck },
  { to: 'about', label: 'About DermAI', icon: Sparkles },
]

export default function MeTab({ nav }) {
  return (
    <div className="scroll">
      <motion.div className="pad stack-16" variants={stagger} initial="hidden" animate="show">
        <motion.h1 className="h1" style={{ fontSize: 26 }} variants={item}>
          Me Page
        </motion.h1>

        <motion.div className="guest" variants={item}>
          <div className="guest__avatar">
            <SkinCompanion className="guest__face" />
          </div>
          <div>
            <p className="h3" style={{ fontSize: 18 }}>
              Guest User
            </p>
            <p className="small">Your skin story starts here.</p>
          </div>
        </motion.div>

        <div className="stack-12">
          {ROWS.map(({ to, label, icon: Icon }) => (
            <motion.button
              key={to}
              type="button"
              className="card list-row"
              variants={item}
              whileTap={{ scale: 0.985 }}
              whileHover={{ x: 2 }}
              onClick={() => nav.go(to)}
            >
              <Icon size={18} />
              <span>{label} →</span>
            </motion.button>
          ))}
        </div>

        <motion.div className="me-footer" variants={item}>
          <p className="brand" style={{ fontSize: 14 }}>
            DermAI ✦
          </p>
          <p className="tiny">A little clarity, every day · v1.0 (demo)</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
