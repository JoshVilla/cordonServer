const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { addAdmin } = require("./controllers/admin/AdminController");
const { editAdmin } = require("./controllers/admin/EditController");
const { deleteAdmin } = require("./controllers/admin/DeleteController");
const { getAdmin } = require("./controllers/admin/GetController");
const { login } = require("./controllers/login/LoginController");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = require("./middleware/upload");
const { updateSiteInfo } = require("./controllers/siteInfo/UpdateController");
const { getSiteInfo } = require("./controllers/siteInfo/GetController");
const { getHomepageInfo } = require("./controllers/homepage/GetController");
const { addHomePageInfo } = require("./controllers/homepage/AddController");
const {
  deleteHomePageInfo,
} = require("./controllers/homepage/DeleteController");
const {
  updateHomePageInfo,
} = require("./controllers/homepage/UpdateController");

const { getTopStories } = require("./controllers/topStories/GetController");
const { addStory } = require("./controllers/topStories/AddController");
const { deleteStory } = require("./controllers/topStories/DeleteController");
const { updateStory } = require("./controllers/topStories/UpdateController");
const {
  updateDisplay,
} = require("./controllers/topStories/UpdateDisplayController");

const { addOfficial } = require("./controllers/officials/AddController");
const { getOfficials } = require("./controllers/officials/GetController");
const { deleteOfficial } = require("./controllers/officials/DeleteController");
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

app.listen(PORT, () => {
  console.log("Server Running at " + PORT);
});
