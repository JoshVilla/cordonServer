const cloudinary = require("../../config/cloudinaryConfig");
const AdminModel = require("../../models/Admin");

const deleteAdmin = async (req, res) => {
  const { _id } = req.body;

  const deleteImageFromCloudinary = async (_id) => {
    await AdminModel.findById(_id).then((result) => {
      cloudinary.uploader.destroy(result?.publicId);
    });
  };

  deleteImageFromCloudinary(_id);
  AdminModel.findByIdAndDelete(_id)
    .then((result) => {
      res.json({ message: "Data Deleted" });
    })
    .catch((err) => res.json(err));
};

module.exports = { deleteAdmin };
