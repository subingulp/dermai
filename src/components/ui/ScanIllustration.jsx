import { motion } from 'motion/react';
import { Camera, Sparkles as SparklesIcon } from 'lucide-react';
import SkinCompanion from './SkinCompanion';
import { SparkleCluster, Star, Twinkle } from './Sparkle';
import CountUp from './CountUp';
import { useReduceMotion } from '../../context/AppContext';

/**
 * The phone-scanning-a-face illustration used on Welcome, the 4 tutorial slides, Main and Analyzing.
 * It is built from positioned HTML (copied from the Figma layout) so each piece can animate.
 *
 * variant: 'snap' | 'measure' | 'track' | 'roi'
 * size:    'lg' (354x320, default) | 'sm' (130px square, used inside the Main invitation card)
 */
export default function ScanIllustration({ variant = 'snap', size = 'lg', scanning = true, floatingAi = true }) {
  const reduce = useReduceMotion();
  const small = size === 'sm';
  const scale = small ? 0.43 : 1;

  const float = (delay = 0) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -5, 0] },
          transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay },
        };

  const art = (
    <div className="scan" style={{ width: 354, height: 320, transform: `scale(${scale})`, transformOrigin: '0 0' }}>
      <div className="scan__orbit" />
      <div className="scan__ring" />

      <div className="scan__phone">
        <div className="scan__viewfinder" />
        <div className="scan__notch" />
        <div className="scan__face">
          <SkinCompanion />
          {variant === 'roi' && (
            <motion.div
              className="scan__roi"
              initial={reduce ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            />
          )}
        </div>
        {scanning && (
          <motion.div
            className="scan__line"
            initial={false}
            animate={reduce ? { y: 0 } : { y: [-76, 62, -76] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div className="scan__capture" />
      </div>

      {variant === 'snap' && (
        <>
          <motion.div className="scan__pill" {...float(0.4)}>
            <Camera size={18} strokeWidth={2} />
            <span>One photo. That's it.</span>
          </motion.div>
          <motion.div className="scan__chip" {...float(0)}>
            <Camera size={20} strokeWidth={2} />
            <span>Snap!</span>
          </motion.div>
        </>
      )}

      {variant !== 'snap' && floatingAi && (
        <motion.div className="scan__chip" {...float(0)}>
          <SparklesIcon size={20} strokeWidth={2} />
          <span>AI</span>
        </motion.div>
      )}

      {variant === 'measure' && (
        <motion.div className="scan__card scan__card--metric" {...float(0.5)}>
          <span className="scan__card-label">Redness</span>
          <strong>
            <CountUp value={18} delay={0.3} />
          </strong>
          <span className="scan__card-bar" />
        </motion.div>
      )}

      {variant === 'track' && (
        <>
          <motion.div className="scan__card scan__card--trend" {...float(0.5)}>
            <svg viewBox="0 0 100 34" width="100" height="34" aria-hidden="true">
              <motion.path
                d="M2 24 C12 6 22 6 30 16 S46 30 56 18 S74 6 82 10 S94 12 98 8"
                fill="none"
                stroke="#172b53"
                strokeWidth="2"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
              />
              <circle cx="98" cy="8" r="2.6" fill="#f8de88" />
            </svg>
            <span className="scan__card-axis">Sep 01 → Sep 22</span>
          </motion.div>
          <motion.div className="scan__card scan__card--mini" {...float(1)}>
            <div className="scan__mini-face">
              <SkinCompanion width={36} height={48} />
            </div>
            <span className="scan__card-axis">Sep 08</span>
          </motion.div>
        </>
      )}

      {variant === 'roi' && (
        <motion.div className="scan__card scan__card--roi" {...float(0.5)}>
          <span className="scan__roi-swatch" />
          <span className="scan__roi-label">Auto ROI crop</span>
        </motion.div>
      )}

      <Twinkle reduce={reduce} style={{ position: 'absolute', left: 36, top: 66 }}>
        <SparkleCluster size={30} />
      </Twinkle>
      <Twinkle reduce={reduce} delay={1.2} style={{ position: 'absolute', left: 281, top: 228 }}>
        <Star size={24} />
      </Twinkle>
    </div>
  );

  if (small) {
    return (
      <div className="scan-wrap scan-wrap--sm" aria-hidden="true">
        <div style={{ position: 'absolute', left: -11, top: -3 }}>{art}</div>
      </div>
    );
  }
  return (
    <div className="scan-wrap" aria-hidden="true">
      {art}
    </div>
  );
}
