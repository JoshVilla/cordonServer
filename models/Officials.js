const mongoose = require("mongoose");

const OfficialsSchema = new mongoose.Schema({
  name: String,
  position: String,
  profile: String,
  profilePublicId: String,
  level: Number,
});

const OfficialsModel = mongoose.model(
  "officials_informations",
  OfficialsSchema
);
module.exports = OfficialsModel;
