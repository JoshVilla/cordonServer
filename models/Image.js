const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  title: String,
  imageUrl: String, // Store the Mega.io URL here
});

const Image = mongoose.model("Image", imageSchema);

// Example of storing the URL in MongoDB
app.post("/save-image-url", (req, res) => {
  const newImage = new Image({
    title: req.body.title,
    imageUrl: req.body.imageUrl, // URL obtained from Mega.io
  });

  newImage.save().then(() => res.json(newImage));
});
