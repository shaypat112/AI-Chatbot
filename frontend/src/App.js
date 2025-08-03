import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./custom.css";

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const updatedMessages = [...messages, { sender: "user", text: input }];
    setMessages(updatedMessages);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
      });
      const reply = res.data.response;
      setMessages([...updatedMessages, { sender: "bot", text: reply }]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { sender: "bot", text: "❌ Sorry, I couldn't connect to the server." }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">   Chatbot  </h2>
        <button
          onClick={() => setMessages([])}
          className="new-chat-btn"
        >
          + New Chat
        </button>
        <div className="sidebar-footer">
          Made by Shivang @2025
        </div>
      </aside>

      {/* Chat Area */}
      <main className="chat-area">
        <div className="messages-container">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="input-bar">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button
            onClick={sendMessage}
            className="send-btn"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
