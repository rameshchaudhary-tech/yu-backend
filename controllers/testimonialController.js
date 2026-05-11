import Testimonial from "../models/Testimonial.js";

// Get all active testimonials
export const getTestimonials = async(req, res) => {
    try {
        // Get active reviews and sort them by order and createdAt
        const reviews = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Create/Update Testimonial 
export const upsertTestimonial = async(req, res) => {
    try {
        const { id, name, role, body, rating, order } = req.body;

        const testimonialData = { name, role, body, rating, order };

        if (id) {
            const updated = await Testimonial.findByIdAndUpdate(id, testimonialData, { new: true });
            return res.status(200).json({ success: true, data: updated });
        }

        const created = await Testimonial.create(testimonialData);
        res.status(201).json({ success: true, data: created });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};