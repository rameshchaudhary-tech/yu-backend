// controllers/studentController.js

import Student from "../models/Student.js";
import mongoSanitize from "express-mongo-sanitize";
import QRCode from "qrcode";

/* =========================
   REGISTER STUDENT
========================= */
export const registerStudent = async(req, res) => {
    try {
        // SANITIZE BODY
        const sanitizedBody = mongoSanitize.sanitize(req.body);

        /* =========================
           VALIDATION
        ========================= */
        if (!sanitizedBody.name ||
            !sanitizedBody.email ||
            !sanitizedBody.mobile
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        /* =========================
           CREATE STUDENT
        ========================= */
        const newStudent = await Student.create({
            ...sanitizedBody,
            name: sanitizedBody.name.trim(),
            email: sanitizedBody.email.toLowerCase().trim(),
            mobile: sanitizedBody.mobile.trim(),
        });

        /* =========================
           QR DATA
        ========================= */
        const qrData = JSON.stringify({
            studentId: newStudent._id,
            name: newStudent.name,
            email: newStudent.email,
            mobile: newStudent.mobile,
            course: newStudent.course,
        });

        /* =========================
           GENERATE QR CODE
        ========================= */
        const qrCodeImage = await QRCode.toDataURL(qrData);

        /* =========================
           SAVE QR CODE
        ========================= */
        newStudent.qrCode = qrCodeImage;

        await newStudent.save();

        /* =========================
           RESPONSE
        ========================= */
        res.status(201).json({
            success: true,
            message: "Registration Successful!",
            data: newStudent,
            qrCode: qrCodeImage,
            studentId: newStudent._id,
        });

    } catch (error) {
        console.log("❌ REGISTER STUDENT ERROR:", error);

        /* =========================
           DUPLICATE KEY ERROR
        ========================= */
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(400).json({
                success: false,
                message: `${field} already exists`,
            });
        }

        /* =========================
           SERVER ERROR
        ========================= */
        res.status(500).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
};

/* =========================
   GET ALL STUDENTS
========================= */
export const getAllStudents = async(req, res) => {
    try {
        const students = await Student.find().sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });

    } catch (error) {
        console.log("❌ GET STUDENTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/* =========================
   GET SINGLE STUDENT
========================= */
export const getStudentById = async(req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            data: student,
        });

    } catch (error) {
        console.log("❌ GET STUDENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/* =========================
   UPDATE STUDENT
========================= */
export const updateStudent = async(req, res) => {
    try {
        const { id } = req.params;

        const sanitizedBody = mongoSanitize.sanitize(req.body);

        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            sanitizedBody, {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: updatedStudent,
        });

    } catch (error) {
        console.log("❌ UPDATE STUDENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/* =========================
   DELETE STUDENT
========================= */
export const deleteStudent = async(req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent =
            await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });

    } catch (error) {
        console.log("❌ DELETE STUDENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};