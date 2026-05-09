import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^[0-9]{10}$/, "Phone number must be 10 digits"]
    },
    course: {
        type: String,
        required: [true, "Course name is required"]
    }
}, { timestamps: true });

export default mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);