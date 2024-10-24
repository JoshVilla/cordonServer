const cloudinary = require("../../config/cloudinaryConfig");
const AdminModel = require("../../models/Admin");

const deleteAdmin = async (req, res) => {
  const { _id } = req.body;

  const getPublicIdForCloudinary = (file) => {
    if (file) {
      const splitted = file?.split("/");
      const public = `${splitted[7]}/${splitted[8]}`;
      const publicId = public.replace(".png", "");

      return publicId;
    }
    return "";
  };

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
