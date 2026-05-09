import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// CREATE ADMIN (one-time)
export const createAdmin = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new User({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        await admin.save();

        res.json({ message: "Admin created successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};


// LOGIN ADMIN
export const loginAdmin = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Not admin" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        res.json({ token });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};