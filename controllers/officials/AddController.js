const OfficialsModel = require("../../models/Officials");
const cloudinary = require("../../config/cloudinaryConfig");

const getPublicIdForCloudinary = (fileUrl) => {
  if (fileUrl) {
    const urlParts = fileUrl.split("/");
    return `${urlParts[7]}/${urlParts[8]}`.split(".")[0];
  }
  return "";
};

const countOfficialsByPosition = async () => {
  try {
    const counts = await OfficialsModel.aggregate([
      { $group: { _id: "$position", count: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          position: "$_id",
          count: 1,
        },
      },
    ]);

    return counts.reduce(
      (acc, curr) => {
        acc[curr.position] = curr.count;
        return acc;
      },
      { Mayor: 0, "Vice Mayor": 0, Councilor: 0 }
    );
  } catch (error) {
    console.error("Error fetching official counts:", error);
    throw error; // Rethrow to handle later
  }
};

const messageCount = (position) => {
  const messages = {
    Mayor: "Maximum of 1 can add a Mayor",
    "Vice Mayor": "Maximum of 1 can add a Vice Mayor",
    Councilor: "Maximum of 8 can add a Councilor",
  };
  return messages[position] || "Invalid position";
};

const addOfficial = async (req, res) => {
  const { name, position, level } = req.body;

  let profileUrl = "";
  let profilePublicId = "";

  // Handle file upload if present
  if (req.file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: `admin_officials`,
      });
      profileUrl = uploadResult.secure_url;
      profilePublicId = getPublicIdForCloudinary(profileUrl);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ error: "Cloudinary upload failed." });
    }
  }

  // Count officials and validate position limits
  try {
    const counts = await countOfficialsByPosition();

    const isValidCount =
      (position === "Mayor" && counts.Mayor < 1) ||
      (position === "Vice Mayor" && counts["Vice Mayor"] < 1) ||
      (position === "Councilor" && counts.Councilor < 8);

    if (!isValidCount) {
      return res.status(200).json({
        message: messageCount(position),
        code: 1,
      });
    }

    // Create new official
    const result = await OfficialsModel.create({
      name,
      position,
      profile: profileUrl,
      profilePublicId,
      level,
    });

    return res.status(200).json({
      message: "Official added successfully",
      code: 0,
    });
  } catch (err) {
    console.error("Database operation failed:", err);
    return res.status(500).json({ error: "Adding official failed" });
  }
};

module.exports = { addOfficial };
