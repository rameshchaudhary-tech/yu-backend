import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    welcomeText: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "WELCOME TO",
    },

    mainHeading: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120,
    },
    highlightedText: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    subHeading: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    backgroundImage: {
      type: String,
      trim: true,
      default: "",
    },

    cards: [
      {
        subtitle: { type: String, trim: true, maxlength: 100 },
        title: { type: String, trim: true, maxlength: 100 },
        icon: { type: String, trim: true, maxlength: 50 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Hero", heroSchema);