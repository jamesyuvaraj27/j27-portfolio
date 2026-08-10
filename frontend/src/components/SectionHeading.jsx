const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center mx-auto max-w-2xl" : ""}`}>
    {eyebrow && (
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">{eyebrow}</p>
    )}
    <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
    {subtitle && <p className="mt-4 text-text-secondary">{subtitle}</p>}
  </div>
);

export default SectionHeading;
