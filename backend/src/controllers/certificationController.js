import { prisma } from "../config/db.js";
import { fileDetailsFromUpload, removeUploadedAsset } from "../middleware/uploadMiddleware.js";
import { badRequest, normalizeDate, sanitizeString, sanitizeUrl } from "../utils/validation.js";

const buildPayload = (body, file) => {
  const title = sanitizeString(body.title);
  const issuer = sanitizeString(body.issuer);

  if (!title || !issuer) {
    throw badRequest("Certificate title and issuer are required.");
  }

  const payload = {
    title,
    issuer,
    completionDate: normalizeDate(body.completionDate, "Completion date"),
    credentialLink: sanitizeUrl(body.credentialLink),
  };

  if (file) {
    const details = fileDetailsFromUpload(file);
    payload.previewFile = details.url;
    payload.previewPublicId = details.publicId;
  } else if (body.previewFile !== undefined) {
    payload.previewFile = sanitizeUrl(body.previewFile);
  }

  return payload;
};

export const listCertifications = async (req, res, next) => {
  try {
    const items = await prisma.certification.findMany({ orderBy: { completionDate: "desc" } });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const createCertification = async (req, res, next) => {
  try {
    const item = await prisma.certification.create({ data: buildPayload(req.body, req.file) });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateCertification = async (req, res, next) => {
  try {
    const existing = await prisma.certification.findUniqueOrThrow({ where: { id: req.params.id } });
    const item = await prisma.certification.update({ where: { id: req.params.id }, data: buildPayload(req.body, req.file) });

    if (req.file && existing.previewPublicId && existing.previewPublicId !== item.previewPublicId) {
      await removeUploadedAsset(existing.previewPublicId, "auto");
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req, res, next) => {
  try {
    const item = await prisma.certification.delete({ where: { id: req.params.id } });
    await removeUploadedAsset(item.previewPublicId, "auto");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
