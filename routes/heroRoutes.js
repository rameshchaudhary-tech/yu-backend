import express from "express";
import rateLimit from "express-rate-limit";

import { getHeroData, updateHeroData } from "../controllers/heroController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

//   RATE LIMIT (ANTI SPAM)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests, try again later",
    },
});

//   PUBLIC ROUTE
router.get("/", apiLimiter, getHeroData);

//   ADMIN PROTECTED ROUTE
router.put(
    "/update",
    verifyToken, // JWT check
    isAdmin, // role check
    apiLimiter,
    updateHeroData
);

export default router;