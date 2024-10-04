const AdminModel = require("../../models/Admin");
const base64 = require("base-64");
const login = async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  AdminModel.findOne({ username })
    .then((admin) => {
      console.log(admin);

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
};

module.exports = { login };
