import React from 'react';

const ChatHistory = ({ messages, userId }) => (
  <div className="chat-history">
    {messages.length === 0 && <div className="chat-empty">No messages yet.</div>}
    {messages.map((msg, idx) => (
      <div
        key={idx}
        className={`chat-message ${msg.sender === userId ? 'chat-sent' : 'chat-received'}`}
      >
        <div className="chat-meta">
          <span>{msg.sender === userId ? 'You' : msg.sender}</span>
          <span className="chat-time">{msg.time}</span>
        </div>
        <div className="chat-text">{msg.text}</div>
      </div>
    ))}
  </div>
);

export default ChatHistory;