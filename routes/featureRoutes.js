import express from "express";
import { getFeatures, updateFeatures } from "../controllers/featureController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Anti-spam limiter
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 50
});

// Public route to fetch data
router.get("/", limiter, getFeatures);

// Protected admin route to update data
router.put("/update", verifyToken, isAdmin, limiter, updateFeatures);

// CRITICAL: This line was missing or incorrect!
export default router;