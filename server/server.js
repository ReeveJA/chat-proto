import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());  // Body parser middleware for JSON

// Initialize the GoogleGenerativeAI with the API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
  const { input, role } = req.body;
  console.log("Received message:", input, "Role:", role);

  try {
    // Start the chat with initial history
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Hello, I am a ${role}.` }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you! How can I assist you today?" }],
        },
      ],
    });

    // Send the user input as a message
    let result = await chat.sendMessage(input);
    console.log("Response from Gemini API:", result.response.text());

    // Return the response to the client
    res.status(200).json({ response: result.response.text() });

  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    res.status(500).json({ error: "Something went wrong with the API call." });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
