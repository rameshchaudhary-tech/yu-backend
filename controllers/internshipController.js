import Internship from "../models/Internship.js";
import InternshipApplication from "../models/InternshipApplication.js";
import nodemailer from "nodemailer";
import mongoSanitize from "express-mongo-sanitize";

// ✅ 1. Admin: Data Insert karne ke liye (Postman ke liye)
export const createInternshipPosition = async(req, res) => {
    try {
        const sanitizedBody = mongoSanitize.sanitize(req.body);
        const newPosition = await Internship.create(sanitizedBody);

        res.status(201).json({ success: true, data: newPosition });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ✅ 2. Student: Application bhejane ke liye (React/Frontend ke liye)
export const submitInternshipApplication = async(req, res) => {
    try {
        const sanitizedBody = mongoSanitize.sanitize(req.body);
        const { fullName, email, phone, internshipProgram, experienceLevel, message } = sanitizedBody;

        await InternshipApplication.create({
            fullName,
            email,
            phone,
            internshipProgram,
            experienceLevel,
            message
        });

        // Response to frontend
        res.status(201).json({
            success: true,
            message: "Application submitted successfully! Our team will contact you soon."
        });

        // Background Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `🎓 New Internship Application: ${internshipProgram}`,
            html: `
                <div style="font-family: Arial, sans-serif; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px;">
                    <h2 style="color: #0ea5e9;">New Application Received</h2>
                    <p><strong>Candidate:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p style="font-size: 18px; color: #0ea5e9;"><strong>📞 Mobile No:</strong> ${phone}</p>
                    <p><strong>Applied For:</strong> ${internshipProgram}</p>
                    <p><strong>Experience:</strong> ${experienceLevel}</p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <strong>Message:</strong> ${message || "N/A"}
                    </div>
                </div>
            `,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) console.error("❌ Email Delivery Failed:", error.message);
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ✅ 3. Admin: Dashboard ke liye saari applications fetch karna
export const getInternships = async(req, res) => {
    try {
        const applications = await InternshipApplication.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ 4. Public: Frontend par Internship Programs (Cards) fetch karne ke liye
export const getInternshipPositions = async(req, res) => {
    try {
        const positions = await Internship.find().sort({ createdAt: -1 }).lean();
        res.status(200).json({ success: true, data: positions });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};