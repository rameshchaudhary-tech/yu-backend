import mongoose from "mongoose";

// Define the Schema for the Features section
const featureSchema = new mongoose.Schema({
    welcomeText: {
        type: String,
        trim: true,
        default: "Excellence in Education"
    },
    mainHeading: {
        type: String,
        required: [true, "Main heading is required"],
        trim: true
    },
    highlightedText: {
        type: String,
        required: [true, "Highlighted text is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    featuresList: [{
        title: { type: String, required: true, trim: true },
        desc: { type: String, required: true, trim: true },
        icon: { type: String, required: true },
        color: { type: String, required: true }
    }]
}, { timestamps: true });

export default mongoose.model("Feature", featureSchema);