const TopStoriesModel = require("../../models/TopStories");
const moment = require("moment");

const getTopStories = async (req, res) => {
  const { title, dates } = req.body;
  const params = {};

  // Add title filter if provided
  if (title) params.title = title;

  // Add date range filter if provided and valid
  const { start, end } = dates || {};
  if (start && end) {
    params.createdAt = {
      $gte: moment(start).format("MMMM D, YYYY"), // Start of the day
      $lte: moment(end).format("MMMM D, YYYY"), // End of the day
    };
  }

  try {
    const result = await TopStoriesModel.find(params);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching top stories:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching top stories." });
  }
};

module.exports = { getTopStories };
