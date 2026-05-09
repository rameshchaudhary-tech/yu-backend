import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: String, default: "3 Months" },
    skills: [{ type: String }],
    description: { type: String, required: true },
    icon: { type: String, default: "🚀" }
}, { timestamps: true });

const Internship = mongoose.models.Internship || mongoose.model("Internship", internshipSchema);
export default Internship;