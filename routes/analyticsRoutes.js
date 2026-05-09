import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import { getDashboardStats } from "../controllers/analyticsController.js";

const router = express.Router();

/* =========================
   ADMIN DASHBOARD STATS
   GET /api/analytics/stats
========================= */
router.get("/stats", verifyToken, isAdmin, getDashboardStats);

export default router;