import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";

import AnimatedSection from "../AnimatedSection";
import SectionHeading from "../SectionHeading";
import { Badge, Card } from "../ui";
import { mediaUrl } from "../../lib/utils";

const ProjectsSection = ({ projects = [], filters = { tech: ["All"] } }) => {
  const [activeFilter, setActiveFilter] = useState("All");

  if (projects.length === 0) return null;

  const visible = activeFilter === "All" ? projects : projects.filter((p) => p.techStack?.includes(activeFilter));

  return (
    <AnimatedSection id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Work" title="Selected Projects" subtitle="A sample of recent client and personal builds." />

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {filters.tech.map((tech) => (
          <button
            key={tech}
            onClick={() => setActiveFilter(tech)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              activeFilter === tech ? "bg-primary text-white" : "border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <Card key={project.id} className="flex flex-col overflow-hidden p-0">
            {project.image && (
              <img src={mediaUrl(project.image)} alt={project.title} className="h-44 w-full object-cover" loading="lazy" />
            )}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
              <p className="mb-4 flex-1 text-sm text-text-secondary">{project.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {project.techStack?.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <div className="flex gap-3">
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary-light hover:underline">
                    <ExternalLink size={14} /> Live
                  </a>
                )}
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
                    <Github size={14} /> Code
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default ProjectsSection;
