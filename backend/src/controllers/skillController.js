import { prisma } from "../config/db.js";
import { buildCrudController } from "../utils/crudFactory.js";
import { badRequest, parseNumber, sanitizeString } from "../utils/validation.js";

const buildPayload = (body) => {
  const name = sanitizeString(body.name);
  const category = sanitizeString(body.category);

  if (!name || !category) {
    throw badRequest("Skill name and category are required.");
  }

  return {
    name,
    category,
    level: parseNumber(body.level, { min: 1, max: 100, fallback: 50 }),
  };
};

export default buildCrudController({
  model: prisma.skill,
  buildPayload,
  orderBy: [{ category: "asc" }, { level: "desc" }],
});
