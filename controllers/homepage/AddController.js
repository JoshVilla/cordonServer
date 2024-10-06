const cloudinary = require("../../config/cloudinaryConfig");
const HomepageModel = require("../../models/Homepage");

const updateHomePageInfo = async (req, res) => {
  const { section, data, id } = req.body;

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
  const updatedHighlight = {
    ...data,
    image: avatarUrl,
    imagePublicId: getPublicIdForCloudinary(avatarUrl),
  };

  if (section === "highlights") {
    HomepageModel.findByIdAndUpdate(
      id,
      {
        $push: { [section]: updatedHighlight }, // Add new highlight
      },
      { new: true }
    )
      .then((result) => {
        res.json("Added");
      })
      .catch((err) => res.json(err));
  }
};

module.exports = { updateHomePageInfo };
