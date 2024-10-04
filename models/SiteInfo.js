const mongoose = require("mongoose");

const SiteInfoSchema = new mongoose.Schema({
  title: String,
  address: String,
  mission: String,
  vision: String,
  accounts: {},
  logoPublicId: String,
  logo: String,
});

const SiteInfoModel = mongoose.model("site_informations", SiteInfoSchema);
module.exports = SiteInfoModel;
