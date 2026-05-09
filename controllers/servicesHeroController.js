import ServicesHero from "../models/ServicesHero.js";
import mongoSanitize from "express-mongo-sanitize";

// @desc    Get Services Hero Data (Public)
// @route   GET /api/services-hero
export const getServicesHero = async(req, res) => {
    try {
        // ⚡ SPEED: Fetch plain JSON, bypassing Mongoose overhead
        const content = await ServicesHero.findOne().sort({ createdAt: -1 }).lean();

        if (!content) {
            return res.status(404).json({ success: false, message: "No content found" });
        }

        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Create or Update Services Hero (Admin Only)
// @route   POST /api/services-hero/upsert
export const upsertServicesHero = async(req, res) => {
    try {
        // 🛡️ SECURITY: Prevent NoSQL Injection attacks
        const sanitizedBody = mongoSanitize.sanitize(req.body);

        // ⚡ LOGIC: Upsert ensures only one document exists for the hero section
        const updatedHero = await ServicesHero.findOneAndUpdate({},
            sanitizedBody, { upsert: true, new: true, runValidators: true }
        ).lean();

        res.status(200).json({
            success: true,
            message: "Services Hero updated successfully",
            data: updatedHero
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};