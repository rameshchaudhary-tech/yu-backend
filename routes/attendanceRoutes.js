import express from "express";
import rateLimit from "express-rate-limit";
import {
    markAttendance,
    getAllAttendance
} from "../controllers/attendanceController.js";

const router = express.Router();

/* =========================
   RATE LIMIT (QR SCAN PROTECTION)
========================= */
const scanLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // max 10 requests per minute
    message: {
        success: false,
        message: "Too many scan attempts! Please try again later."
    }
});

/* =========================
   ROUTES
========================= */

// MARK ATTENDANCE (QR SCAN)
router.post("/create", scanLimiter, markAttendance);

// GET ALL ATTENDANCE RECORDS
router.get("/all", getAllAttendance);

export default router;