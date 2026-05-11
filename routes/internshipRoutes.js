import express from "express";
import {
    createInternshipPosition,
    submitInternshipApplication,
    getInternships,
    getInternshipPositions
} from "../controllers/internshipController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// limiter for apply
const applyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { message: "Too many applications, please try again later." }
});

router.get("/", getInternshipPositions);

// Admin: create internship
router.post("/create", createInternshipPosition);

// Student: apply
router.post("/apply", applyLimiter, submitInternshipApplication);

// Admin: all applications
router.get("/all", getInternships);

// Public: frontend cards
router.get("/positions", getInternshipPositions);

export default router;