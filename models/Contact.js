import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Unread" }
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model("Contact", contactSchema);