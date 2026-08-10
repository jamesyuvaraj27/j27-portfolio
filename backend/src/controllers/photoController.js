import { prisma } from "../config/db.js";
import { fileDetailsFromUpload, removeUploadedAsset } from "../middleware/uploadMiddleware.js";
import { badRequest, parseBoolean, sanitizeString, sanitizeUrl } from "../utils/validation.js";

const buildPayload = (body, file, userId) => {
  const title = sanitizeString(body.title);

  if (!title) {
    throw badRequest("Photo title is required.");
  }

  const payload = {
    title,
    description: sanitizeString(body.description),
    alt: sanitizeString(body.alt) || title,
    featured: parseBoolean(body.featured),
  };

  if (file) {
    const details = fileDetailsFromUpload(file);
    payload.image = details.url;
    payload.imagePublicId = details.publicId;
  } else if (body.image !== undefined) {
    payload.image = sanitizeUrl(body.image);
  }

  if (userId) {
    payload.createdById = userId;
  }

  return payload;
};

export const listPhotos = async (req, res, next) => {
  try {
    const photos = await prisma.photo.findMany({ orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });
    res.json(photos);
  } catch (error) {
    next(error);
  }
};

export const createPhoto = async (req, res, next) => {
  try {
    if (!req.file && !req.body.image) {
      throw badRequest("A photo image is required.");
    }
    const photo = await prisma.photo.create({ data: buildPayload(req.body, req.file, req.user?.id) });
    res.status(201).json(photo);
  } catch (error) {
    next(error);
  }
};

export const updatePhoto = async (req, res, next) => {
  try {
    const existing = await prisma.photo.findUniqueOrThrow({ where: { id: req.params.id } });
    const photo = await prisma.photo.update({
      where: { id: req.params.id },
      data: buildPayload(req.body, req.file, existing.createdById),
    });

    if (req.file && existing.imagePublicId && existing.imagePublicId !== photo.imagePublicId) {
      await removeUploadedAsset(existing.imagePublicId);
    }

    res.json(photo);
  } catch (error) {
    next(error);
  }
};

export const deletePhoto = async (req, res, next) => {
  try {
    const photo = await prisma.photo.delete({ where: { id: req.params.id } });
    await removeUploadedAsset(photo.imagePublicId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
