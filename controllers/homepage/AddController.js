const cloudinary = require("../../config/cloudinaryConfig");
const HomepageModel = require("../../models/Homepage");

const addHomePageInfo = async (req, res) => {
  const { section, sorted, display, title, content } = req.body;

  const avatarUrl = req.file
    ? (
        await cloudinary.uploader.upload(req.file.path, {
          folder: "admin_highlights",
        })
      ).secure_url
    : "";

  const getPublicIdForCloudinary = (file) => {
    if (file) {
      const splitted = file?.split("/");
      const public = `${splitted[7]}/${splitted[8]}`;
      const publicId = public.replace(".png", "");

      return publicId;
    }
    return "";
  };
  const newData = {
    section,
    display,
    sorted,
    title,
    content,
    image: avatarUrl,
    imagePublicId: getPublicIdForCloudinary(avatarUrl),
  };

  if (section === "highlights") {
    HomepageModel.findByIdAndUpdate(
      "67027185ee9f3ce34598e2c4",
      {
        $push: { [section]: newData }, // Add new highlight
      },
      { new: true }
    )
      .then((result) => {
        res.json("Added");
      })
      .catch((err) => res.json(err));
  }
};

module.exports = { addHomePageInfo };
