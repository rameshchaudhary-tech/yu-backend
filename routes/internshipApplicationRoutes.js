
import express from "express";
import rateLimit from "express-rate-limit";

import {
    applyForInternship,
    getInternshipApplications,
    deleteInternshipApplication,
} from "../controllers/internshipApplicationController.js";

import {
    verifyToken,
    isAdmin,
} from "../middleware/auth.js";

const router = express.Router();

 //  RATE LIMITER
const applyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hour
    max: 10,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many applications from this IP. Please try again after an hour.",
    },
});

/* =========================
   APPLY FOR INTERNSHIP
   POST /api/internship/apply
========================= */
router.post(
    "/apply",
    applyLimiter,
    applyForInternship
);

/* =========================
   GET ALL APPLICATIONS
   GET /api/internship/all
========================= */
router.get(
    "/all",
    verifyToken,
    isAdmin,
    getInternshipApplications
);

/* =========================
   DELETE APPLICATION
   DELETE /api/internship/:id
========================= */
router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteInternshipApplication
);

export default router;