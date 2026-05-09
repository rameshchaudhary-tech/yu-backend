import CtaData from "../models/CtaData.js";

/**
 * @desc    Get CTA Section Content
 * @route   GET /api/cta
 * @access  Public
 */
export const getCtaContent = async(req, res) => {
    try {
        // Sirf active content uthayenge aur sabse latest wala
        const cta = await CtaData.findOne({ isActive: true }).sort({ createdAt: -1 });

        if (!cta) {
            return res.status(404).json({
                success: false,
                message: "CTA content not found"
            });
        }

        res.status(200).json({
            success: true,
            data: cta
        });
    } catch (error) {
        console.error("Error in getCtaContent:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

/**
 * @desc    Create or Update CTA Content
 * @route   POST /api/cta/upsert
 * @access  Private (Admin Only recommendation)
 */
export const upsertCtaContent = async(req, res) => {
    try {
        const {
            heading,
            highlightedText,
            subheading,
            subHighlightedText,
            stats,
            isActive
        } = req.body;

        // Validation: Basic check taaki empty data save na ho
        if (!heading || !subheading) {
            return res.status(400).json({
                success: false,
                message: "Heading and Subheading are required fields"
            });
        }

        // Upsert Logic: Ek hi document maintain karne ke liye {} use kiya hai
        // Agar aapko multiple CTA chahiye toh aap ID check laga sakte hain
        const updatedCta = await CtaData.findOneAndUpdate({}, {
            heading,
            highlightedText,
            subheading,
            subHighlightedText,
            stats,
            isActive
        }, {
            upsert: true,
            new: true,
            runValidators: true // Schema validation on update
        });

        res.status(200).json({
            success: true,
            message: "CTA content updated successfully",
            data: updatedCta
        });
    } catch (error) {
        console.error("Error in upsertCtaContent:", error.message);
        res.status(400).json({
            success: false,
            message: error.message || "Invalid Data Provided"
        });
    }
};