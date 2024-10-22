const TopStoriesModel = require("../../models/TopStories");
const cloudinary = require("../../config/cloudinaryConfig");

const addStory = async (req, res) => {
  console.log("Received Data:", req.body);
  try {
    const { title, items } = req.body;

    // Ensure `items` is properly parsed if it's sent as a JSON string
    const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
    console.log("Parsed Items:", parsedItems);

    const thumbnailUrl = req.file
      ? (
          await cloudinary.uploader.upload(req.file.path, {
            folder: `admin_stories`,
          })
        ).secure_url
      : "";
    const getPublicIdForCloudinary = (fileUrl) => {
      if (fileUrl) {
        const splitted = fileUrl.split("/");
        const publicPart = `${splitted[7]}/${splitted[8]}`;
        // Remove the file extension by splitting at the last dot (.)
        const publicId = publicPart.substring(0, publicPart.lastIndexOf("."));
        return publicId;
      }
      return "";
    };

    const params = {
      title,
      thumbnail: thumbnailUrl,
      thumbnailPublicId: getPublicIdForCloudinary(thumbnailUrl),
      content: items, // Parsed and uploaded items should now be an array of objects
    };

    console.log("Params:", params);

    // Save the story to the database
    await TopStoriesModel.create(params);

    // Send a success response
    return res
      .status(200)
      .json({ message: "Story added successfully", data: params });
  } catch (err) {
    console.error("Error adding story:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { addStory };
