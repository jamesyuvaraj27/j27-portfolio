import { useMemo, useRef } from "react";
import { motion, useScroll } from "framer-motion";

import { fadeUp, viewportOnce } from "../lib/motion";

// Merges Education + Experience into one chronological, scroll-revealed story —
// mirrors the reference site's "My Journey" timeline. Both models share an
// admin-controlled `order` field (lower = earlier), so the CMS user fully
// controls sequencing without needing real dates.
const JourneyTimeline = ({ education = [], experience = [] }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const steps = useMemo(() => {
    const eduSteps = education.map((e) => ({
      id: `edu-${e.id}`,
      order: e.order ?? 0,
      duration: e.duration,
      title: e.degree,
      subtitle: e.institution,
      description: e.description,
      kind: "Education",
    }));
    const expSteps = experience.map((e) => ({
      id: `exp-${e.id}`,
      order: e.order ?? 0,
      duration: e.duration,
      title: e.title,
      subtitle: e.company,
      description: e.description,
      achievements: e.achievements,
      kind: "Experience",
    }));
    return [...eduSteps, ...expSteps].sort((a, b) => a.order - b.order);
  }, [education, experience]);

  if (!steps.length) return null;

  return (
    <div ref={containerRef} className="relative mx-auto max-w-3xl">
      {/* Spine: static track + scroll-linked fill */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border sm:left-[11px]" aria-hidden="true">
        <motion.div
          style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
          className="h-full w-full bg-gradient-to-b from-primary-light to-accent"
        />
      </div>

      <ol className="space-y-12">
        {steps.map((step, index) => (
          <motion.li
            key={step.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative pl-8 sm:pl-10"
          >
            <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary-light bg-background sm:h-[22px] sm:w-[22px]" />

            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
              {step.duration}
              <span className="ml-2 text-text-secondary/60">· {step.kind}</span>
            </p>
            <h3 className="text-lg font-semibold text-text-primary sm:text-xl">{step.title}</h3>
            <p className="mt-0.5 text-sm text-text-secondary">{step.subtitle}</p>
            {step.description && <p className="mt-3 text-text-secondary">{step.description}</p>}

            {step.achievements?.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {step.achievements.map((a) => (
                  <li
                    key={a}
                    className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-2 text-xs text-text-secondary/50">
              {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
};

export default JourneyTimeline;
