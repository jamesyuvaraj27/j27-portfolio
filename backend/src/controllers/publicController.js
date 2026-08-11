import { prisma } from "../config/db.js";

// Single aggregated payload for the public site — keeps the homepage to one
// network request, and respects section enable/disable + ordering from the CMS.
export const getPortfolioContent = async (req, res, next) => {
  try {
    const [
      profile,
      theme,
      sections,
      services,
      projects,
      skills,
      education,
      experience,
      certifications,
      testimonials,
      photos,
      pricingPlans,
      posts,
      resume,
      logo,
    ] = await Promise.all([
      prisma.profile.findUnique({ where: { id: "profile" } }),
      prisma.themeSettings.findUnique({ where: { id: "theme" } }),
      prisma.sectionConfig.findMany({ orderBy: { order: "asc" } }),
      prisma.service.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] }),
      prisma.skill.findMany({ orderBy: [{ category: "asc" }, { level: "desc" }] }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.certification.findMany({ orderBy: { completionDate: "desc" } }),
      prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.photo.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }),
      prisma.pricingPlan.findMany({ orderBy: { order: "asc" } }),
      prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 6 }),
      prisma.siteAsset.findUnique({ where: { key: "resume" } }),
      prisma.siteAsset.findUnique({ where: { key: "logo" } }),
    ]);

    res.json({
      profile,
      theme,
      sections,
      services,
      projects,
      featuredProjects: projects.filter((p) => p.featured),
      skills,
      education,
      experience,
      certifications,
      testimonials,
      photos,
      pricingPlans,
      posts,
      resume: resume || null,
      logo: logo || null,
      filters: {
        tech: ["All", ...new Set(projects.flatMap((p) => p.techStack))],
        skillCategories: ["All", ...new Set(skills.map((s) => s.category))],
      },
    });
  } catch (error) {
    next(error);
  }
};
