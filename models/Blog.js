import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    color: { type: String, default: "from-blue-500 to-cyan-400" }
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;