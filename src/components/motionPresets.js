// Shared animation settings so every screen moves the same way.

export const ease = [0.22, 1, 0.36, 1] // soft "ease-out"

// Whole-screen transition (fade + small slide).
export const screenVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
}

// Staggered entrance: put `stagger` on the parent, `item` on each child.
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
}

// Tutorial slides slide sideways in the direction of travel.
export const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.36, ease } },
  exit: (dir) => ({ opacity: 0, x: dir * -48, transition: { duration: 0.2 } }),
}
