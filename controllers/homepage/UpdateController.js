import HomepageModel from "../../models/Homepage.js";
import cloudinary from "../../config/cloudinaryConfig.js";

export const updateHomePageInfo = async (req, res) => {
  const {
    section,
    sorted,
    display,
    title,
    content,
    highlightsId,
    hotlinesId,
    hotline_1,
    hotline_2,
  } = req.body;

  try {
    // Upload new image if present
    let avatarUrl = "";
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "admin_highlights",
        });
        avatarUrl = uploadResult.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed:", cloudinaryError);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    // Extract publicId from Cloudinary URL
    const getPublicIdForCloudinary = (file) => {
      if (file) {
        const splitted = file?.split("/");
        const combinePublicId = `${splitted[7]}/${splitted[8]}`;
        const publicId = combinePublicId.replace(".png", "");
        return publicId;
      }
      return "";
    };

    // Prepare updated data object
    const updatedData = {
      display,
      sorted,
      title,
      content,
      hotline_1,
      hotline_2,
    };

    // If a new image is uploaded, add image and imagePublicId to updated data
    if (avatarUrl) {
      updatedData.image = avatarUrl;
      updatedData.imagePublicId = getPublicIdForCloudinary(avatarUrl);
    }

    // Log the request body and updated data
    console.log("Request body:", req.body);
    console.log("Updated data:", updatedData);

    // Check if we are updating the highlights section
    if (section === "highlights") {
      // Ensure highlightsId is converted to ObjectId if it's valid

      // Update specific highlight in the highlights array
      const result = await HomepageModel.updateOne(
        {
          _id: "67027185ee9f3ce34598e2c4", // Ensure main document's _id is ObjectId
          "highlights._id": highlightsId,
        },
        {
          $set: {
            "highlights.$.display": display,
            "highlights.$.sorted": sorted,
            "highlights.$.title": title,
            "highlights.$.content": content,
            ...(avatarUrl && {
              "highlights.$.image": avatarUrl,
              "highlights.$.imagePublicId": updatedData.imagePublicId,
            }),
          },
        }
      );

      // Log the result of the update operation
      console.log("Update result:", result);

      // Check if any document was updated
      if (result.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Highlight updated successfully" });
      } else {
        return res.status(404).json({ message: "Highlight not found" });
      }
    } else if (section === "hotlines") {
      const result = await HomepageModel.updateOne(
        {
          _id: "67027185ee9f3ce34598e2c4", // Ensure main document's _id is ObjectId
          "hotlines._id": hotlinesId,
        },
        {
          $set: {
            "hotlines.$.title": title,
            "hotlines.$.hotline_1": hotline_1,
            "hotlines.$.hotline_2": hotline_2,
            ...(avatarUrl && {
              "hotlines.$.image": avatarUrl,
              "hotlines.$.imagePublicId": updatedData.imagePublicId,
            }),
          },
        }
      );
      // Log the result of the update operation
      console.log("Update result:", result);

      // Check if any document was updated
      if (result.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Hotline updated successfully" });
      } else {
        return res.status(404).json({ message: "Hotlines not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid section" });
    }
  } catch (error) {
    console.error("Error updating highlight:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
