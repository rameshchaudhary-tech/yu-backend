import Student from "../models/Student.js";
import Service from "../models/Service.js";
import Blog from "../models/Blog.js";
import Attendance from "../models/Attendance.js";
import CourseHighlight from "../models/CourseHighlights.js";
/* =========================
   DASHBOARD ANALYTICS
   GET /api/analytics/stats
========================= */
export const getDashboardStats = async(req, res) => {
    try {
        const [
            students,
            services,
            blogs,
            attendance,
            courses
        ] = await Promise.all([
            Student.countDocuments(),
            Service.countDocuments(),
            Blog.countDocuments(),
            Attendance.countDocuments(),
            CourseHighlight.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: {
                students,
                services,
                blogs,
                attendance,
                courses
            }
        });

    } catch (err) {
        console.error("ANALYTICS ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message || "Server Error"
        });
    }
};