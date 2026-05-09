import mongoose from "mongoose";

const courseHighlightSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    iconName: { type: String, required: true },
    duration: { type: String, default: "3 Months" },
    isPopular: { type: Boolean, default: false },
    colorGradient: { type: String, required: true },
    bgImage: { type: String },
    subtitle: { type: String, default: "Master Professional Skills" },

    stats: [{
        label: String,
        value: String,
        iconName: String
    }],

    features: [String],

    technologies: [{
        name: String,
        icon: String
    }],

    syllabus: [String],

    careerOpportunities: [{
        title: String,
        description: String,
        iconName: String
    }],

    prerequisites: {
        type: String,
        default: "Basic knowledge of programming"
    }

}, { timestamps: true });

/* ✅ INDEX (ONLY WHAT NEEDED) */
courseHighlightSchema.index({ isPopular: 1 });

/* ✅ SAFE EXPORT (no duplicate model error) */
export default mongoose.models.CourseHighlight ||
    mongoose.model("CourseHighlight", courseHighlightSchema);