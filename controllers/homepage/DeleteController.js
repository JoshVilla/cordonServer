const HomepageModel = require("../../models/Homepage");
const cloudinary = require("../../config/cloudinaryConfig");

const deleteHomePageInfo = async (req, res) => {
  const { section, idSectionData, imagePublicId } = req.body;

  const deleteImageFromCloudinary = async (imagePublicId) => {
    const publicId = imagePublicId.split(".").shift();

    cloudinary.uploader.destroy(publicId);
  };
  deleteImageFromCloudinary(imagePublicId);
  HomepageModel.findByIdAndUpdate("67027185ee9f3ce34598e2c4", {
    $pull: { [section]: { _id: idSectionData } },
  })
    .then((result) => {
      res.json("Deleted");
    })
    .catch((err) => res.json(err));
};

module.exports = { deleteHomePageInfo };
