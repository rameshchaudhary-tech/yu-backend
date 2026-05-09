import express from "express";
import { submitContact, getAllContacts } from "../controllers/contactController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests. Try later." }
});

// contact submit
router.post("/", limiter, submitContact);

// admin get contacts
router.get("/", getAllContacts);

export default router;