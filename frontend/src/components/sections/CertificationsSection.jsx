import { Award, ExternalLink } from "lucide-react";

import AnimatedSection from "../AnimatedSection";
import SectionHeading from "../SectionHeading";
import { Card } from "../ui";
import { formatMonthYear } from "../../lib/utils";

const CertificationsSection = ({ certifications = [] }) => {
  if (certifications.length === 0) return null;

  return (
    <AnimatedSection id="certifications" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Credentials" title="Certifications" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <Card key={cert.id} className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-semibold">{cert.title}</h3>
              <p className="text-sm text-text-secondary">{cert.issuer}</p>
              <p className="mt-1 text-xs text-text-secondary/70">{formatMonthYear(cert.completionDate)}</p>
              {cert.credentialLink && (
                <a href={cert.credentialLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary-light hover:underline">
                  Verify <ExternalLink size={12} />
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default CertificationsSection;
