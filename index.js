const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AdminModel = require("./models/Admin");
const SiteInfoModel = require("./models/SiteInfo");
const { addAdmin } = require("./controllers/admin/AdminController");
const { editAdmin } = require("./controllers/admin/EditController");
const { deleteAdmin } = require("./controllers/admin/DeleteController");
const { getAdmin } = require("./controllers/admin/GetController");
const { login } = require("./controllers/login/LoginController");
const cloudinary = require("./config/cloudinaryConfig");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const upload = require("./middleware/upload");
const PORT = process.env.PORT;

mongoose
  .connect(process.env.ATLAS_DB_LINK)
  .then((res) => console.log("Connect to Atlas"))
  .catch((err) => console.log(err));

app.post("/addAdmin", upload.single("avatar"), addAdmin);

app.post("/save", editAdmin);

app.post("/get", getAdmin);

app.post("/delete", deleteAdmin);

app.post("/login", login);

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

app.post("/siteInfoUpdate", async (req, res) => {
  const { id, title, address, accounts, vision, mission } = req.body;
  let params = {};

  const getPublicIdForCloudinary = (file) => {
    if (file) {
      const splitted = file?.split("/");
      const public = `${splitted[7]}/${splitted[8]}`;
      const publicId = public.replace(".png", "");

      return publicId;
    }
    return "";
  };

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
  console.log(req.file, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

  // If an avatar was uploaded, upload it to Cloudinary
  const avatarUrl = req.file
    ? (
        await cloudinary.uploader.upload(req.file.path, {
          folder: "admin_avatars",
        })
      ).secure_url
    : "";

  // Update the document by ID
  SiteInfoModel.findByIdAndUpdate(
    id,
    {
      ...params,
      avatar: avatarUrl,
      publicId: getPublicIdForCloudinary(avatarUrl),
    },
    {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    }
  )
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
