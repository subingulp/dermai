import { motion } from 'motion/react';

/** variant: 'primary' (navy) | 'secondary' (pale blue) | 'text' (link-like) */
export default function Button({ variant = 'primary', className = '', children, disabled, ...props }) {
  return (
    <motion.button
      type="button"
      className={`btn btn--${variant} ${className}`}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
