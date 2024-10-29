import AdminModel from "../../models/Admin.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import base64 from "base-64";

const editAdmin = async (req, res) => {
  const { id, username, password, isSuperAdmin } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required" });
  }

  const getPublicIdForCloudinary = (file) => {
    if (file) {
      const splitted = file?.split("/");
      const publicCombine = `${splitted[7]}/${splitted[8]}`;
      const publicId = publicCombine.replace(".png", "");

      return publicId;
    }
    return "";
  };

  const avatarUrl = req.file
    ? (
        await cloudinary.uploader.upload(req.file.path, {
          folder: "admin_avatars",
        })
      ).secure_url
    : "";

  // Create the update data object
  let newAdminData = {};
  if (username) newAdminData.username = username;
  if (password) newAdminData.password = base64.encode(password);
  if (isSuperAdmin !== undefined) newAdminData.isSuperAdmin = isSuperAdmin;
  if (req.file) {
    newAdminData.avatar = avatarUrl;
    newAdminData.publicId = getPublicIdForCloudinary(avatarUrl);
  }

  AdminModel.findById(id).then((result) => {
    if (result.publicId) {
      cloudinary.uploader.destroy(result.publicId);
    }
  });

  // Update the admin by ID
  AdminModel.findByIdAndUpdate(
    id, // The document's _id (not an object)
    newAdminData, // The fields to update
    { new: true, runValidators: true } // Return the updated document and run schema validations
  )
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Admin not found", id });
      }
      res.status(200).json({
        message: "Admin updated successfully",
        admin: result, // Return the updated admin data
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error updating admin", error: err.message });
    });
};

export default editAdmin;
