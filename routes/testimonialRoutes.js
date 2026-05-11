import express from "express";
import { getTestimonials, upsertTestimonial } from "../controllers/testimonialController.js";

const router = express.Router();

// GET all testimonials
router.get("/", getTestimonials);

// POST: Create or update testimonial
// In the future, 'protect' and 'admin' middleware can be added here
router.post("/upsert", upsertTestimonial);

export default router;