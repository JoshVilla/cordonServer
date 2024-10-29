import SiteInfoModel from "../../models/SiteInfo.js";
import cloudinary from "../../config/cloudinaryConfig.js";

const deletePreviousImage = (_id) => {
  SiteInfoModel.findById(_id).then((result) => {
    if (result.logoPublicId) {
      cloudinary.uploader.destroy(result.logoPublicId);
    }
  });
};

const updateSiteInfo = async (req, res) => {
  const {
    id,
    title,
    address,
    accounts,
    vision,
    mission,
    email,
    contactNumber,
  } = req.body;

  console.log(req.body, "@@@@body");

  let params = {};
  let parsedAccounts =
    typeof accounts === "string" ? JSON.parse(accounts) : accounts;
  const getPublicIdForCloudinary = (file) => {
    if (file) {
      const splitted = file?.split("/");
      const publicCombine = `${splitted[7]}/${splitted[8]}`;
      const publicId = publicCombine.replace(".png", "");
      return publicId;
    }
    return "";
  };

  if (title) params.title = title;
  if (address) params.address = address;
  if (vision) params.vision = vision;
  if (mission) params.mission = mission;
  if (email) params.email = email;
  if (contactNumber) params.contactNumber = contactNumber;

  if (parsedAccounts) {
    params.accounts = {};
    if (parsedAccounts.facebook)
      params.accounts.facebook = parsedAccounts.facebook;
    if (parsedAccounts.twitter)
      params.accounts.twitter = parsedAccounts.twitter;
    if (parsedAccounts.tiktok) params.accounts.tiktok = parsedAccounts.tiktok;
  }

  deletePreviousImage(id);

  // If an avatar was uploaded, upload it to Cloudinary
  const avatarUrl = req.file
    ? (
        await cloudinary.uploader.upload(req.file.path, {
          folder: "admin_avatars",
        })
      ).secure_url
    : "";

  // Update the document by ID
  SiteInfoModel.findByIdAndUpdate(
    id,
    {
      ...params,
      ...(avatarUrl && {
        logo: avatarUrl,
        logoPublicId: getPublicIdForCloudinary(avatarUrl),
      }),
    },
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    }
  )
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Document not found" });
      }
      return res.json({ message: "Data Updated" }); // Send the updated document to the client
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating" });
    });
};

export default updateSiteInfo;
