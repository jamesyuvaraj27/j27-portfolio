import slugify from "slugify";

import { prisma } from "../config/db.js";
import { fileDetailsFromUpload, removeUploadedAsset } from "../middleware/uploadMiddleware.js";
import { badRequest, normalizeList, parseBoolean, sanitizeString, sanitizeUrl } from "../utils/validation.js";

const buildSlug = async (title, existingId) => {
  const base = slugify(title, { lower: true, strict: true }).slice(0, 80) || "post";
  let slug = base;
  let counter = 1;

  while (true) {
    const conflict = await prisma.blogPost.findUnique({ where: { slug } });
    if (!conflict || conflict.id === existingId) break;
    slug = `${base}-${counter++}`;
  }

  return slug;
};

const buildPayload = async (body, file, userId, existingId) => {
  const title = sanitizeString(body.title);
  const content = sanitizeString(body.content);

  if (!title || !content) {
    throw badRequest("Blog title and content are required.");
  }

  const published = parseBoolean(body.published);

  const payload = {
    title,
    content,
    excerpt: sanitizeString(body.excerpt) || content.slice(0, 160),
    tags: normalizeList(body.tags),
    published,
    publishedAt: published ? new Date() : null,
    slug: await buildSlug(title, existingId),
  };

  if (file) {
    const details = fileDetailsFromUpload(file);
    payload.coverImage = details.url;
    payload.coverPublicId = details.publicId;
  } else if (body.coverImage !== undefined) {
    payload.coverImage = sanitizeUrl(body.coverImage);
  }

  if (userId) {
    payload.authorId = userId;
  }

  return payload;
};

export const listPublishedPosts = async (req, res, next) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const listAllPosts = async (req, res, next) => {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await prisma.blogPost.findFirst({ where: { slug: req.params.slug, published: true } });
    if (!post) return res.status(404).json({ message: "Post not found." });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const data = await buildPayload(req.body, req.file, req.user?.id, null);
    const post = await prisma.blogPost.create({ data });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const existing = await prisma.blogPost.findUniqueOrThrow({ where: { id: req.params.id } });
    const data = await buildPayload(req.body, req.file, existing.authorId, existing.id);
    const post = await prisma.blogPost.update({ where: { id: req.params.id }, data });

    if (req.file && existing.coverPublicId && existing.coverPublicId !== post.coverPublicId) {
      await removeUploadedAsset(existing.coverPublicId);
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await prisma.blogPost.delete({ where: { id: req.params.id } });
    await removeUploadedAsset(post.coverPublicId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
