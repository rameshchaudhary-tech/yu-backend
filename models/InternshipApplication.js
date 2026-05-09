import mongoose from "mongoose";

const internshipApplicationSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    internshipProgram: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.models.InternshipApplication || mongoose.model("InternshipApplication", internshipApplicationSchema);