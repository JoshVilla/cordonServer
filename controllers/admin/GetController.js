import AdminModel from "../../models/Admin.js";
const getAdmin = (req, res) => {
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
      // console.log("Result from database:", result);
      res.json(result);
    })
    .catch((err) => {
      console.error("Error during database query:", err);
      res.json(err);
    });
};
export default getAdmin;
