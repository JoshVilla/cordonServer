import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { addAdmin } from "./controllers/admin/AdminController.js";
import { editAdmin } from "./controllers/admin/EditController.js";
import { deleteAdmin } from "./controllers/admin/DeleteController.js";
import { getAdmin } from "./controllers/admin/GetController.js";
import { login } from "./controllers/login/LoginController.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import upload from "./middleware/upload.js";
import { updateSiteInfo } from "./controllers/siteInfo/UpdateController.js";
import { getSiteInfo } from "./controllers/siteInfo/GetController.js";
import { getHomepageInfo } from "./controllers/homepage/GetController.js";
import { addHomePageInfo } from "./controllers/homepage/AddController.js";
import { deleteHomePageInfo } from "./controllers/homepage/DeleteController.js";
import { updateHomePageInfo } from "./controllers/homepage/UpdateController.js";

import { getTopStories } from "./controllers/topStories/GetController.js";
import { addStory } from "./controllers/topStories/AddController.js";
import { deleteStory } from "./controllers/topStories/DeleteController.js";
import { updateStory } from "./controllers/topStories/UpdateController.js";
import { updateDisplay } from "./controllers/topStories/UpdateDisplayController.js";

import { addOfficial } from "./controllers/officials/AddController.js";
import { getOfficials } from "./controllers/officials/GetController.js";
import { deleteOfficial } from "./controllers/officials/DeleteController.js";
import { updateOfficial } from "./controllers/officials/UpdateController.js";
const PORT = process.env.PORT;

mongoose
  .connect(process.env.ATLAS_DB_LINK)
  .then((res) => console.log("Connect to Atlas"))
  .catch((err) => console.log(err));

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

app.post("/updateOfficial", updateOfficial);

app.listen(PORT, () => {
  console.log("Server Running at " + PORT);
});
