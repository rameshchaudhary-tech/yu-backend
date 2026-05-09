import express from "express";
import { getTestimonials, upsertTestimonial } from "../controllers/testimonialController.js";

const router = express.Router();

// GET all testimonials
router.get("/", getTestimonials);

// POST create or update testimonial
// Future mein yahan 'protect' aur 'admin' middleware add kar sakte hain
router.post("/upsert", upsertTestimonial);

// ✅ Default export add kiya taaki server.js ise recognize kar sake
export default router;