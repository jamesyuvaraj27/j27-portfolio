import { prisma } from "../config/db.js";
import { buildCrudController } from "../utils/crudFactory.js";
import { badRequest, parseNumber, sanitizeString } from "../utils/validation.js";

const buildPayload = (body) => {
  const degree = sanitizeString(body.degree);
  const institution = sanitizeString(body.institution);
  const duration = sanitizeString(body.duration);

  if (!degree || !institution || !duration) {
    throw badRequest("Degree, institution, and duration are required.");
  }

  return {
    degree,
    institution,
    duration,
    description: sanitizeString(body.description),
    order: parseNumber(body.order, { fallback: 0 }),
  };
};

export default buildCrudController({
  model: prisma.education,
  buildPayload,
  orderBy: { order: "asc" },
});
