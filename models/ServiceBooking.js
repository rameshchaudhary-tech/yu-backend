import mongoose from "mongoose";

const serviceBookingSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    service: { type: String, required: true }, // Locked service name
    message: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.models.ServiceBooking || mongoose.model("ServiceBooking", serviceBookingSchema);