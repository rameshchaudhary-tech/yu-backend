import Hero from "../models/Hero.js";

/**
 * Fetch Hero Data
 * This function handles the request to get all hero section details.
 */
export const getHeroData = async (req, res) => {
  try {
    // Using lean() to make the database query faster
    const hero = await Hero.findOne().lean();

    // Check if data exists in the database
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "No hero data found.",
      });
    }

    // Return the found data
    return res.status(200).json({
      success: true,
      data: hero,
    });
  } catch (err) {
    // Handle any server-side errors
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Update Hero Data
 * This function allows admins to update existing data or insert it if empty.
 */
export const updateHeroData = async (req, res) => {
  try {
    // Extracting fields from the request body
    const { 
      welcomeText, 
      mainHeading, 
      highlightedText, 
      subHeading, 
      backgroundImage, 
      cards 
    } = req.body;

    // Basic validation to ensure heading is provided
    if (!mainHeading) {
      return res.status(400).json({
        success: false,
        message: "Please provide the main heading.",
      });
    }

    /**
     * Update the first record found. 
     * upsert: true means it will create a new record if none exists.
     */
    const updatedHero = await Hero.findOneAndUpdate(
      {},
      {
        welcomeText,
        mainHeading,
        highlightedText,
        subHeading,
        backgroundImage,
        cards,
      },
      {
        new: true, // Return the updated document
        upsert: true, // Insert if not found
        runValidators: true, // Validate data against the model
      }
    ).lean();

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Hero section updated successfully!",
      data: updatedHero,
    });
  } catch (err) {
    // Handle update failures
    return res.status(500).json({
      success: false,
      message: "Failed to update hero data.",
      error: err.message
    });
  }
};