const OfficialsModel = require("../../models/Officials");

const updateOfficial = async (req, res) => {
  const { profile, name, position, level, id } = req.body;
  try {
    if (profile) {
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
      ...(profile && {
        profile,
        profilePublicId,
      }),
    });

    return res.status(200).json({
      message: "Official Update Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.json({ massage: "Edit Official Failed" });
  }
};

module.exports = { updateOfficial };
