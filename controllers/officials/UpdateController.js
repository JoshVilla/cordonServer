import OfficialsModel from "../../models/Officials.js";
import cloudinary from "../../config/cloudinaryConfig.js";

const updateOfficial = async (req, res) => {
  const { profile, name, position, level, id } = req.body;
  let profilePublicId, profileUrl;

  const getPublicIdForCloudinary = (fileUrl) => {
    if (fileUrl) {
      const urlParts = fileUrl.split("/");
      return `${urlParts[7]}/${urlParts[8]}`.split(".")[0];
    }
    return "";
  };
  try {
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: `admin_officials`,
      });
      profileUrl = uploadResult.secure_url;
      profilePublicId = getPublicIdForCloudinary(profileUrl);
    }

    const response = await OfficialsModel.findByIdAndUpdate(id, {
      name,
      position,
      level,
      ...(req.file && {
        profile: profileUrl,
        profilePublicId,
      }),
    });

    return res.status(200).json({
      message: "Official Update Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Edit Official Failed" });
  }
};

export default updateOfficial;
