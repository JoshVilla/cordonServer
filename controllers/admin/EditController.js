const AdminModel = require("../../models/Admin");
const base64 = require("base-64");
const editAdmin = (req, res) => {
  const { id, username, password, isSuperAdmin } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Admin ID is required" });
  }

  // Create the update data object
  let newAdminData = {};
  if (username) newAdminData.username = username;
  if (password) newAdminData.password = base64.encode(password);
  if (isSuperAdmin !== undefined) newAdminData.isSuperAdmin = isSuperAdmin;

  AdminModel.findById(id).then((result) => {
    console.log(result.publicId, "@@@RESULT");
  });

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
};

module.exports = { editAdmin };
