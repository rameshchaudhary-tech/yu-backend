import express from "express";
import { getAllBlogs, createBlog } from "../controllers/blogController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const blogLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP"
});

router.get("/", blogLimiter, getAllBlogs);
router.post("/", createBlog);

export default router;