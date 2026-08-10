// Static fallback content — used only until the CMS content finishes loading,
// or if the API is unreachable. The real, editable content lives in Postgres
// and is fetched via useContent() from /api/content.

export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Pricing", href: "#pricing" },
  { label: "Gallery", href: "#gallery" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export const FALLBACK_PROFILE = {
  brand: "J27",
  fullName: "Maddela Sir James Yuvaraju",
  role: "AI Creator & Automation Builder",
  tagline: "AI • Websites • Automation for Businesses, Startups & Students",
  valueProposition: "I build AI-powered websites and automation systems that help businesses move faster.",
  summary:
    "I design and ship AI-powered websites, automation workflows, and custom software for businesses, startups, and students.",
  availability: "Open for custom projects — DM to get started",
  email: "jamesyuvaraj27@gmail.com",
  avatarUrl: "",
  socialLinks: [
    { label: "Instagram", href: "https://www.instagram.com/mr__jy__.27/", icon: "instagram" },
    { label: "Email", href: "mailto:jamesyuvaraj27@gmail.com", icon: "mail" },
  ],
};
