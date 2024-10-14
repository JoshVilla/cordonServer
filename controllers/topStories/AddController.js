const TopStoriesModel = require("../../models/TopStories");
const cloudinary = require("../../config/cloudinaryConfig");

const addStory = async (req, res) => {
  try {
    const { title, thumbnail, items } = req.body;

    const parsedItems = JSON.parse(items);

    // Upload the file to Cloudinary if it exists
    const imageUrl = req.file
      ? (
          await cloudinary.uploader.upload(req.file.path, {
            folder: "admin_avatars",
          })
        ).secure_url
      : "";

    const getPublicIdForCloudinary = (fileUrl) => {
      if (fileUrl) {
        const splitted = fileUrl.split("/");
        const public = `${splitted[7]}/${splitted[8]}`;
        const publicId = public.replace(".png", "");
        return publicId;
      }
      return "";
    };

    const params = {
      title,
      thumbnail: imageUrl,
      thumbnailPublicId: getPublicIdForCloudinary(imageUrl),
      content: parsedItems, // Items will now be an array of objects
    };

    console.log(params);

    // You can now save `params` to the database using `TopStoriesModel`
    await TopStoriesModel.create(params);

    // Send a response confirming the body was processed
    return res
      .status(200)
      .json({ message: "Story added successfully", data: params });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { addStory };
