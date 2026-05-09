import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    studentName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, trim: true }, // Ye Registered Mobile ya Email hoga
    qrTimestamp: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

// 🚀 SPEED & SECURITY: Ek student ek timestamp par dobara scan nahi kar payega
attendanceSchema.index({ studentId: 1, qrTimestamp: 1 }, { unique: true });
attendanceSchema.index({ date: -1 });

export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);