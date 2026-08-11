import { motion } from "framer-motion";

import SectionKicker from "../SectionKicker";
import JourneyTimeline from "../JourneyTimeline";
import { Card } from "../ui";
import { EASE, fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";

const AboutSection = ({ profile, education = [], experience = [] }) => {
  if (!profile) return null;

  const blocks = [
    { label: "Who I am", text: profile.aboutIntro },
    { label: "Focus", text: profile.aboutFocus },
    { label: "Mindset", text: profile.aboutMindset },
    { label: "Goals", text: profile.aboutGoals },
  ].filter((b) => b.text);

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionKicker number="01" label="About" />

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl"
      >
        Meet {profile.brand} — building <span className="gradient-text italic">what's next</span>.
      </motion.h2>

      {profile.summary && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-5 max-w-2xl text-text-secondary"
        >
          {profile.summary}
        </motion.p>
      )}

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-10 grid gap-6 sm:grid-cols-2"
      >
        {blocks.map((block) => (
          <motion.div key={block.label} variants={fadeUp}>
            <Card>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-light">
                {block.label}
              </h3>
              <p className="text-text-secondary">{block.text}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {profile.strengths?.length > 0 && (
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10 flex flex-wrap gap-3"
        >
          {profile.strengths.map((s) => (
            <motion.span
              key={s}
              variants={fadeUp}
              className="rounded-full border border-border px-4 py-2 text-sm text-text-secondary"
            >
              {s}
            </motion.span>
          ))}
        </motion.div>
      )}

      {(education.length > 0 || experience.length > 0) && (
        <div className="mt-24">
          <SectionKicker number="01.1" label="My Journey" />
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-14 max-w-2xl text-2xl font-bold sm:text-3xl"
          >
            The path so far — <span className="gradient-text italic">education and experience</span>, in order.
          </motion.h3>

          <JourneyTimeline education={education} experience={experience} />
        </div>
      )}
    </section>
  );
};

export default AboutSection;
