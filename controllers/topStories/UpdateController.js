import TopStoriesModel from "../../models/TopStories.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import { deleteImageFromCloudinary } from "../../utils/helpers.js";

const updateStory = async (req, res) => {
  try {
    const { id, title, items, currentThumbnailPublicId, isDisplayed } =
      req.body;
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
      // You might want to fetch the current story if no new thumbnail is uploaded
      const currentStory = await TopStoriesModel.findById(id);
      thumbnailPublicId = currentStory.thumbnailPublicId; // Retain the old public ID
      thumbnailUrl = currentStory.thumbnail; // Retain the old thumbnail URL
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

    id && req.file ? deleteImageFromCloudinary(currentThumbnailPublicId) : null;
    // Prepare the parameters for the story update
    const storyData = {
      title,
      thumbnail: thumbnailUrl,
      thumbnailPublicId,
      content: parsedItems, // Ensure items are parsed correctly
    };

    // Update the story in the database
    const updatedStory = await TopStoriesModel.findByIdAndUpdate(
      id,
      storyData, // Directly pass the update object
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      }
    );

    // Check if the story was found and updated
    if (!updatedStory) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({
      message: "Story updated successfully",
      data: updatedStory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating" });
  }
};

export default updateStory;
