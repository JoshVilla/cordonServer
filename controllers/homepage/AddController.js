const cloudinary = require("../../config/cloudinaryConfig");
const HomepageModel = require("../../models/Homepage");
const multer = require("multer");
const path = require("path");

const avatarUrl = req.file
  ? (
      await cloudinary.uploader.upload(req.file.path, {
        folder: "admin_avatars",
      })
    ).secure_url
  : "";

const updateHomePageInfo = (req, res) => {
  const { section, id } = req.body;
  if (section === "highlights") {
    const updatedHighlights = HomepageModel.findByIdAndUpdate({
      id,
    });
  }
};

module.exports = { updateHomePageInfo };
