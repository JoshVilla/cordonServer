const TopStoriesModel = require("../../models/TopStories");
const cloudinary = require("../../config/cloudinaryConfig");

const addStory = async (req, res) => {
  const { title, date, thumbnail, content } = req.body;

  const newContent = content.map();
  const params = {
    title,
    date,
    thumbnail,
    content,
  };
  const newStory = TopStoriesModel.create({});
};

module.exports = { addStory };
