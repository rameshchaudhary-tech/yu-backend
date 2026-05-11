import express from "express";
import rateLimit from "express-rate-limit";

import {
    getServices,
    createService,
    updateService,
    deleteService,
    upsertService
} from "../controllers/serviceController.js";

import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// RATE LIMIT 
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});

// PUBLIC 
router.get("/", apiLimiter, getServices);

// ADMIN CRUD 
router.post("/", verifyToken, isAdmin, createService);

router.put("/:id", verifyToken, isAdmin, updateService);

router.delete("/:id", verifyToken, isAdmin, deleteService);

// UPSERT (DO NOT TOUCH) 
router.post("/upsert", verifyToken, isAdmin, upsertService);

export default router;