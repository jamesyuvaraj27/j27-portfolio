import { prisma } from "../config/db.js";
import { buildCrudController } from "../utils/crudFactory.js";
import { badRequest, parseNumber, sanitizeString } from "../utils/validation.js";

const buildPayload = (body) => {
  const name = sanitizeString(body.name);
  const role = sanitizeString(body.role);
  const message = sanitizeString(body.message);

  if (!name || !role || !message) {
    throw badRequest("Testimonial name, role, and message are required.");
  }

  return {
    name,
    role,
    message,
    rating: parseNumber(body.rating, { min: 1, max: 5, fallback: 5 }),
    avatar: sanitizeString(body.avatar),
  };
};

export default buildCrudController({
  model: prisma.testimonial,
  buildPayload,
});
