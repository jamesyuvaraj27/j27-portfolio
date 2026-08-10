import AnimatedSection from "../AnimatedSection";
import SectionHeading from "../SectionHeading";
import { Card } from "../ui";

const AboutSection = ({ profile }) => {
  if (!profile) return null;

  const blocks = [
    { label: "Who I am", text: profile.aboutIntro },
    { label: "Journey", text: profile.aboutJourney },
    { label: "Focus", text: profile.aboutFocus },
    { label: "Mindset", text: profile.aboutMindset },
    { label: "Goals", text: profile.aboutGoals },
  ].filter((b) => b.text);

  return (
    <AnimatedSection id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="About" title={`Meet ${profile.brand}`} subtitle={profile.summary} />

      <div className="grid gap-6 sm:grid-cols-2">
        {blocks.map((block) => (
          <Card key={block.label}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-light">{block.label}</h3>
            <p className="text-text-secondary">{block.text}</p>
          </Card>
        ))}
      </div>

      {profile.strengths?.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-3">
          {profile.strengths.map((s) => (
            <span key={s} className="rounded-full border border-border px-4 py-2 text-sm text-text-secondary">
              {s}
            </span>
          ))}
        </div>
      )}
    </AnimatedSection>
  );
};

export default AboutSection;
