const HomepageModel = require("../../models/Homepage");

const getHomepageInfo = (req, res) => {
  HomepageModel.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports = { getHomepageInfo };
