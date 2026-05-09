import Inquiry from "../models/Inquiry.js";
import nodemailer from "nodemailer";

/* =========================
   CREATE INQUIRY
========================= */
export const createInquiry = async(req, res) => {
    try {
        const { name, email, phone, course } = req.body;

        if (!name || !email || !phone || !course) {
            return res.status(400).json({
                success: false,
                message: "All fields required",
            });
        }

        const cleanPhone = phone.trim();

        const recent = await Inquiry.findOne({
            phone: cleanPhone,
            createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) },
        });

        if (recent) {
            return res.status(429).json({
                success: false,
                message: "Too many requests",
            });
        }

        const newInquiry = await Inquiry.create({
            name: name.trim(),
            email: email.trim(),
            phone: cleanPhone,
            course: course.trim(),
        });

        res.status(200).json({
            success: true,
            message: "Submitted successfully",
            id: newInquiry._id,
        });

        // EMAIL (async)
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Inquiry - ${course}`,
            html: `<p>${name} - ${phone}</p>`,
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* =========================
   GET ALL INQUIRIES (FIXED)
========================= */
export const getAllInquiries = async(req, res) => {
    try {
        const data = await Inquiry.find().sort({ createdAt: -1 });

        return res.json({
            success: true,
            data,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/* =========================
   DELETE INQUIRY
========================= */
export const deleteInquiry = async(req, res) => {
    try {
        await Inquiry.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Deleted successfully",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};