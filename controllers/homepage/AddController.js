import cloudinary from "../../config/cloudinaryConfig.js";
import HomepageModel from "../../models/Homepage.js";

const addHomePageInfo = async (req, res) => {
  const { section, sorted, display, title, content, hotline_1, hotline_2 } =
    req.body;

  const avatarUrl = req.file
    ? (
        await cloudinary.uploader.upload(req.file.path, {
          folder: `admin_highlights`,
        })
      ).secure_url
    : "";

  const getPublicIdForCloudinary = (file) => {
    if (file) {
      const splitted = file?.split("/");
      const publicCombine = `${splitted[7]}/${splitted[8]}`;
      const publicId = publicCombine.replace(".png", "");

      return publicId;
    }
    return "";
  };
  const newHighlightData = {
    section,
    display,
    sorted,
    title,
    content,
    image: avatarUrl,
    imagePublicId: getPublicIdForCloudinary(avatarUrl),
  };

  const newHotlineData = {
    image: avatarUrl,
    imagePublicId: getPublicIdForCloudinary(avatarUrl),
    hotline_1,
    hotline_2,
    title,
  };

  if (section === "highlights") {
    HomepageModel.findByIdAndUpdate(
      "67027185ee9f3ce34598e2c4",
      {
        $push: { [section]: newHighlightData }, // Add new highlight
      },
      { new: true }
    )
      .then((result) => {
        res.json("Added Successfully");
      })
      .catch((err) => res.json(err));
  } else if (section === "hotlines") {
    HomepageModel.findByIdAndUpdate(
      "67027185ee9f3ce34598e2c4",
      {
        $push: { [section]: newHotlineData }, // Add new highlight
      },
      { new: true }
    )
      .then((result) => {
        res.json("Added Successfully");
      })
      .catch((err) => res.json(err));
  }
};

export default addHomePageInfo;
