import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import rateLimit from "express-rate-limit";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   RATE LIMIT (ANTI ABUSE)
========================= */
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // only 20 uploads per 15 min
  message: {
    success: false,
    message: "Too many uploads, try later",
  },
});

/* =========================
   FILE VALIDATION
========================= */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, WEBP allowed"), false);
  }

  cb(null, true);
};

/* =========================
   SECURE UPLOAD ROUTE
========================= */
router.post(
  "/image",
  verifyToken,     // 🔐 login required
  isAdmin,         // 👑 admin only
  uploadLimiter,   // 🚫 rate limit
  upload.single("image"),
  async (req, res) => {
    try {
      /* =========================
         VALIDATION CHECKS
      ========================= */
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      /* =========================
         SIZE CHECK (5MB LIMIT)
      ========================= */
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "File too large (max 5MB)",
        });
      }

      /* =========================
         CLOUDINARY UPLOAD
      ========================= */
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "hero-images",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );

          stream.end(buffer);
        });

      const result = await streamUpload(req.file.buffer);

      /* =========================
         RESPONSE
      ========================= */
      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        url: result.secure_url,
        public_id: result.public_id,
      });

    } catch (err) {
      console.error("Upload Error:", err);

      return res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }
  }
);

export default router;