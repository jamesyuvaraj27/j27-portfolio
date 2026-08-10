import { prisma } from "../config/db.js";

export const getDashboardData = async (req, res, next) => {
  try {
    const [
      projects,
      skills,
      education,
      experience,
      certifications,
      testimonials,
      messages,
      photos,
      pricingPlans,
      posts,
      services,
      resume,
      logo,
    ] = await Promise.all([
      prisma.project.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] }),
      prisma.skill.findMany({ orderBy: [{ category: "asc" }, { level: "desc" }] }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.experience.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.certification.findMany({ orderBy: { completionDate: "desc" } }),
      prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.photo.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }),
      prisma.pricingPlan.findMany({ orderBy: { order: "asc" } }),
      prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.service.findMany({ orderBy: { order: "asc" } }),
      prisma.siteAsset.findUnique({ where: { key: "resume" } }),
      prisma.siteAsset.findUnique({ where: { key: "logo" } }),
    ]);

    res.json({
      projects,
      skills,
      education,
      experience,
      certifications,
      testimonials,
      messages,
      photos,
      pricingPlans,
      posts,
      services,
      resume: resume || null,
      logo: logo || null,
      stats: {
        projectCount: projects.length,
        skillCount: skills.length,
        certificationCount: certifications.length,
        testimonialCount: testimonials.length,
        messageCount: messages.length,
        photoCount: photos.length,
        pricingPlanCount: pricingPlans.length,
        postCount: posts.length,
        publishedPostCount: posts.filter((p) => p.published).length,
      },
    });
  } catch (error) {
    next(error);
  }
};
