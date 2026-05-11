import mongoose from "mongoose";

const ctaSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        trim: true
    },
    highlightedText: {
        type: String,
        trim: true
    },
    subheading: {
        type: String,
        required: true,
        trim: true
    },
    subHighlightedText: {
        type: String,
        trim: true
    },
    stats: [{
        label: { type: String, required: true },
        value: { type: String, required: true }
    }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("CtaData", ctaSchema);