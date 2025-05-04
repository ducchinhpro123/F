import React, { useState } from 'react';
import RenderUserAvatar from '../../components/common/renderUserAvatar';
import Markdown from 'react-markdown'
import { api } from '../../services/api';

import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([{ text: "Xin chào!", sender: 'bot' }]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    const message = input.trim();
    if (message) {
      setMessages(prev => [...prev, { text: message, sender: 'user' }]);
      // setMessages([...messages, { text: message, sender: 'user' }]);
      setInput('');

      const response = await api.post('/chat/send-message', { message: message });
      if (response) {
        // console.log(response.message);
        // setMessages([...messages, { text: response.message, sender: 'bot' }]);
        setMessages(prev => [...prev, { text: response.message, sender: 'bot' }]);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-display">
        {messages.map((msg, index) => (
          <div key={index} className="message-row" style={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.sender === 'bot' && (
              <div className="avatar bot">
                <img src="/bot-svgrepo-com.svg" alt="Bot Avatar" style={{ width: '100%', height: '100%' }} />
              </div>
            )}

            <div className={`message ${msg.sender}`}>
              <Markdown>
                {msg.text}
              </Markdown>
            </div>

            {msg.sender === 'user' && (
              <div className="avatar user">
                <RenderUserAvatar />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
