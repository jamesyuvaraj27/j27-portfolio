import { motion } from "framer-motion";

// Small numbered label used at the top of every section — "01 Hero", "02 About", etc.
// Purely a design signature borrowed from the reference portfolio; costs nothing, reads as "designed".
const SectionKicker = ({ number, label, align = "left" }) => (
  <motion.p
    initial={{ opacity: 0, x: -12 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.6 }}
    transition={{ duration: 0.5 }}
    className={`mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary-light ${
      align === "center" ? "justify-center" : ""
    }`}
  >
    <span className="text-text-secondary/60">{number}</span>
    <span className="h-px w-6 bg-primary-light/60" />
    <span>{label}</span>
  </motion.p>
);

export default SectionKicker;
