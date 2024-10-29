import HomepageModel from "../../models/Homepage.js";

const getHomepageInfo = (req, res) => {
  HomepageModel.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
};

export default getHomepageInfo;
