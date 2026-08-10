import { prisma } from "../config/db.js";
import { buildCrudController } from "../utils/crudFactory.js";
import { badRequest, parseNumber, sanitizeString } from "../utils/validation.js";

const buildPayload = (body) => {
  const title = sanitizeString(body.title);
  const description = sanitizeString(body.description);

  if (!title || !description) {
    throw badRequest("Service title and description are required.");
  }

  return {
    title,
    description,
    icon: sanitizeString(body.icon),
    order: parseNumber(body.order, { fallback: 0 }),
  };
};

export default buildCrudController({
  model: prisma.service,
  buildPayload,
  orderBy: { order: "asc" },
});
