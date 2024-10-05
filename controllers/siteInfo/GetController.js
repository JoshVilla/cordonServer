const SiteInfoModel = require("../../models/SiteInfo");

const getSiteInfo = (req, res) => {
  SiteInfoModel.find()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "An error occurred while fetching site info" });
    });
};

module.exports = { getSiteInfo };
