const mongoose = require("mongoose");

const SiteInfoSchema = new mongoose.Schema({
  title: String,
  address: String,
  mission: String,
  vision: String,
  accounts: {},
  publicId: String,
  avatar: String,
});

const SiteInfoModel = mongoose.model("site_informations", SiteInfoSchema);
module.exports = SiteInfoModel;
