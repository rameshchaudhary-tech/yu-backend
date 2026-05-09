import express from "express";
import { getServicesHero, upsertServicesHero } from "../controllers/servicesHeroController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// 🚫 Rate Limiter: Ek IP se 15 min mein 50 requests max
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many requests, please try again later"
});

// GET: Publicly accessible but rate-limited
router.get("/", limiter, getServicesHero);

// POST: Admin only and rate-limited
router.post("/upsert", verifyToken, isAdmin, limiter, upsertServicesHero);

export default router;