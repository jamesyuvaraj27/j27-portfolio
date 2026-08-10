import { prisma } from "../config/db.js";
import { fileDetailsFromUpload, removeUploadedAsset } from "../middleware/uploadMiddleware.js";
import { badRequest, normalizeList, parseBoolean, parseNumber, sanitizeString, sanitizeUrl } from "../utils/validation.js";

const buildPayload = (body, file, userId) => {
  const title = sanitizeString(body.title);
  const description = sanitizeString(body.description);
  const techStack = normalizeList(body.techStack);

  if (!title || !description || techStack.length === 0) {
    throw badRequest("Project title, description, and tech stack are required.");
  }

  const payload = {
    title,
    description,
    techStack,
    features: normalizeList(body.features),
    githubLink: sanitizeUrl(body.githubLink),
    liveLink: sanitizeUrl(body.liveLink),
    featured: parseBoolean(body.featured),
    order: parseNumber(body.order, { fallback: 0 }),
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

export const listProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await prisma.project.create({ data: buildPayload(req.body, req.file, req.user?.id) });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const existing = await prisma.project.findUniqueOrThrow({ where: { id: req.params.id } });
    const data = buildPayload(req.body, req.file, existing.createdById);
    const project = await prisma.project.update({ where: { id: req.params.id }, data });

    if (req.file && existing.imagePublicId && existing.imagePublicId !== project.imagePublicId) {
      await removeUploadedAsset(existing.imagePublicId);
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await prisma.project.delete({ where: { id: req.params.id } });
    await removeUploadedAsset(project.imagePublicId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
