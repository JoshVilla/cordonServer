import mongoose from "mongoose";

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

const HotlineSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  imagePublicId: {
    type: String,
    required: true,
  },
  hotline_1: {
    type: String,
    required: true,
  },
  hotline_2: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const HomepageSchema = new mongoose.Schema({
  highlights: [HighlightSchema],
  hotlines: [HotlineSchema],
});

const HomepageModel = mongoose.model("homepage_dbs", HomepageSchema);

export default HomepageModel;
