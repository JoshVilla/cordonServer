import HomepageModel from "../../models/Homepage.js";

export const getHomepageInfo = (req, res) => {
  HomepageModel.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};
