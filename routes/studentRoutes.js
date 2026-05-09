// routes/studentRoutes.js

import express from "express";
import rateLimit from "express-rate-limit";

import {
    registerStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

/* =========================
   RATE LIMITER
========================= */
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30,
    message: {
        success: false,
        message: "Too many registrations. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/* =========================
   ROUTES
========================= */

// REGISTER STUDENT
// POST /api/students
router.post("/", registerLimiter, registerStudent);

// GET ALL STUDENTS
// GET /api/students
router.get("/", getAllStudents);

// GET SINGLE STUDENT
// GET /api/students/:id
router.get("/:id", getStudentById);

// UPDATE STUDENT
// PUT /api/students/:id
router.put("/:id", updateStudent);

// DELETE STUDENT
// DELETE /api/students/:id
router.delete("/:id", deleteStudent);

export default router;