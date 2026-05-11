import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

testimonialSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model("Testimonial", testimonialSchema);