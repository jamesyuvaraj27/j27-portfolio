import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_SECTIONS = [
  { key: "hero", label: "Home", order: 0 },
  { key: "about", label: "About", order: 1 },
  { key: "services", label: "Services", order: 2 },
  { key: "projects", label: "Projects", order: 3 },
  { key: "skills", label: "Skills", order: 4 },
  { key: "certifications", label: "Certificates", order: 5 },
  { key: "gallery", label: "Gallery", order: 6 },
  { key: "pricing", label: "Pricing", order: 7 },
  { key: "blog", label: "Blog", order: 8 },
  { key: "contact", label: "Contact", order: 9 },
];

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env before seeding.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, password: hashedPassword, role: "ADMIN" },
  });

  console.log(`Admin user ready: ${admin.email}`);

  await prisma.profile.upsert({
    where: { id: "profile" },
    update: {},
    create: {
      id: "profile",
      brand: "J27",
      fullName: "Maddela Sir James Yuvaraju",
      role: "AI Creator & Automation Builder",
      tagline: "AI • Websites • Automation for Businesses, Startups & Students",
      valueProposition: "I build AI-assisted websites and automation systems that help businesses move faster.",
      summary:
        "I design and ship AI-powered websites, automation workflows, and custom software for businesses, startups, and students — from idea to deployed product.",
      availability: "Open for custom projects — DM to get started",
      location: "India",
      email: "jamesyuvaraj27@gmail.com",
      phone: "+91 82478 52680",
      avatarUrl: "",
      aboutIntro: "I'm J27 — an AI creator building websites and automation systems for real businesses.",
      aboutJourney:
        "What started as curiosity about how software works turned into building full AI-assisted products: websites, automation pipelines, and AI agents.",
      aboutFocus: "Clean product thinking, fast delivery, and automation that actually saves clients time.",
      aboutMindset: "Ship, measure, improve — and stay close to what clients actually need.",
      aboutGoals: "Help businesses and startups adopt AI and automation without the complexity.",
      skillBadges: ["AI Agents", "Automation", "React", "Node.js", "Prompt Engineering"],
      strengths: ["AI workflow design", "Full-stack delivery", "Client communication", "Fast iteration"],
      socialLinks: [
        { label: "Instagram", href: "https://www.instagram.com/mr__jy__.27/", icon: "instagram" },
        { label: "Email", href: "mailto:jamesyuvaraj27@gmail.com", icon: "mail" },
        { label: "GitHub", href: "https://github.com/jamesyuvaraj27", icon: "github" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/jamesyuvaraj27/", icon: "linkedin" },
      ],
    },
  });

  await prisma.themeSettings.upsert({
    where: { id: "theme" },
    update: {},
    create: { id: "theme" },
  });

  for (const section of DEFAULT_SECTIONS) {
    await prisma.sectionConfig.upsert({
      where: { key: section.key },
      update: {},
      create: { ...section, enabled: true },
    });
  }

  console.log("Seed complete: profile, theme, and section config initialized.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
