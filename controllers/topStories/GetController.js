const TopStoriesModel = require("../../models/TopStories");

const getTopStories = async (req, res) => {
  TopStoriesModel.find()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "An error occurred while fetching site info" });
    });
};

module.exports = { getTopStories };
