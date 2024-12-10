import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser middleware for JSON

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Initialize the GoogleGenerativeAI with the API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Chat Endpoint
app.post("/chat", async (req, res) => {
  const { input, role } = req.body;
  console.log("Received message:", input, "Role:", role);

  try {
    // Start the chat with initial history
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Hello, I am a ${role}. I want to negotiate a deal.` }],
        },
        {
          role: "model",
          parts: [{ text: "I'm ready to help you negotiate effectively. What are the details?" }],
        },
      ],
    });

    // Send the user input as a message
    let result = await chat.sendMessage(input);
    const response = result.response.text();

    console.log("Response from Gemini API:", response);

    // Return the response to the client
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    res.status(500).json({ error: "Something went wrong with the API call." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;