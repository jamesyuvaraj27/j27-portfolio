import { Bot, Globe, Sparkles, Workflow } from "lucide-react";

import AnimatedSection from "../AnimatedSection";
import SectionHeading from "../SectionHeading";
import { Card } from "../ui";

const ICONS = { bot: Bot, globe: Globe, workflow: Workflow, sparkles: Sparkles };

const ServicesSection = ({ services = [] }) => {
  if (services.length === 0) return null;

  return (
    <AnimatedSection id="services" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Services"
        title="What I build"
        subtitle="AI, websites, and automation — tailored for businesses, startups, and students."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const Icon = ICONS[service.icon] || Sparkles;
          return (
            <Card key={service.id} className="group" style={{ transitionDelay: `${i * 40}ms` }}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
                <Icon size={20} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
              <p className="text-sm text-text-secondary">{service.description}</p>
            </Card>
          );
        })}
      </div>
    </AnimatedSection>
  );
};

export default ServicesSection;
