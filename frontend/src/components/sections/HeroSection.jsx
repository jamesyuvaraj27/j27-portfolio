import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import Counter from "../Counter";
import Marquee from "../Marquee";
import { mediaUrl } from "../../lib/utils";
import { EASE, fadeUp, staggerContainer } from "../../lib/motion";

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail, instagram: Instagram };

const DEFAULT_STATS = [
  { label: "Projects Shipped", value: 5, suffix: "+" },
  { label: "CGPA", value: 9, suffix: ".09" },
  { label: "Tech Stack", value: 15, suffix: "+" },
];

const HeroSection = ({ profile }) => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Subtle parallax: portrait drifts up slightly slower than the page scrolls past it.
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  if (!profile) return null;

  const tickerItems =
    profile.skillBadges?.length > 0
      ? profile.skillBadges
      : ["AI Agents", "Full-Stack", "Automation", "React", "Node.js", "PostgreSQL"];

  return (
    <section ref={heroRef} id="home" className="relative flex min-h-screen flex-col overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(109,40,217,0.25),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(244,114,182,0.15),transparent_50%)]" />

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="show"
        className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 md:grid-cols-[1.2fr_0.8fr]"
      >
        <div>
          <motion.p
            variants={fadeUp}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-light"
          >
            {profile.availability}
          </motion.p>

          <motion.h1 variants={fadeUp} className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {profile.brand} — <span className="gradient-text italic">{profile.role}</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-text-secondary">
            {profile.tagline}
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-text-secondary">
            {profile.valueProposition}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <Button as="a" href="#contact" size="lg">
              DM to Get Started
            </Button>
            <Button as="a" href="#projects" variant="outline" size="lg">
              View Work
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex gap-4">
            {(profile.socialLinks || []).map((link) => {
              const Icon = ICONS[link.icon] || Mail;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-200 hover:-translate-y-1 hover:border-primary-light hover:text-primary-light"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {DEFAULT_STATS.map((stat) => (
              <div key={stat.label}>
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-2xl font-bold text-text-primary sm:text-3xl"
                />
                <p className="mt-1 text-xs text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ y: portraitY }}
          variants={fadeUp}
          className="flex justify-center md:justify-end"
        >
          <Avatar src={mediaUrl(profile.avatarUrl)} alt={profile.brand} size={260} />
        </motion.div>
      </motion.div>

      <div className="py-8">
        <Marquee items={tickerItems} direction="left" speed={28} />
      </div>

      <motion.div
        style={{ opacity: scrollCueOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6, ease: EASE }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-text-secondary"
      >
        Scroll to explore ↓
      </motion.div>
    </section>
  );
};

export default HeroSection;
