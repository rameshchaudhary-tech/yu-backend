import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

// CREATE CONTACT
export const submitContact = async (req, res) => {
  try {
    console.log("📩 NEW REQUEST RECEIVED:", req.body);

    const { name, email, phone, message } = req.body;

    // validation
    if (!name || !email || !phone || !message) {
      console.log("❌ VALIDATION FAILED");

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // save DB
    const contact = await Contact.create({
      name,
      email,
      phone,
      message
    });

    console.log("✅ SAVED IN DB:", contact._id);

    // email setup
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // verify smtp
    await transporter.verify();
    console.log("✅ SMTP CONNECTED");

    // send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `📩 New Contact - ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    console.log("✅ EMAIL SENT:", info.response);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact
    });

  } catch (error) {
    console.log("❌ ERROR OCCURRED:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


// GET ALL CONTACTS
export const getAllContacts = async (req, res) => {
  try {
    console.log("📥 FETCH ALL CONTACTS");

    const contacts = await Contact.find().sort({ createdAt: -1 });

    console.log("✅ TOTAL CONTACTS:", contacts.length);

    res.status(200).json({
      success: true,
      data: contacts
    });

  } catch (error) {
    console.log("❌ ERROR FETCHING CONTACTS:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};