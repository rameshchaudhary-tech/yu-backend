import Service from "../models/Service.js";

/* ================= GET ALL ================= */
export const getServices = async(req, res) => {
    try {
        const services = await Service.find()
            .select("title description icon popular features slug createdAt")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: services
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/* ================= CREATE ================= */
export const createService = async(req, res) => {
    try {
        const { title, description, icon, popular, features, slug } = req.body;

        const service = await Service.create({
            title,
            description,
            icon,
            popular,
            features,
            slug
        });

        res.status(201).json({
            success: true,
            data: service
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/* ================= UPDATE ================= */
export const updateService = async(req, res) => {
    try {
        const { id } = req.params;

        const updated = await Service.findByIdAndUpdate(
            id,
            req.body, { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.json({
            success: true,
            data: updated
        });

    } catch (err) {
        console.log("UPDATE ERROR:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* ================= DELETE ================= */
export const deleteService = async(req, res) => {
    try {
        const deleted = await Service.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Not found"
            });
        }

        res.json({
            success: true,
            message: "Deleted"
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/* ================= UPSERT ================= */
export const upsertService = async(req, res) => {
    try {
        const { title, description, icon, popular, features, slug } = req.body;

        const updatedService = await Service.findOneAndUpdate({ slug }, { title, description, icon, popular, features, slug }, { new: true, upsert: true, runValidators: true });

        res.json({
            success: true,
            data: updatedService
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};