import TopStoriesModel from "../../models/TopStories.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import { DateNow } from "../../utils/helpers.js";
const addStory = async (req, res) => {
  try {
    const { title, items } = req.body;

    // Parsed items
    let parsedItems;
    try {
      parsedItems = typeof items === "string" ? JSON.parse(items) : items;
    } catch (parseError) {
      console.error("Error parsing items:", parseError);
      return res.status(400).json({ error: "Invalid items format." });
    }

    let thumbnailUrl = "";
    let thumbnailPublicId = "";

    if (req.file) {
      console.log("Uploading file to Cloudinary...");
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: `admin_stories`,
        });
        thumbnailUrl = uploadResult.secure_url;
        thumbnailPublicId = getPublicIdForCloudinary(thumbnailUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError);
        return res.status(500).json({ error: "Cloudinary upload failed." });
      }
    } else {
      console.log("No file uploaded.");
    }

    function getPublicIdForCloudinary(fileUrl) {
      if (fileUrl) {
        const urlParts = fileUrl.split("/");
        const publicPart = `${urlParts[7]}/${urlParts[8]}`;
        return publicPart.split(".")[0];
      }
      return "";
    }

    const storyData = {
      title,
      thumbnail: thumbnailUrl,
      thumbnailPublicId,
      content: parsedItems,
      createdAt: DateNow(),
      isDisplayed: 0,
    };

    const newStory = await TopStoriesModel.create(storyData);

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

export default addStory;
