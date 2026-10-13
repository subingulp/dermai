import { motion } from 'motion/react';
import { FlaskConical, ShieldCheck, SlidersHorizontal, Sparkles, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SkinCompanion from '../components/ui/SkinCompanion';
import { useApp } from '../context/AppContext';
import { riseIn, staggerParent } from '../animations';

const ROWS = [
  { to: '/me/profile', label: 'My Skin Profile', Icon: UserRound },
  { to: '/me/routine', label: 'My Skincare Routine', Icon: FlaskConical },
  { to: '/me/settings', label: 'AI Analysis Settings', Icon: SlidersHorizontal },
  { to: '/me/privacy', label: 'Privacy & Data', Icon: ShieldCheck },
  { to: '/me/about', label: 'About DermAI', Icon: Sparkles },
];

export default function Me() {
  const navigate = useNavigate();
  const { profile } = useApp();
  return (
    <div className="scroll">
      <motion.div className="page" variants={staggerParent} initial="hidden" animate="show">
        <motion.header className="titleblock" variants={riseIn}>
          <h1>Me Page</h1>
        </motion.header>

        <motion.section className="guestcard" variants={riseIn}>
          <span className="guestcard__avatar">
            <SkinCompanion width={44} height={60} />
          </span>
          <div>
            <h2>{profile.name || 'Guest User'}</h2>
            <p>Your skin story starts here.</p>
          </div>
        </motion.section>

        <motion.ul className="menu" variants={riseIn}>
          {ROWS.map(({ to, label, Icon }) => (
            <li key={to}>
              <motion.button type="button" className="menu__row" whileTap={{ scale: 0.985 }} onClick={() => navigate(to)}>
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
                <span>{label}</span>
                <span aria-hidden="true">→</span>
              </motion.button>
            </li>
          ))}
        </motion.ul>

        <motion.footer className="mefoot" variants={riseIn}>
          <strong>DermAI ✦</strong>
          <span>A little clarity, every day. · v1.0</span>
        </motion.footer>
      </motion.div>
    </div>
  );
}
