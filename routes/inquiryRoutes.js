import express from "express";
import {
    createInquiry,
    getAllInquiries,
    deleteInquiry
} from "../controllers/inquiryController.js";

import { verifyToken, isAdmin } from "../middleware/auth.js";
const router = express.Router();

/* PUBLIC */
router.post("/", createInquiry);

/* ADMIN */
router.get("/", verifyToken, isAdmin, getAllInquiries);
router.delete("/:id", verifyToken, isAdmin, deleteInquiry);

export default router;