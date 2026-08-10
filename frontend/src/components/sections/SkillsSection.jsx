import AnimatedSection from "../AnimatedSection";
import SectionHeading from "../SectionHeading";
import { Card } from "../ui";

const SkillsSection = ({ skills = [] }) => {
  if (skills.length === 0) return null;

  const grouped = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <AnimatedSection id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Skills" title="Tools & Expertise" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(grouped).map(([category, items]) => (
          <Card key={category}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary-light">{category}</h3>
            <div className="space-y-3">
              {items.map((skill) => (
                <div key={skill.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span className="text-text-secondary">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default SkillsSection;
