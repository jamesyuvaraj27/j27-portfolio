// Simple in-memory rate limiter (no external dependency required).
// Good enough for a single-instance deploy; swap for Upstash/Redis if you scale to multiple instances.

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 120;

const hits = new Map();

const rateLimiter = (req, res, next) => {
  const key = req.ip || "unknown";
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(key, { start: now, count: 1 });
    return next();
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    return res.status(429).json({ message: "Too many requests. Please slow down." });
  }

  next();
};

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits.entries()) {
    if (now - entry.start > WINDOW_MS) {
      hits.delete(key);
    }
  }
}, WINDOW_MS).unref?.();

export default rateLimiter;
