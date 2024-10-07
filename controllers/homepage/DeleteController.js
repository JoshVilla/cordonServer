const HomepageModel = require("../../models/Homepage");
const cloudinary = require("../../config/cloudinaryConfig");

const deleteHomePageInfo = async (req, res) => {
  const { id, section, idSectionData, imagePublicId } = req.body;

  const deleteImageFromCloudinary = async (imagePublicId) => {
    cloudinary.uploader.destroy(imagePublicId);
  };
  deleteImageFromCloudinary(imagePublicId);
  if (section === "highlights") {
    HomepageModel.findByIdAndUpdate(id, {
      $pull: { [section]: { _id: idSectionData } },
    })
      .then((result) => {
        res.json("Deleted");
      })
      .catch((err) => res.json(err));
  }
};

module.exports = { deleteHomePageInfo };
