import cloudinary from "../../config/cloudinaryConfig.js";
import AdminModel from "../../models/Admin.js";

const deleteAdmin = async (req, res) => {
  const { _id } = req.body;

  const getPublicIdForCloudinary = (file) => {
    if (file) {
      const splitted = file?.split("/");
      const publicCombine = `${splitted[7]}/${splitted[8]}`;
      const publicId = publicCombine.replace(".png", "");

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

export default deleteAdmin;
