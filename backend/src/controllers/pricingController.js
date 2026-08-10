import { prisma } from "../config/db.js";
import { fileDetailsFromUpload, removeUploadedAsset } from "../middleware/uploadMiddleware.js";
import { badRequest, normalizeList, parseBoolean, parseNumber, sanitizeString, sanitizeUrl } from "../utils/validation.js";

const CTA_TYPES = ["SUBSCRIBE", "CONTACT", "EXTERNAL_LINK"];

const buildPayload = (body, file, userId) => {
  const name = sanitizeString(body.name);
  const price = sanitizeString(body.price);

  if (!name || !price) {
    throw badRequest("Plan name and price are required.");
  }

  const ctaType = CTA_TYPES.includes(body.ctaType) ? body.ctaType : "SUBSCRIBE";

  const payload = {
    name,
    price,
    billingPeriod: sanitizeString(body.billingPeriod) || "one-time",
    description: sanitizeString(body.description),
    features: normalizeList(body.features),
    highlighted: parseBoolean(body.highlighted),
    ctaLabel: sanitizeString(body.ctaLabel) || "Subscribe",
    ctaType,
    // Real checkout URL/provider gets plugged in here later (Stripe/Razorpay link etc).
    // Until then this stays empty and the frontend routes the click to the contact/lead flow.
    ctaUrl: sanitizeUrl(body.ctaUrl),
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

export const listPricingPlans = async (req, res, next) => {
  try {
    const plans = await prisma.pricingPlan.findMany({ orderBy: { order: "asc" } });
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

export const createPricingPlan = async (req, res, next) => {
  try {
    const plan = await prisma.pricingPlan.create({ data: buildPayload(req.body, req.file, req.user?.id) });
    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
};

export const updatePricingPlan = async (req, res, next) => {
  try {
    const existing = await prisma.pricingPlan.findUniqueOrThrow({ where: { id: req.params.id } });
    const plan = await prisma.pricingPlan.update({
      where: { id: req.params.id },
      data: buildPayload(req.body, req.file, existing.createdById),
    });

    if (req.file && existing.imagePublicId && existing.imagePublicId !== plan.imagePublicId) {
      await removeUploadedAsset(existing.imagePublicId);
    }

    res.json(plan);
  } catch (error) {
    next(error);
  }
};

export const deletePricingPlan = async (req, res, next) => {
  try {
    const plan = await prisma.pricingPlan.delete({ where: { id: req.params.id } });
    await removeUploadedAsset(plan.imagePublicId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Called when a visitor clicks "Subscribe" on a plan and no payment provider is
// wired up yet — captures it as a lead in Message so you don't lose the interest.
export const registerPlanInterest = async (req, res, next) => {
  try {
    const plan = await prisma.pricingPlan.findUnique({ where: { id: req.params.id } });
    if (!plan) return res.status(404).json({ message: "Plan not found." });

    const name = sanitizeString(req.body.name);
    const email = sanitizeString(req.body.email);

    if (!name || !email) {
      throw badRequest("Name and email are required to register interest.");
    }

    const lead = await prisma.message.create({
      data: {
        name,
        email,
        subject: `Interested in ${plan.name}`,
        message: sanitizeString(req.body.message) || `Interested in the ${plan.name} plan (${plan.price}).`,
        source: `pricing:${plan.id}`,
      },
    });

    res.status(201).json({ message: "Thanks — we'll be in touch about this plan soon.", lead });
  } catch (error) {
    next(error);
  }
};
