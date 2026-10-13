import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChartNoAxesCombined, House, UserRound } from 'lucide-react';

const TABS = [
  { to: '/app/main', label: 'Main', Icon: House },
  { to: '/app/data', label: 'Data', Icon: ChartNoAxesCombined },
  { to: '/app/me', label: 'Me', Icon: UserRound },
];

export default function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Primary">
      {TABS.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bottomnav__tab${isActive ? ' is-active' : ''}`}>
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span layoutId="nav-pill" className="bottomnav__pill" transition={{ type: 'spring', stiffness: 480, damping: 36 }} />
              )}
              <Icon size={22} strokeWidth={2} aria-hidden="true" className="bottomnav__icon" />
              <span className="bottomnav__label">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
