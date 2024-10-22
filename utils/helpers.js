const cloudinary = require("../config/cloudinaryConfig");

const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      console.log(`Image with public ID ${publicId} deleted successfully.`);
      return { success: true, message: `Image deleted successfully.` };
    } else {
      console.error(
        `Failed to delete image with public ID ${publicId}:`,
        result
      );
      return { success: false, message: `Image deletion failed.` };
    }
  } catch (error) {
    console.error(`Error deleting image with public ID ${publicId}:`, error);
    return { success: false, message: error.message };
  }
};

module.exports = { deleteImageFromCloudinary };
