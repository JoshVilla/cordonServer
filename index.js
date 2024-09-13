const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AdminModel = require("./models/Admin");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const base64 = require("base-64");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PORT = process.env.port || 5000;
mongoose
  .connect("mongodb+srv://test:Test123@cluster0.y3kde2g.mongodb.net/cordon_db")
  .then((res) => console.log("Connect to Atlas"))
  .catch((err) => console.log(err));

app.post("/addAdmin", (req, res) => {
  const { username, password, isSuperAdmin, createdAt } = req.body;
  AdminModel.find({ username })

    .then((account) => {
      if (account.length === 1) {
        return res.json("Username Exist");
      } else {
        let = encodePassword = base64.encode(password);
        AdminModel.create({
          username,
          password: encodePassword,
          isSuperAdmin,
          isActive: 1,
          createdAt,
        }).then((result) => {
          res.json({
            message: "Data Added",
          });
        });
      }
    })
    .catch((err) => res.json(err));
});

// app.post("/save", async (req, res) => {
//   let newAdminData = {
//     isActive: false,
//   };

//   if (req.body.username) newAdminData.username = req.body.username;
//   if (req.body.password)
//     newAdminData.password = Buffer.from(req.body.password).toString("base64");
//   if (req.body.isSuperAdmin)
//     newAdminData.isSuperAdmin = req.body.isSuperAdmin === -1 ? false : true;

//   if (req.body.id) {
//     newAdminData._id = req.body.id; // Set custom ID if provided
//   }

//   // Create a new admin document
//   const newAdmin = new AdminModel(newAdminData);

//   // Save the admin to the database
//   const savedAdmin = await newAdmin.save();

//   // Send response back with the saved admin's ID
//   res.status(201).json({
//     message: "Admin saved successfully",
//     id: savedAdmin._id, // Include the generated or provided _id in the response
//     admin: savedAdmin,
//   });
// });

app.post("/save", (req, res) => {
  const { id, username, password, isSuperAdmin } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required" });
  }

  // Create the update data object
  let newAdminData = {};
  if (username) newAdminData.username = username;
  if (password) newAdminData.password = base64.encode(password);
  if (isSuperAdmin !== undefined) newAdminData.isSuperAdmin = isSuperAdmin;

  // Update the admin by ID
  AdminModel.findByIdAndUpdate(
    id, // The document's _id (not an object)
    newAdminData, // The fields to update
    { new: true, runValidators: true } // Return the updated document and run schema validations
  )
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Admin not found", id });
      }
      res.status(200).json({
        message: "Admin updated successfully",
        admin: result, // Return the updated admin data
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error updating admin", error: err.message });
    });
});

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

  // Debugging output
  console.log("Query parameters received:", req.body);
  console.log("Built query object:", query);

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

app.post("/delete", (req, res) => {
  const { _id } = req.body;
  AdminModel.findByIdAndDelete(_id)
    .then((result) => {
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
