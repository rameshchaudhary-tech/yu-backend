import express from "express";
import { loginAdmin, createAdmin } from "../controllers/authController.js";

const router = express.Router();

// Admin create (use only once)
router.post("/create-admin", createAdmin);

// Admin login
router.post("/login", loginAdmin);

export default router;