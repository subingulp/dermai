// The phone + "skin companion" illustration used on Welcome, Tutorial and
// Main. It is drawn in a fixed 354 x 320 box (the size used in Figma) and
// scaled with the `scale` prop, so one component serves every screen.

import { motion } from 'motion/react'
import { Camera, Sparkles } from 'lucide-react'
import '../styles/illustration.css'

export function SkinCompanion({ className }) {
  return (
    <svg className={className} viewBox="0 0 114 154" aria-hidden="true">
      {/* neck + face */}
      <path d="M40 120h34v22c0 6-7 10-17 10s-17-4-17-10z" fill="#f2c3b1" />
      <ellipse cx="57" cy="86" rx="40" ry="50" fill="#f7d6c8" />
      {/* hair */}
      <path
        d="M16 80c-6-44 20-70 46-70 28 0 46 24 38 66-12-8-24-22-30-38-10 16-30 32-54 42z"
        fill="#172b53"
      />
      {/* cheeks, eyes, smile */}
      <ellipse cx="34" cy="99" rx="8" ry="5" fill="#f2b3a0" opacity=".75" />
      <ellipse cx="80" cy="99" rx="8" ry="5" fill="#f2b3a0" opacity=".75" />
      <circle cx="42" cy="86" r="2.8" fill="#172b53" />
      <circle cx="72" cy="86" r="2.8" fill="#172b53" />
      <path d="M48 106c5 6 13 6 18 0" stroke="#172b53" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function Sparkle4({ size, color = '#172b53', fill = 'none', className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10z"
        fill={fill}
        stroke={color}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// A soft up-and-down float. Disabled automatically when the user prefers reduced motion.
const float = (delay = 0, dist = 6, dur = 3.6) => ({
  animate: { y: [0, -dist, 0] },
  transition: { duration: dur, repeat: Infinity, ease: 'easeInOut', delay },
})

const twinkle = (delay = 0) => ({
  animate: { opacity: [0.45, 1, 0.45], scale: [0.9, 1.1, 0.9] },
  transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay },
})

function PhotoBadges() {
  return (
    <>
      <motion.div className="ill__badge ill__badge--photo" {...float(0.4, 4)}>
        <Camera size={18} strokeWidth={2} />
        <span>One photo. That&apos;s it.</span>
      </motion.div>
      <motion.div className="ill__badge ill__badge--ai" {...float(0, 6)}>
        <Camera size={20} strokeWidth={2} />
        <span>Snap!</span>
      </motion.div>
    </>
  )
}

function AiBadge() {
  return (
    <motion.div className="ill__badge ill__badge--ai" {...float(0, 6)}>
      <Sparkles size={20} strokeWidth={2} />
      <span>AI</span>
    </motion.div>
  )
}

function RednessCard() {
  return (
    <motion.div className="ill__mini ill__mini--redness" {...float(0.6, 5)}>
      <span className="ill__mini-label">Redness</span>
      <span className="ill__mini-value">18%</span>
      <span className="ill__mini-bar" />
    </motion.div>
  )
}

function TrendCard() {
  return (
    <motion.div className="ill__mini ill__mini--trend" {...float(0.6, 5)}>
      <svg viewBox="0 0 140 52" width="140" height="52" aria-hidden="true">
        <motion.path
          d="M2 40c14-18 24-22 34-8s20 14 32-6 24-20 36-12 22-6 32-16"
          fill="none"
          stroke="#172b53"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        />
        <circle cx="138" cy="6" r="3" fill="#f8de88" />
      </svg>
      <span className="ill__mini-axis">Sep 01 → Sep 22</span>
    </motion.div>
  )
}

function DayCard() {
  return (
    <motion.div className="ill__mini ill__mini--day" {...float(1, 5)}>
      <SkinCompanion className="ill__mini-face" />
      <span className="ill__mini-axis">Sep 08</span>
    </motion.div>
  )
}

function RoiCard() {
  return (
    <motion.div className="ill__mini ill__mini--roi" {...float(0.6, 5)}>
      <span className="ill__roi-swatch" />
      <span className="ill__roi-label">Auto ROI crop</span>
    </motion.div>
  )
}

const OVERLAYS = {
  photo: PhotoBadges,
  analyze: () => (
    <>
      <AiBadge />
      <RednessCard />
    </>
  ),
  track: () => (
    <>
      <AiBadge />
      <TrendCard />
      <DayCard />
    </>
  ),
  risk: () => (
    <>
      <AiBadge />
      <RoiCard />
    </>
  ),
  none: () => null,
}

/**
 * variant: 'photo' | 'analyze' | 'track' | 'risk' | 'none'
 * scale:   1 = full size (354 x 320). Main uses ~0.38.
 */
export default function Illustration({ variant = 'photo', scale = 1, scanning = true }) {
  const Overlay = OVERLAYS[variant]
  return (
    <div className="ill-wrap" style={{ width: 354 * scale, height: 320 * scale }} aria-hidden="true">
      <div className="ill" style={{ transform: `scale(${scale})` }}>
        <div className="ill__orbit" />
        <svg className="ill__ring" viewBox="0 0 322 310" width="322" height="310">
          <ellipse cx="161" cy="155" rx="159" ry="153" fill="none" stroke="#bed4ec" strokeWidth="1.4" strokeDasharray="4 5" />
        </svg>

        <div className="ill__phone">
          <div className="ill__viewfinder" />
          <div className="ill__notch" />
          <div className="ill__face">
            <SkinCompanion className="ill__face-svg" />
          </div>
          {variant === 'risk' && <span className="ill__roi-box" />}
          <motion.div
            className="ill__scan"
            animate={scanning ? { y: [-52, 52, -52] } : undefined}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="ill__capture" />
        </div>

        <Overlay />

        <motion.span className="ill__sparkle ill__sparkle--a" {...twinkle(0)}>
          <Sparkle4 size={24} />
        </motion.span>
        <motion.span className="ill__sparkle ill__sparkle--b" {...twinkle(0.8)}>
          <Sparkle4 size={30} color="#e2bd4a" fill="#fff5d6" />
        </motion.span>
      </div>
    </div>
  )
}
