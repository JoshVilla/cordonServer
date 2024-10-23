const TopStoriesModel = require("../../models/TopStories");
const cloudinary = require("../../config/cloudinaryConfig");
const { DateNow } = require("../../utils/helpers");
const addStory = async (req, res) => {
  console.log("Incoming request body:", req.body);
  console.log("Incoming file:", req.file);

  try {
    const { title, items } = req.body;
    console.log("Title:", title);
    console.log("Items:", items);

    // Parse items
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
        console.log("Cloudinary upload successful:", thumbnailUrl);
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
    };

    console.log("Saving story to database...");
    const newStory = await TopStoriesModel.create(storyData);

    console.log("Story added successfully:", newStory);
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
