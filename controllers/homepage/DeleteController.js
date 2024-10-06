const HomepageModel = require("../../models/Homepage");

const deleteHomePageInfo = async (req, res) => {
  const { id, section, idSectionData } = req.body;

  const deleteImageFromCloudinary = async (_id) => {
    await HomepageModel.findById(id, {
      [section]: { _id: idSectionData },
    }).then((result) => {
      // cloudinary.uploader.destroy(result?.imagePublicId);
      console.log(result);
    });
  };
  deleteImageFromCloudinary();
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
