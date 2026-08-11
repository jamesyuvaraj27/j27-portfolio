import { motion } from "framer-motion";

import SectionKicker from "../SectionKicker";
import { Card } from "../ui";
import { EASE, fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";

const SkillsSection = ({ skills = [] }) => {
  if (skills.length === 0) return null;

  const grouped = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionKicker number="04" label="Skills" />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-2xl text-3xl font-bold sm:text-4xl"
      >
        Tools & <span className="gradient-text italic">expertise.</span>
      </motion.h2>

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Object.entries(grouped).map(([category, items]) => (
          <motion.div key={category} variants={fadeUp}>
            <Card>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-light">{category}</h3>
              <div className="space-y-3">
                {items.map((skill) => (
                  <div key={skill.id}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{skill.name}</span>
                      <span className="text-text-secondary">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={viewportOnce}
                        transition={{ duration: 1, ease: EASE }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default SkillsSection;
