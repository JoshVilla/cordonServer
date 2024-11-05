import TopStoriesModel from "../../models/TopStories.js";
import moment from "moment";

const getTopStories = async (req, res) => {
  const { title, dates, id } = req.body;
  const params = {};

  if (title) params.title = title;
  if (id) params._id = id;

  const { start, end } = dates || {};
  if (start && end) {
    params.createdAt = {
      $gte: moment(start).format("MMMM D, YYYY"),
      $lte: moment(end).format("MMMM D, YYYY"),
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

export default getTopStories;
