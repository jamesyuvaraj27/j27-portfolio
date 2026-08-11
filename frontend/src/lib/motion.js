// Shared Framer Motion primitives used across every section, so every reveal
// on the site shares the same "grammar" instead of each component reinventing it.

// Premium, slightly decelerated ease — feels more deliberate than plain "easeOut".
export const EASE = [0.16, 1, 0.3, 1];

// Fade + rise, for a single element.
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Parent wrapper that staggers however many fadeUp children it contains.
// Usage: <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewportOnce}>
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

// Standard viewport gate — reveal once, a bit before the element is fully on screen.
export const viewportOnce = { once: true, amount: 0.2 };

// Scale + fade, good for icons/logos/cards.
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

// Hover/tap micro-interaction props, spread onto motion.button / motion.a.
export const hoverLift = {
  whileHover: { y: -6 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.25, ease: EASE },
};

export const magneticButton = {
  whileHover: { scale: 1.04 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.2, ease: EASE },
};
