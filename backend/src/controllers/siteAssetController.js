import { prisma } from "../config/db.js";
import { fileDetailsFromUpload, removeUploadedAsset } from "../middleware/uploadMiddleware.js";
import { badRequest } from "../utils/validation.js";

const upsertAsset = async (key, file, resourceType = "image") => {
  if (!file) throw badRequest(`A file is required to update the ${key}.`);

  const existing = await prisma.siteAsset.findUnique({ where: { key } });
  const details = fileDetailsFromUpload(file);

  const asset = await prisma.siteAsset.upsert({
    where: { key },
    update: { url: details.url, publicId: details.publicId, originalName: details.originalName, mimeType: details.mimeType, size: details.size, uploadedAt: new Date() },
    create: { key, url: details.url, publicId: details.publicId, originalName: details.originalName, mimeType: details.mimeType, size: details.size },
  });

  if (existing?.publicId && existing.publicId !== asset.publicId) {
    await removeUploadedAsset(existing.publicId, resourceType);
  }

  return asset;
};

export const uploadResume = async (req, res, next) => {
  try {
    const resume = await upsertAsset("resume", req.file, "auto");
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

export const uploadLogo = async (req, res, next) => {
  try {
    const logo = await upsertAsset("logo", req.file, "image");
    res.status(201).json(logo);
  } catch (error) {
    next(error);
  }
};

export const deleteAsset = (key, resourceType = "image") => async (req, res, next) => {
  try {
    const existing = await prisma.siteAsset.findUnique({ where: { key } });
    if (existing?.publicId) {
      await removeUploadedAsset(existing.publicId, resourceType);
    }
    await prisma.siteAsset.deleteMany({ where: { key } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
