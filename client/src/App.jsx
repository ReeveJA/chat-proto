import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "What are you looking for?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send input to backend
      const response = await axios.post("http://localhost:5000/chat", { input });

      // Add bot response
      const botMessage = {
        sender: "bot",
        text: response.data.response, // Conversational bot response
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        sender: "bot",
        text: "Something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg flex flex-col h-[90vh]">
        <div className="p-4 border-b bg-blue-500 text-white text-center text-lg font-semibold">
          AI Chatbot
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-sm px-4 py-2 rounded-3xl ${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-gray-800 shadow-sm"
                    : "bg-blue-500 text-white shadow-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-100 border-t flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="ml-4 bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
