const mongoose = require("mongoose");

const TopStoriesSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  thumbnailPublicId: String,
  date: String,
  content: Array,
  createdAt: String,
  isDisplayed: Number,
});

const TopStoriesModel = mongoose.model("top_stories_dbs", TopStoriesSchema);
module.exports = TopStoriesModel;
