import dotenv from "dotenv";
dotenv.config(); // MUST be FIRST

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

/* =========================
   DB
========================= */
import connectDB from "./config/db.js";

/* =========================
   ROUTES
========================= */
import authRoutes from "./routes/authRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import featureRoutes from "./routes/featureRoutes.js";
import courseHighlightRoutes from "./routes/courseHighlightRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import ctaRoutes from "./routes/ctaRoutes.js";
import servicesHeroRoutes from "./routes/servicesHeroRoutes.js";
import serviceBookingRoutes from "./routes/serviceBookingRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

/* =========================
   DB CONNECT
========================= */
connectDB();

/* =========================
   ENV DEBUG
========================= */
console.log("ENV CHECK:", {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS ? "OK" : "MISSING",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
});

/* =========================
   SECURITY
========================= */
app.set("trust proxy", 1);

app.use(helmet());

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://yuganter-frontend.vercel.app"
    ],
    credentials: true,
}));
app.use(compression());
app.use(mongoSanitize());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =========================
   LOGGING
========================= */
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    next();
});

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "OK",
        time: new Date(),
    });
});

/* =========================
   RATE LIMIT
========================= */
app.use(
    "/api",
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        message: {
            success: false,
            message: "Too many requests. Please try again later.",
        },
    })
);

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/course-highlights", courseHighlightRoutes);
app.use("/api/services-hero", servicesHeroRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-bookings", serviceBookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/course-inquiries", inquiryRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/cta", ctaRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/internship", internshipRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendances", attendanceRoutes);

/* 🔥 FIXED ANALYTICS ROUTE */
app.use("/api/analytics", analyticsRoutes);
/* =========================
   404 ROUTE
========================= */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});