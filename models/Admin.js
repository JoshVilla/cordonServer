const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  isSuperAdmin: Boolean,
});

const AdminModel = mongoose.model("admins", AdminSchema);
module.exports = AdminModel;
