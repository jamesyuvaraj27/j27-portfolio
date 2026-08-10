import { Router } from "express";

import { requireAdmin } from "../middleware/authMiddleware.js";
import { certificateUpload, imageUpload, requireCloudinaryConfigured, resumeUpload } from "../middleware/uploadMiddleware.js";

import { getDashboardData } from "../controllers/dashboardController.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import serviceController from "../controllers/serviceController.js";
import { createProject, deleteProject, listProjects, updateProject } from "../controllers/projectController.js";
import skillController from "../controllers/skillController.js";
import educationController from "../controllers/educationController.js";
import experienceController from "../controllers/experienceController.js";
import { createCertification, deleteCertification, listCertifications, updateCertification } from "../controllers/certificationController.js";
import testimonialController from "../controllers/testimonialController.js";
import { createPhoto, deletePhoto, listPhotos, updatePhoto } from "../controllers/photoController.js";
import { createPost, deletePost, listAllPosts, updatePost } from "../controllers/blogController.js";
import { createPricingPlan, deletePricingPlan, listPricingPlans, updatePricingPlan } from "../controllers/pricingController.js";
import { deleteAsset, uploadLogo, uploadResume } from "../controllers/siteAssetController.js";
import { getTheme, listSections, updateSection, updateTheme } from "../controllers/themeController.js";
import { deleteMessage, listMessages } from "../controllers/messageController.js";

const router = Router();

router.use(requireAdmin);

router.get("/dashboard", getDashboardData);

// Profile
router.get("/profile", getProfile);
router.put("/profile", requireCloudinaryConfigured, imageUpload.single("avatar"), updateProfile);

// Services
router.get("/services", serviceController.list);
router.post("/services", serviceController.create);
router.put("/services/:id", serviceController.update);
router.delete("/services/:id", serviceController.remove);

// Projects
router.get("/projects", listProjects);
router.post("/projects", requireCloudinaryConfigured, imageUpload.single("image"), createProject);
router.put("/projects/:id", requireCloudinaryConfigured, imageUpload.single("image"), updateProject);
router.delete("/projects/:id", deleteProject);

// Skills
router.get("/skills", skillController.list);
router.post("/skills", skillController.create);
router.put("/skills/:id", skillController.update);
router.delete("/skills/:id", skillController.remove);

// Education
router.get("/education", educationController.list);
router.post("/education", educationController.create);
router.put("/education/:id", educationController.update);
router.delete("/education/:id", educationController.remove);

// Experience
router.get("/experience", experienceController.list);
router.post("/experience", experienceController.create);
router.put("/experience/:id", experienceController.update);
router.delete("/experience/:id", experienceController.remove);

// Certifications
router.get("/certifications", listCertifications);
router.post("/certifications", requireCloudinaryConfigured, certificateUpload.single("previewFile"), createCertification);
router.put("/certifications/:id", requireCloudinaryConfigured, certificateUpload.single("previewFile"), updateCertification);
router.delete("/certifications/:id", deleteCertification);

// Testimonials
router.get("/testimonials", testimonialController.list);
router.post("/testimonials", testimonialController.create);
router.put("/testimonials/:id", testimonialController.update);
router.delete("/testimonials/:id", testimonialController.remove);

// Gallery / Photos
router.get("/photos", listPhotos);
router.post("/photos", requireCloudinaryConfigured, imageUpload.single("image"), createPhoto);
router.put("/photos/:id", requireCloudinaryConfigured, imageUpload.single("image"), updatePhoto);
router.delete("/photos/:id", deletePhoto);

// Blog
router.get("/blog", listAllPosts);
router.post("/blog", requireCloudinaryConfigured, imageUpload.single("coverImage"), createPost);
router.put("/blog/:id", requireCloudinaryConfigured, imageUpload.single("coverImage"), updatePost);
router.delete("/blog/:id", deletePost);

// Pricing
router.get("/pricing", listPricingPlans);
router.post("/pricing", requireCloudinaryConfigured, imageUpload.single("image"), createPricingPlan);
router.put("/pricing/:id", requireCloudinaryConfigured, imageUpload.single("image"), updatePricingPlan);
router.delete("/pricing/:id", deletePricingPlan);

// Resume / Logo (site assets)
router.post("/resume", requireCloudinaryConfigured, resumeUpload.single("resume"), uploadResume);
router.delete("/resume", deleteAsset("resume", "auto"));
router.post("/logo", requireCloudinaryConfigured, imageUpload.single("logo"), uploadLogo);
router.delete("/logo", deleteAsset("logo", "image"));

// Theme + section toggles
router.get("/theme", getTheme);
router.put("/theme", updateTheme);
router.get("/sections", listSections);
router.put("/sections/:key", updateSection);

// Contact messages
router.get("/messages", listMessages);
router.delete("/messages/:id", deleteMessage);

export default router;
