import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    type: { type: String, required: true },

    address: {
        city: { type: String, required: true },
        state: { type: String, required: true },
    },

    collegeName: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    currentSemester: { type: String, required: true },
    passingYear: { type: String, required: true },
    cgpa: { type: Number, required: true },

    internshipType: { type: String, required: true },
    internshipDuration: { type: String, required: true },
    preferredStartDate: { type: Date, required: true },
    mode: { type: String, required: true },

    status: { type: String, default: "Pending" },

    qrCode: { type: String },
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

export default Student;