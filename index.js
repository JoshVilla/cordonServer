const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AdminModel = require("./models/Admin");
const SiteInfoModel = require("./models/SiteInfo");
const cloudinary = require("./config/cloudinaryConfig");
const { addAdmin } = require("./controllers/admin/AdminController");
const { editAdmin } = require("./controllers/admin/EditController");
const { deleteAdmin } = require("./controllers/admin/DeleteController");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const base64 = require("base-64");
const upload = require("./middleware/upload");
const fs = require("fs");
const PORT = process.env.PORT;
mongoose
  .connect(process.env.ATLAS_DB_LINK)
  .then((res) => console.log("Connect to Atlas"))
  .catch((err) => console.log(err));

app.post("/addAdmin", upload.single("avatar"), addAdmin);

app.post("/save", editAdmin);

app.post("/get", (req, res) => {
  // Initialize the query object
  let query = {};

  // Dynamically add filters if they exist
  if (req.body.username) query.username = req.body.username;
  if (req.body.isSuperAdmin) query.isSuperAdmin = req.body.isSuperAdmin;
  if (req.body.isActive) query.isActive = req.body.isActive;

  // Date range filter (assuming createdAt is the date field)
  if (req.body.startDate || req.body.endDate) {
    query.createdAt = {};
    if (req.body.startDate) query.createdAt.$gte = new Date(req.body.startDate); // Greater than or equal to start date
    if (req.body.endDate) query.createdAt.$lte = new Date(req.body.endDate); // Less than or equal to end date
  }

  AdminModel.find(query)
    .then((result) => {
      console.log("Result from database:", result);
      res.json(result);
    })
    .catch((err) => {
      console.error("Error during database query:", err);
      res.json(err);
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  AdminModel.findOne({ username })
    .then((admin) => {
      // Check if user exists
      if (!admin) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare passwords (plain-text, no bcrypt)
      if (base64.decode(admin.password) !== password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // If username and password match, send success response
      return res.json({ message: "Logged In", data: admin });
    })
    .catch((err) => {
      // Handle any errors that occur during the database query
      return res.status(500).json({ error: "Server error", details: err });
    });
});

app.post("/delete", deleteAdmin);

app.post("/update", (req, res) => {
  const { _id, username, password } = req.body;
  AdminModel.findByIdAndUpdate(_id, { username, password }, { new: true })
    .then((result) => {
      res.json({ message: "Data Updated !", par: `${_id},${task}` });
    })
    .catch((err) => res.json(err));
});

app.get("/siteInfo", (req, res) => {
  SiteInfoModel.find()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "An error occurred while fetching site info" });
    });
});

app.post("/siteInfoUpdate", (req, res) => {
  const { id, title, address, accounts, vision, mission } = req.body;
  let params = {};

  if (title) params.title = title;
  if (address) params.address = address;
  if (vision) params.vision = vision;
  if (mission) params.mission = mission;

  if (accounts) {
    params.accounts = {};
    if (accounts.facebook) params.accounts.facebook = accounts.facebook;
    if (accounts.twitter) params.accounts.twitter = accounts.twitter;
    if (accounts.tiktok) params.accounts.tiktok = accounts.tiktok;
  }

  // Update the document by ID
  SiteInfoModel.findByIdAndUpdate(id, params, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation rules are applied
  })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: "Document not found" });
      }
      return res.json({ message: "Data Updated" }); // Send the updated document to the client
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating" });
    });
});

app.listen(PORT, () => {
  console.log("Server Running at " + PORT);
});
