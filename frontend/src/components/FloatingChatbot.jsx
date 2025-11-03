import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import './FloatingChatbot.css';

const API_URL = 'http://localhost:5000/api';

function FloatingChatbot({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m Cog, your productivity assistant. I can help you with time management, study tips, and using Cognify features. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat/message`, {
        message: userMessage,
        context: { userId }
      });

      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Error: ${res.data.error || 'Failed to get response'}`
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Connection error. Make sure the backend is running.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMsg}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="floating-chatbot">
      {/* Chat Window */}
      {isOpen && (
        <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="cog-avatar">🤖</div>
              <div>
                <h3>Cog</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button onClick={() => setIsMinimized(!isMinimized)} className="header-btn">
                <Minimize2 size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} className="header-btn">
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.role}`}>
                    {msg.role === 'assistant' && <div className="message-avatar">🤖</div>}
                    <div className="message-bubble">{msg.content}</div>
                    {msg.role === 'user' && <div className="message-avatar user">You</div>}
                  </div>
                ))}
                {loading && (
                  <div className="chat-message assistant">
                    <div className="message-avatar">🤖</div>
                    <div className="message-bubble typing">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-container">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Cog anything..."
                  disabled={loading}
                  className="chat-input"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="send-btn"
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <MessageCircle size={28} />
          <span className="chat-badge">Cog</span>
        </button>
      )}
    </div>
  );
}

export default FloatingChatbot;
