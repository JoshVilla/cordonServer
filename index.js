import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import upload from "./middleware/upload.js";

import {
  getAdmin,
  deleteAdmin,
  editAdmin,
  addAdmin,
} from "./controllers/admin/index.js";
import { login } from "./controllers/login/LoginController.js";

import { updateSiteInfo, getSiteInfo } from "./controllers/siteInfo/index.js";

import {
  getHomepageInfo,
  addHomePageInfo,
  deleteHomePageInfo,
  updateHomePageInfo,
} from "./controllers/homepage/index.js";

import {
  addStory,
  deleteStory,
  getTopStories,
  updateDisplay,
  updateStory,
} from "./controllers/topStories/index.js";

import {
  addOfficial,
  getOfficials,
  deleteOfficial,
  updateOfficial,
} from "./controllers/officials/index.js";

mongoose
  .connect(process.env.ATLAS_DB_LINK)
  .then((res) => console.log("Connect to Atlas"))
  .catch((err) => console.log(err));

dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Admin Management

app.post("/addAdmin", upload.single("avatar"), addAdmin);

app.post("/save", upload.single("avatar"), editAdmin);

app.post("/get", getAdmin);

app.post("/delete", deleteAdmin);

//Login

app.post("/login", login);

//Site Management

app.get("/siteInfo", getSiteInfo);

app.post("/siteInfoUpdate", upload.single("logo"), updateSiteInfo);

// Page Management

// Homepage

app.get("/homepageInfo", getHomepageInfo);

app.post("/addHomePageInfo", upload.single("image"), addHomePageInfo);

app.post("/deleteHomePageInfo", deleteHomePageInfo);

app.post("/updateHomepageInfo", upload.single("image"), updateHomePageInfo);

// Top Stories
app.post("/topStoriesInfo", getTopStories);

app.post("/addStory", upload.single("thumbnail"), addStory);

app.post("/deleteStory", deleteStory);

app.post("/updateStory", upload.single("thumbnail"), updateStory);

app.post("/updateDisplayStory", updateDisplay);

//Officials

app.post("/addOfficial", upload.single("profile"), addOfficial);

app.post("/getOfficials", getOfficials);

app.post("/deleteOfficial", deleteOfficial);

app.post("/updateOfficial", upload.single("profile"), updateOfficial);

app.listen(PORT, () => {
  console.log("Server Running at " + PORT);
});
