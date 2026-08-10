import { motion } from "framer-motion";

const AnimatedSection = ({ id, className, children, delay = 0 }) => (
  <motion.section
    id={id}
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.section>
);

export default AnimatedSection;
