import { motion } from "framer-motion";
import { Bot, Globe, Sparkles, Workflow } from "lucide-react";

import SectionKicker from "../SectionKicker";
import { Card } from "../ui";
import { EASE, fadeUp, scaleIn, staggerContainer, viewportOnce } from "../../lib/motion";

const ICONS = { bot: Bot, globe: Globe, workflow: Workflow, sparkles: Sparkles };

const ServicesSection = ({ services = [] }) => {
  if (services.length === 0) return null;

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24">
      <SectionKicker number="02" label="Services" />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-2xl text-3xl font-bold sm:text-4xl"
      >
        What I <span className="gradient-text italic">build.</span>
      </motion.h2>
      <p className="mt-4 max-w-xl text-text-secondary">
        AI, websites, and automation — tailored for businesses, startups, and students.
      </p>

      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service) => {
          const Icon = ICONS[service.icon] || Sparkles;
          return (
            <motion.div key={service.id} variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
              <Card className="h-full">
                <motion.div
                  variants={scaleIn}
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary-light"
                >
                  <Icon size={20} />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
                <p className="text-sm text-text-secondary">{service.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default ServicesSection;
