import mongoose from "mongoose";

const servicesHeroSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    highlightText: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    primaryBtnText: { type: String, default: "Book Free Consultation" },
    phoneNumber: { type: String, default: "+91 6355582605" },
    heroImage: { type: String, required: true }
}, { timestamps: true });

servicesHeroSchema.index({ createdAt: -1 });

export default mongoose.models.ServicesHero || mongoose.model("ServicesHero", servicesHeroSchema);