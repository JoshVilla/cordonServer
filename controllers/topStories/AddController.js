const TopStoriesModel = require("../../models/TopStories");
const cloudinary = require("../../config/cloudinaryConfig");

const addStory = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    // Destructure the request body
    const { title, items } = req.body;

    // Parse `items` if it's a string (assuming JSON string input)
    const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
    console.log("Parsed Items:", parsedItems);

    // Handle file upload to Cloudinary if a file is present
    let thumbnailUrl = "";
    let thumbnailPublicId = "";

    if (req.file) {
      console.log("File uploaded:", req.file);
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: `admin_stories`,
      });
      thumbnailUrl = uploadResult.secure_url;
      thumbnailPublicId = getPublicIdForCloudinary(thumbnailUrl);
    } else {
      console.log("No file uploaded");
    }

    // Helper function to extract the Cloudinary public ID from the URL
    function getPublicIdForCloudinary(fileUrl) {
      if (fileUrl) {
        const urlParts = fileUrl.split("/");
        const publicPart = `${urlParts[7]}/${urlParts[8]}`;
        return publicPart.split(".")[0]; // Remove the file extension
      }
      return "";
    }

    // Prepare the parameters for the new story
    const storyData = {
      title,
      thumbnail: thumbnailUrl,
      thumbnailPublicId,
      content: parsedItems, // Ensure items are parsed correctly
    };

    console.log("Story Params:", storyData);

    // Save the story to the database
    const newStory = await TopStoriesModel.create(storyData);

    // Send a success response
    return res.status(200).json({
      message: "Story added successfully",
      data: newStory,
    });
  } catch (error) {
    console.error("Error adding story:", error.message || error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the story." });
  }
};

module.exports = { addStory };
