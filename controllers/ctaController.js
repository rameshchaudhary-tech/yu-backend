import CtaData from "../models/CtaData.js";


export const getCtaContent = async(req, res) => {
    try {
        // Fetch only active content and the latest one 
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

        if (!heading || !subheading) {
            return res.status(400).json({
                success: false,
                message: "Heading and Subheading are required fields"
            });
        }

        // Upsert logic: ensures only one document is maintained in the collection using {}
        // If you want multiple CTA entries, you can use an ID-based check instead
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