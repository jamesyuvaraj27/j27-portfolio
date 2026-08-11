import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

import SectionKicker from "../SectionKicker";
import { Badge, Card } from "../ui";
import { mediaUrl } from "../../lib/utils";
import { EASE, fadeUp, staggerContainer, viewportOnce } from "../../lib/motion";

const ProjectsSection = ({ projects = [], filters = { tech: ["All"] } }) => {
  const [activeFilter, setActiveFilter] = useState("All");

  if (projects.length === 0) return null;

  const visible = activeFilter === "All" ? projects : projects.filter((p) => p.techStack?.includes(activeFilter));

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <SectionKicker number="03" label="Featured Work" />
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-2xl text-3xl font-bold sm:text-4xl"
      >
        Selected projects, <span className="gradient-text italic">designed to ship.</span>
      </motion.h2>
      <p className="mt-4 max-w-xl text-text-secondary">A sample of recent client and personal builds.</p>

      <div className="mb-10 mt-8 flex flex-wrap justify-center gap-2">
        {filters.tech.map((tech) => (
          <button
            key={tech}
            onClick={() => setActiveFilter(tech)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 ${
              activeFilter === tech
                ? "bg-primary text-white"
                : "border border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      <motion.div
        layout
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              variants={fadeUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <Card className="flex h-full flex-col overflow-hidden p-0">
                {project.image && (
                  <div className="overflow-hidden">
                    <img
                      src={mediaUrl(project.image)}
                      alt={project.title}
                      className="h-44 w-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2 text-xs text-text-secondary/50">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
                  <p className="mb-4 flex-1 text-sm text-text-secondary">{project.description}</p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.techStack?.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-1 text-sm text-primary-light hover:underline"
                      >
                        <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" /> Live
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
                      >
                        <Github size={14} className="transition-transform group-hover:translate-x-0.5" /> Code
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-8 text-center text-xs text-text-secondary/50">
        {String(visible.length).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} projects shown
      </p>
    </section>
  );
};

export default ProjectsSection;
