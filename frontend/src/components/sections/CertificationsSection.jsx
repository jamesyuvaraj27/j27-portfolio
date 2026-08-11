import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";

import SectionKicker from "../SectionKicker";
import { Card } from "../ui";
import { formatMonthYear } from "../../lib/utils";
import { EASE, fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";

const CertificationsSection = ({ certifications = [] }) => {
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="mx-auto max-w-6xl px-6 py-24">
      <SectionKicker number="05" label="Credentials" />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-2xl text-3xl font-bold sm:text-4xl"
      >
        Certifications & <span className="gradient-text italic">credentials.</span>
      </motion.h2>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {certifications.map((cert, index) => (
          <motion.div key={cert.id} variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: EASE }}>
            <Card className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
                <Award size={18} />
              </div>
              <div>
                <p className="mb-1 text-xs text-text-secondary/50">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="font-semibold">{cert.title}</h3>
                <p className="text-sm text-text-secondary">{cert.issuer}</p>
                <p className="mt-1 text-xs text-text-secondary/70">{formatMonthYear(cert.completionDate)}</p>
                {cert.credentialLink && (
                  <a
                    href={cert.credentialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-2 inline-flex items-center gap-1 text-xs text-primary-light hover:underline"
                  >
                    Verify <ExternalLink size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CertificationsSection;
