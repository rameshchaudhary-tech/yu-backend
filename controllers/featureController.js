import Feature from "../models/Feature.js";

// Get Feature Section Data
export const getFeatures = async(req, res) => {
    try {
        const data = await Feature.findOne().lean();
        if (!data) {
            return res.status(404).json({ success: false, message: "No feature data found" });
        }
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update or Insert Feature Data
export const updateFeatures = async(req, res) => {
    try {
        const { mainHeading, highlightedText, featuresList } = req.body;

        // Fast validation
        if (!mainHeading || !highlightedText || !featuresList) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Atomic findOneAndUpdate (Upsert creates if not exists)
        const updatedData = await Feature.findOneAndUpdate({},
            req.body, { new: true, upsert: true, runValidators: true }
        ).lean();

        res.status(200).json({
            success: true,
            message: "Features section updated successfully",
            data: updatedData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed", error: error.message });
    }
};