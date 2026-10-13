import { motion } from 'motion/react';
import { pageVariants } from '../../animations';

/** Wrap a whole screen so it fades/slides in and out when the route changes. */
export default function PageTransition({ children, className = 'screen' }) {
  return (
    <motion.div className={className} variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}
