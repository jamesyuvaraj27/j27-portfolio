import Navbar from "../components/Navbar";
import Seo from "../components/Seo";
import { NAV_ITEMS, FALLBACK_PROFILE } from "../lib/site";
import { isSectionEnabled, useContent } from "../lib/useContent";
import {
  AboutSection,
  BlogSection,
  CertificationsSection,
  ContactSection,
  GallerySection,
  HeroSection,
  PricingSection,
  ProjectsSection,
  ServicesSection,
  SkillsSection,
} from "../components/sections";

const SECTION_COMPONENTS = {
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  certifications: CertificationsSection,
  gallery: GallerySection,
  pricing: PricingSection,
  blog: BlogSection,
  contact: ContactSection,
};

const HomePage = () => {
  const { data, loading } = useContent();

  const profile = data?.profile || FALLBACK_PROFILE;
  const sections = data?.sections || [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-light border-t-transparent" />
      </div>
    );
  }

  const orderedKeys = sections.length
    ? sections.map((s) => s.key)
    : Object.keys(SECTION_COMPONENTS);

  return (
    <>
      <Seo title={`${profile.brand} — ${profile.role}`} description={profile.tagline} />
      <Navbar brand={profile.brand} navItems={NAV_ITEMS} />

      <main>
        {orderedKeys.map((key) => {
          if (!isSectionEnabled(sections, key)) return null;
          const SectionComponent = SECTION_COMPONENTS[key];
          if (!SectionComponent) return null;

          const props = {
            hero: { profile },
            about: { profile },
            services: { services: data?.services },
            projects: { projects: data?.projects, filters: data?.filters },
            skills: { skills: data?.skills },
            certifications: { certifications: data?.certifications },
            gallery: { photos: data?.photos },
            pricing: { pricingPlans: data?.pricingPlans },
            blog: { posts: data?.posts },
            contact: { profile },
          }[key];

          return <SectionComponent key={key} {...props} />;
        })}
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-text-secondary">
        © {new Date().getFullYear()} {profile.brand}. All rights reserved.
        {" · "}
        <a href="/admin/login" className="opacity-40 hover:opacity-100 transition-opacity">
          Admin
        </a>
      </footer>
    </>
  );
};

export default HomePage;
