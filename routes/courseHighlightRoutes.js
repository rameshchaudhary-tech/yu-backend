import express from "express";
import {
    getCourseHighlights,
    getCourseBySlug,
    upsertCourseHighlight,
    deleteCourseHighlight,
    updateCourseHighlight
} from "../controllers/courseHighlightController.js";

import { verifyToken, isAdmin } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

// PUBLIC ROUTES
router.get("/", limiter, getCourseHighlights);
router.get("/detail/:slug", limiter, getCourseBySlug);

// ADMIN ROUTES
router.post(
    "/upsert",
    verifyToken,
    isAdmin,
    limiter,
    upsertCourseHighlight
);

router.put(
    "/update/:id",
    verifyToken,
    isAdmin,
    limiter,
    updateCourseHighlight
);

router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    limiter,
    deleteCourseHighlight
);

export default router;