import { Github, Instagram, Linkedin, Mail } from "lucide-react";

import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import { mediaUrl } from "../../lib/utils";

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail, instagram: Instagram };

const HeroSection = ({ profile }) => {
  if (!profile) return null;

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(109,40,217,0.25),transparent_50%),radial-gradient(circle_at_80%_60%,rgba(244,114,182,0.15),transparent_50%)]" />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-light">
            {profile.availability}
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {profile.brand} — <span className="gradient-text">{profile.role}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-secondary">{profile.tagline}</p>
          <p className="mt-4 max-w-xl text-text-secondary">{profile.valueProposition}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button as="a" href="#contact" size="lg">
              DM to Get Started
            </Button>
            <Button as="a" href="#projects" variant="outline" size="lg">
              View Work
            </Button>
          </div>

          <div className="mt-8 flex gap-4">
            {(profile.socialLinks || []).map((link) => {
              const Icon = ICONS[link.icon] || Mail;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary-light hover:text-primary-light"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <Avatar src={mediaUrl(profile.avatarUrl)} alt={profile.brand} size={260} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
