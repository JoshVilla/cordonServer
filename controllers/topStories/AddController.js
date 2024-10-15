const TopStoriesModel = require("../../models/TopStories");
const cloudinary = require("../../config/cloudinaryConfig");

const addStory = async (req, res) => {
  console.log("Received Data:", req.body);
  try {
    const { title, items } = req.body;

    // Ensure `items` is properly parsed if it's sent as a JSON string
    // const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
    // console.log("Parsed Items:", parsedItems);

    let imageUrl = ""; // Placeholder for the thumbnail URL

    // Upload the file to Cloudinary if it exists
    // const uploadedItems = await Promise.all(
    //   parsedItems.map(async (item) => {
    //     if (item.type === "image" && req.files[`items[${index}].image`]) {
    //       const imageUpload = await cloudinary.uploader.upload(
    //         req.files[`items[${index}].image`][0].path,
    //         { folder: "admin_stories" }
    //       );
    //       return { ...item, image: imageUpload.secure_url };
    //     }
    //     return item;
    //   })
    // );

    const getPublicIdForCloudinary = (fileUrl) => {
      if (fileUrl) {
        const splitted = fileUrl.split("/");
        const publicPart = `${splitted[7]}/${splitted[8]}`;
        const publicId = publicPart.replace(".png", "");
        return publicId;
      }
      return "";
    };

    const params = {
      title,
      thumbnail: imageUrl,
      thumbnailPublicId: getPublicIdForCloudinary(imageUrl),
      content: [], // Parsed items should now be an array of objects
    };

    console.log("Params:", params);

    // Save the story to the database
    // await TopStoriesModel.create(params);

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
