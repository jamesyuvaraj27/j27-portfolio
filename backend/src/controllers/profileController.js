import { prisma } from "../config/db.js";
import { fileDetailsFromUpload, removeUploadedAsset } from "../middleware/uploadMiddleware.js";
import { normalizeList, sanitizeString } from "../utils/validation.js";

export const getProfile = async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { id: "profile" } });
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const body = req.body;

    const data = {};
    const stringFields = [
      "brand", "fullName", "role", "tagline", "valueProposition", "summary",
      "availability", "location", "email", "phone",
      "aboutIntro", "aboutJourney", "aboutFocus", "aboutMindset", "aboutGoals",
    ];

    for (const field of stringFields) {
      if (body[field] !== undefined) data[field] = sanitizeString(body[field]);
    }

    if (body.skillBadges !== undefined) data.skillBadges = normalizeList(body.skillBadges);
    if (body.strengths !== undefined) data.strengths = normalizeList(body.strengths);

    if (body.socialLinks !== undefined) {
      data.socialLinks = typeof body.socialLinks === "string" ? JSON.parse(body.socialLinks) : body.socialLinks;
    }

    if (req.file) {
      const details = fileDetailsFromUpload(req.file);
      const existing = await prisma.profile.findUnique({ where: { id: "profile" } });
      data.avatarUrl = details.url;
      data.avatarPublicId = details.publicId;
      if (existing?.avatarPublicId) {
        await removeUploadedAsset(existing.avatarPublicId);
      }
    }

    const profile = await prisma.profile.upsert({
      where: { id: "profile" },
      update: data,
      create: { id: "profile", ...data },
    });

    res.json(profile);
  } catch (error) {
    next(error);
  }
};
