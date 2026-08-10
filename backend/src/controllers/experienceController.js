import { prisma } from "../config/db.js";
import { buildCrudController } from "../utils/crudFactory.js";
import { badRequest, normalizeList, sanitizeString } from "../utils/validation.js";

const buildPayload = (body) => {
  const title = sanitizeString(body.title);
  const company = sanitizeString(body.company);
  const duration = sanitizeString(body.duration);
  const description = sanitizeString(body.description);

  if (!title || !company || !duration || !description) {
    throw badRequest("All experience fields are required.");
  }

  return {
    title,
    company,
    duration,
    description,
    achievements: normalizeList(body.achievements),
  };
};

export default buildCrudController({
  model: prisma.experience,
  buildPayload,
});
