const OfficialsModel = require("../../models/Officials");
const { deleteImageFromCloudinary } = require("../../utils/helpers");

const deleteOfficial = async (req, res) => {
  try {
    const { id, profilePublicId } = req.body;
    console.log(req.body);

    deleteImageFromCloudinary(profilePublicId);
    const response = await OfficialsModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Delete Successfully",
      data: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Deleting official failed" });
  }
};

module.exports = { deleteOfficial };
