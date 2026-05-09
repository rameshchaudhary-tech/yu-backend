import express from "express";
import rateLimit from "express-rate-limit";

import { verifyToken, isAdmin } from "../middleware/auth.js";

import {
    getServiceBookings,
    deleteServiceBooking,
    createServiceBooking
} from "../controllers/serviceBookingController.js";

const router = express.Router();

/* ================= RATE LIMIT ================= */
const bookingLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many booking attempts. Please try again after 30 minutes."
    }
});

/* ================= ADMIN ONLY ================= */
router.get("/", verifyToken, isAdmin, getServiceBookings);
router.delete("/:id", verifyToken, isAdmin, deleteServiceBooking);

/* ================= PUBLIC BOOKING ================= */
router.post("/", bookingLimiter, createServiceBooking);

/* ================= EXPORT ================= */
export default router;