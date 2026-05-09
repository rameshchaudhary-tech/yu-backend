import ServiceBooking from "../models/ServiceBooking.js";
import { transporter } from "../utils/mailer.js";

/* =========================
   CREATE SERVICE BOOKING
========================= */
export const createServiceBooking = async(req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        const booking = await ServiceBooking.create({
            name,
            email,
            phone,
            service,
            message,
        });

        // EMAIL
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `🚀 New Service Booking: ${service}`,
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h2 style="color:#0d9488;">New Service Booking</h2>

                    <p><b>Name:</b> ${name}</p>
                    <p><b>Email:</b> ${email}</p>
                    <p><b>Phone:</b> ${phone}</p>
                    <p><b>Service:</b> ${service}</p>
                    <p><b>Message:</b> ${message || "N/A"}</p>
                </div>
            `,
        };

        transporter.sendMail(mailOptions).catch((err) => {
            console.log("Email Error:", err.message);
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });

    } catch (error) {
        console.error("CREATE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/* =========================
   GET ALL SERVICE BOOKINGS
========================= */
export const getServiceBookings = async(req, res) => {
    try {
        const bookings = await ServiceBooking.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings,
        });

    } catch (error) {
        console.error("GET ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/* =========================
   DELETE SERVICE BOOKING
========================= */
export const deleteServiceBooking = async(req, res) => {
    try {
        const { id } = req.params;

        const deletedBooking =
            await ServiceBooking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking deleted successfully",
        });

    } catch (error) {
        console.error("DELETE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};