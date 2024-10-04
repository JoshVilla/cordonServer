const cloudinary = require("../../config/cloudinaryConfig");
const AdminModel = require("../../models/Admin");
const base64 = require("base-64");
const multer = require("multer");
const path = require("path");

const getPublicIdForCloudinary = (file) => {
  const splitted = file.split("/");
  const public = `${splitted[7]}/${splitted[8]}`;
  const publicId = public.replace(".png", "");

  return publicId;
};

// Set up multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to store uploaded files temporarily
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// Controller function to add an admin
const addAdmin = async (req, res) => {
  try {
    // Access form data and file from req.body and req.file
    const { username, password, isSuperAdmin, createdAt } = req.body;
    const account = await AdminModel.findOne({ username });

    if (account) return res.json("Username Exists");

    // If an avatar was uploaded, upload it to Cloudinary
    const avatarUrl = req.file
      ? (
          await cloudinary.uploader.upload(req.file.path, {
            folder: "admin_avatars",
          })
        ).secure_url
      : null;

    // Create the new admin account
    const newAdmin = await AdminModel.create({
      username,
      password: base64.encode(password),
      isSuperAdmin,
      isActive: 1,
      createdAt,
      publicId: getPublicIdForCloudinary(avatarUrl),
      avatar: avatarUrl,
    });

    return res.json({ message: "Admin Added", data: newAdmin });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Export both multer upload middleware and controller
module.exports = { addAdmin, upload };
