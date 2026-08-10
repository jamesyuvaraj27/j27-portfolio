import { prisma } from "../config/db.js";
import { sanitizeString } from "../utils/validation.js";

export const getTheme = async (req, res, next) => {
  try {
    const theme = await prisma.themeSettings.findUnique({ where: { id: "theme" } });
    res.json(theme);
  } catch (error) {
    next(error);
  }
};

export const updateTheme = async (req, res, next) => {
  try {
    const fields = ["primaryColor", "accentColor", "backgroundColor", "fontHeading", "fontBody", "radius"];
    const data = {};
    for (const field of fields) {
      if (req.body[field] !== undefined) data[field] = sanitizeString(req.body[field]);
    }

    const theme = await prisma.themeSettings.upsert({
      where: { id: "theme" },
      update: data,
      create: { id: "theme", ...data },
    });

    res.json(theme);
  } catch (error) {
    next(error);
  }
};

export const listSections = async (req, res, next) => {
  try {
    const sections = await prisma.sectionConfig.findMany({ orderBy: { order: "asc" } });
    res.json(sections);
  } catch (error) {
    next(error);
  }
};

export const updateSection = async (req, res, next) => {
  try {
    const data = {};
    if (req.body.enabled !== undefined) data.enabled = Boolean(req.body.enabled);
    if (req.body.order !== undefined) data.order = Number(req.body.order);
    if (req.body.label !== undefined) data.label = sanitizeString(req.body.label);

    const section = await prisma.sectionConfig.update({ where: { key: req.params.key }, data });
    res.json(section);
  } catch (error) {
    next(error);
  }
};
