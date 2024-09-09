const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AdminModel = require("./models/Admin");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.port || 5000;
mongoose
  .connect("mongodb+srv://test:Test123@cluster0.y3kde2g.mongodb.net/cordon_db")
  .then((res) => console.log("Connect to Atlas"))
  .catch((err) => console.log(err));

app.post("/add", (req, res) => {
  const { username, password, isSuperAdmin } = req.body;
  AdminModel.create({
    username,
    password,
    isSuperAdmin,
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json(err));
});

app.get("/get", (req, res) => {
  AdminModel.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json(err));
});

app.post("/delete", (req, res) => {
  const { _id } = req.body;
  // console.log(id);
  AdminModel.findByIdAndDelete(_id)
    .then((result) => {
      // res.json(result);
      res.json({ message: "Data Deleted" });
    })
    .catch((err) => res.json(err));
});

app.post("/update", (req, res) => {
  const { _id, username, password } = req.body;
  AdminModel.findByIdAndUpdate(_id, { username, password }, { new: true })
    .then((result) => {
      res.json({ message: "Data Updated !", par: `${_id},${task}` });
    })
    .catch((err) => res.json(err));
});

app.listen(PORT, () => {
  console.log("Server Running at" + PORT);
});
