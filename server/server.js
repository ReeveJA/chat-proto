const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Function to extract keywords
const extractKeywords = (input) => {
  const fillerWords = ["the", "is", "a", "of", "to", "and", "for", "it", "on", "in", "at"];
  return input
    .toLowerCase()
    .split(" ")
    .filter((word) => !fillerWords.includes(word) && word.trim() !== "");
};

// Route to handle chat
app.post("/chat", (req, res) => {
  const userInput = req.body.input;
  if (!userInput) {
    return res.status(400).json({ error: "No input provided" });
  }

  const keywords = extractKeywords(userInput);
  res.json({ keywords });
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
