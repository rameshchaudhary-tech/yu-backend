import Blog from "../models/Blog.js";
import mongoSanitize from "express-mongo-sanitize";

// Utility function to calculate reading time
const calculateReadTime = (text) => {
    const wordsPerMinute = 200; // Average speed
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return `${time} min read`;
};

export const createBlog = async(req, res) => {
    try {
        const sanitizedBody = mongoSanitize.sanitize(req.body);
        const { title, description, category, slug, color } = sanitizedBody;

        // Automated & Real-time Calculation
        const autoReadTime = calculateReadTime(description);
        // create and save blog in database
        const newBlog = await Blog.create({
            title,
            description,
            category,
            slug,
            color,
            readTime: autoReadTime
        });

        res.status(201).json({ success: true, data: newBlog });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAllBlogs = async(req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, data: blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};