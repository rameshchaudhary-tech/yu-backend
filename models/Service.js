import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is mandatory"],
        trim: true,
        unique: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true // Fast lookup ke liye indexing
    },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    popular: { type: Boolean, default: false },
    features: {
        type: [String],
        validate: [v => Array.isArray(v) && v.length > 0, "At least one feature is required"]
    }
}, { timestamps: true });

// Performance Optimization: Indexing popular services for home page/listing
serviceSchema.index({ popular: 1, createdAt: -1 });

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);