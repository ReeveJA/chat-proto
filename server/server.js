const express = require("express");
const cors = require("cors");
const nlp = require("compromise");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Chat endpoint
app.post("/chat", (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ message: "Input is required" });
  }

  // Extract keywords using NLP
  const doc = nlp(input);
  const keywords = doc
    .nouns() // Extract nouns
    .out("array")
    .filter((word) => word.length > 2); // Filter short/filler words

  // Create a conversational response
  const botResponse = keywords.length
    ? `You mentioned: ${keywords.join(", ")}. Can I help you with anything else?`
    : "I couldn't identify specific keywords. Can you clarify?";

  // Return response
  res.json({ response: botResponse, keywords });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
