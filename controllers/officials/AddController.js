const OfficialsModel = require("../../models/Officials");
const cloudinary = require("../../config/cloudinaryConfig");
const addOfficial = async (req, res) => {
  const { name, position, level } = req.body;

  let profileUrl = "";
  let profilePublicId = "";

  if (req.file) {
    try {
      console.log(req.file.path, "req.file.path");

      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: `admin_officials`,
      });
      profileUrl = uploadResult.secure_url;
      profilePublicId = getPublicIdForCloudinary(profileUrl);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ error: "Cloudinary upload failed." });
    }
  } else {
    console.log("No file uploaded");
  }

  try {
    const result = await OfficialsModel.create({
      name,
      position,
      profile: profileUrl,
      profilePublicId,
      level,
    });

    return res.status(200).json({
      message: "Official added successfully",
    });
  } catch (err) {
    console.error("Database insertion failed:", err);
    return res.status(500).json({ error: "Adding official failed" });
  }
};

function getPublicIdForCloudinary(fileUrl) {
  if (fileUrl) {
    const urlParts = fileUrl.split("/");
    const publicPart = `${urlParts[7]}/${urlParts[8]}`;
    return publicPart.split(".")[0];
  }
  return "";
}

module.exports = { addOfficial };
