import { prisma } from "../config/db.js";
import { sanitizeEmail } from "../utils/auth.js";
import { sanitizeString } from "../utils/validation.js";
import { sendContactEmail } from "../utils/email.js";

export const submitMessage = async (req, res, next) => {
  try {
    const name = sanitizeString(req.body.name);
    const email = sanitizeEmail(req.body.email);
    const message = sanitizeString(req.body.message);
    const rating = Number(req.body.rating);

    if (!name || !email || message.length < 10) {
      return res.status(400).json({
        message: "Name, valid email, and a message with at least 10 characters are required.",
      });
    }

    const normalizedRating = Number.isFinite(rating) && rating >= 1 && rating <= 5 ? Math.round(rating) : null;

    const saved = await prisma.message.create({
      data: {
        name,
        email,
        message,
        rating: normalizedRating,
        subject: sanitizeString(req.body.subject),
        source: "contact",
      },
    });

    sendContactEmail({ name, email, subject: req.body.subject, message, rating: normalizedRating, source: "contact" }).catch(
      (error) => console.error("Contact email failed (message still saved):", error.message)
    );

    res.status(201).json({ message: "Message received. I will get back to you soon.", saved });
  } catch (error) {
    next(error);
  }
};

export const listMessages = async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    await prisma.message.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
