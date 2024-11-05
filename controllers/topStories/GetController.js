import TopStoriesModel from "../../models/TopStories.js";
import moment from "moment";

const getTopStories = async (req, res) => {
  const { title, dates, id, page = 1, limit = 10 } = req.body; // Set default values for page and limit
  const params = {};
  const pageSize = parseInt(limit, 10); // Number of items per page
  const pageNumber = parseInt(page, 10); // Current page number

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
    // Count total documents based on filters
    const totalData = await TopStoriesModel.countDocuments(params);

    // Apply pagination
    const result = await TopStoriesModel.find(params)
      .skip((pageNumber - 1) * pageSize) // Skip previous pages
      .limit(pageSize); // Limit to page size

    return res.status(200).json({
      data: result,
      totalData,
      pageSize: result.length,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalData / pageSize),
    });
  } catch (err) {
    console.error("Error fetching top stories:", err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching top stories." });
  }
};

export default getTopStories;
