import TopStoriesModel from "../../models/TopStories.js";
import { deleteImageFromCloudinary } from "../../utils/helpers.js";
const deleteStory = async (req, res) => {
  const { id, thumbnailPublicId } = req.body;

  try {
    // Delete the image from Cloudinary
    if (thumbnailPublicId) deleteImageFromCloudinary(thumbnailPublicId);

    // Delete the story from the database
    const result = await TopStoriesModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};

export default deleteStory;
