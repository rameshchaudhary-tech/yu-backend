// controllers/internshipApplicationController.js

import InternshipApplication from "../models/InternshipApplication.js";
import nodemailer from "nodemailer";
import mongoSanitize from "express-mongo-sanitize";

//  APPLY FOR INTERNSHIP
export const applyForInternship = async(req, res) => {
    try {
        // SANITIZE BODY
        const sanitizedBody = mongoSanitize.sanitize(req.body);

        const {
            fullName,
            email,
            phone,
            internshipProgram,
            experienceLevel,
            message,
        } = sanitizedBody;

        //   VALIDATION
        if (!fullName ||
            !email ||
            !phone ||
            !internshipProgram ||
            !experienceLevel
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are mandatory",
            });
        }

        //   SAVE TO DATABASE
        const application = await InternshipApplication.create({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            internshipProgram: internshipProgram.trim(),
            experienceLevel: experienceLevel.trim(),
            message: message ? .trim() || "",
        });

        //   SEND RESPONSE FAST
        res.status(201).json({
            success: true,
            message: "Application submitted successfully! Our team will contact you soon.",
            data: application,
        });

        //   EMAIL TRANSPORTER
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        //   EMAIL TEMPLATE
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `🎓 New Internship Alert: ${internshipProgram}`,

            html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin:auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">

          <div style="background: linear-gradient(to right, #2563eb, #0ea5e9); padding:20px; text-align:center; color:white;">
            <h2 style="margin:0;">New Internship Application</h2>
          </div>

          <div style="padding:25px; line-height:1.8; color:#374151;">

            <p>
              <strong>👤 Candidate Name:</strong>
              ${fullName}
            </p>

            <p>
              <strong>📧 Email Address:</strong>
              ${email}
            </p>

            <p>
              <strong>📞 Mobile Number:</strong>
              ${phone}
            </p>

            <p>
              <strong>💼 Internship Program:</strong>
              ${internshipProgram}
            </p>

            <p>
              <strong>🚀 Experience Level:</strong>
              ${experienceLevel}
            </p>

            <div style="margin-top:20px; background:#f9fafb; padding:15px; border-left:4px solid #2563eb; border-radius:8px;">
              <strong>📝 Message:</strong><br/><br/>
              ${message || "No message provided"}
            </div>

          </div>

          <div style="background:#f3f4f6; padding:12px; text-align:center; font-size:12px; color:#6b7280;">
            Received via YugAntar Technologies Internship Portal
          </div>

        </div>
      `,
        };

        //   SEND EMAIL IN BACKGROUND
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error(
                    "❌ Internship Mail Error:",
                    error.message
                );
            } else {
                console.log(
                    " Internship Application Email Sent"
                );
            }
        });

    } catch (error) {
        console.error(
            "❌ Internship Controller Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message || "Server Error",
        });
    }
};

// GET ALL APPLICATIONS
export const getInternshipApplications = async(
    req,
    res
) => {
    try {
        const applications =
            await InternshipApplication.find()
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });

    } catch (error) {
        console.error(
            "❌ GET APPLICATIONS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

//   DELETE APPLICATION
export const deleteInternshipApplication =
    async(req, res) => {
        try {
            const { id } = req.params;

            const deletedApplication =
                await InternshipApplication.findByIdAndDelete(
                    id
                );

            if (!deletedApplication) {
                return res.status(404).json({
                    success: false,
                    message: "Application not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Application deleted successfully",
            });

        } catch (error) {
            console.error(
                "❌ DELETE APPLICATION ERROR:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server Error",
            });
        }
    };