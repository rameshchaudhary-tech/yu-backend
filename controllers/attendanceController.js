import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import mongoSanitize from "express-mongo-sanitize";

/* =========================
   MARK ATTENDANCE
========================= */
export const markAttendance = async(req, res) => {
    try {
        const sanitizedBody = mongoSanitize.sanitize(req.body);
        const { studentName, studentId, qrTimestamp } = sanitizedBody;

        // VALIDATION
        if (!studentName || !studentId || !qrTimestamp) {
            return res.status(400).json({
                success: false,
                message: "Invalid QR Data!"
            });
        }

        /* =========================
           STUDENT CHECK
        ========================= */
        const isRegistered = await Student.findOne({
            $or: [
                { email: studentId },
                { mobile: studentId }
            ]
        }).lean();

        if (!isRegistered) {
            return res.status(404).json({
                success: false,
                message: "Student is not registered! Please register first."
            });
        }

        /* =========================
           SAVE ATTENDANCE
        ========================= */
        const newRecord = await Attendance.create({
            studentName,
            studentId,
            qrTimestamp
        });

        return res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            data: newRecord
        });

    } catch (error) {
        console.error("MARK ATTENDANCE ERROR:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Attendance already marked for this session!"
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Server Error"
        });
    }
};

/* =========================
   GET ALL ATTENDANCE
========================= */
export const getAllAttendance = async(req, res) => {
    try {
        const records = await Attendance.find()
            .sort({ date: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: records
        });

    } catch (error) {
        console.error("GET ATTENDANCE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};