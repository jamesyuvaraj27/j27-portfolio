import { Router } from "express";

import { getPostBySlug, listPublishedPosts } from "../controllers/blogController.js";
import { registerPlanInterest } from "../controllers/pricingController.js";
import { submitMessage } from "../controllers/messageController.js";
import { getPortfolioContent } from "../controllers/publicController.js";

const router = Router();

router.get("/content", getPortfolioContent);
router.get("/blog", listPublishedPosts);
router.get("/blog/:slug", getPostBySlug);
router.post("/messages", submitMessage);
router.post("/pricing/:id/interest", registerPlanInterest);

export default router;
