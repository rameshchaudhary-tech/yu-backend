import express from "express";
import { getCtaContent, upsertCtaContent } from "../controllers/ctaController.js";

const router = express.Router();

/**
 * @route   GET /api/cta
 * @desc    Fetch CTA content for frontend
 */
router.get("/", getCtaContent);

/**
 * @route   POST /api/cta/upsert
 * @desc    Create or Update CTA content (Admin Only)
 */
router.post("/upsert", upsertCtaContent);

export default router;