const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  isSuperAdmin: Number,
  isActive: Number,
  createdAt: String,
  avatar: String,
  fileName: String,
});

const AdminModel = mongoose.model("admins", AdminSchema);
module.exports = AdminModel;
