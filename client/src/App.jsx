import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // User input
  const [role, setRole] = useState(null); // Tracks user role

  // Handles role selection
  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    const initialMessage =
      selectedRole === "buyer"
        ? "What are you looking for?"
        : "What item would you like to sell?";
    setMessages([{ sender: "bot", text: initialMessage }]);
  };

  // Handles sending a message
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send user input and role to backend
      const response = await axios.post("http://localhost:5000/chat", {
        input,
        role,
      });

      // Add bot response to chat
      const botMessage = {
        sender: "bot",
        text: response.data.response,
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

    // Clear input field
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg flex flex-col h-[90vh]">
        {!role ? (
          // Role selection screen
          <div className="flex flex-col justify-center items-center p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Are you here to buy or sell?
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => selectRole("buyer")}
                className="px-6 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all"
              >
                Buy
              </button>
              <button
                onClick={() => selectRole("seller")}
                className="px-6 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-all"
              >
                Sell
              </button>
            </div>
          </div>
        ) : (
          // Chat screen
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;
