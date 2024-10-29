import TopStoriesModel from "../../models/TopStories.js";

const updateDisplay = async (req, res) => {
  try {
    const { isDisplayed, id } = req.body;

    const updatedStory = await TopStoriesModel.findByIdAndUpdate(
      id,
      { isDisplayed },
      { new: true } // This option returns the updated document
    );

    if (!updatedStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ message: "Update Successfully", updatedStory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export default updateDisplay;
