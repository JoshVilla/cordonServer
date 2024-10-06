const mongoose = require("mongoose");

const HighlightSchema = new mongoose.Schema({
  sorted: {
    type: Number,
    required: true,
  },
  display: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  imagePublicId: {
    type: String,
    required: true,
  },
});

const HomepageSchema = new mongoose.Schema({
  highlights: [HighlightSchema],
});

const HomepageModel = mongoose.model("homepage_dbs", HomepageSchema);

module.exports = HomepageModel;
