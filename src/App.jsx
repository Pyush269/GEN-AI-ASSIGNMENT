import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, MessageSquare, Code, Rocket, AlertCircle } from 'lucide-react';
import { PERSONAS } from './data/personas';
import { sendMessage } from './services/api';

const App = () => {
  const [activePersonaId, setActivePersonaId] = useState('anshuman');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const chatEndRef = useRef(null);
  const activePersona = PERSONAS[activePersonaId];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Reset chat when persona changes
  useEffect(() => {
    setMessages([{
      role: 'bot',
      text: `Hey! I'm ${activePersona.name}. ${activePersona.description} How can I help you today?`,
      timestamp: new Date()
    }]);
    setError(null);
  }, [activePersonaId]);

  const handleSend = async (text) => {
    const messageToSend = text || inputText;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = { role: 'user', text: messageToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendMessage(activePersona, messageToSend, messages);
      const botMessage = { role: 'bot', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ 
      '--active-color': activePersona.color,
      '--active-gradient': activePersona.gradient 
    }}>
      {/* Header / Persona Switcher */}
      <div className="switcher-container">
        {Object.values(PERSONAS).map((p) => (
          <button
            key={p.id}
            className={`persona-tab ${activePersonaId === p.id ? 'active' : ''}`}
            onClick={() => setActivePersonaId(p.id)}
          >
            {p.id === 'anshuman' && <Code size={18} />}
            {p.id === 'abhimanyu' && <Rocket size={18} />}
            {p.id === 'kshitij' && <Sparkles size={18} />}
            <span>{p.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Chat History */}
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-bubble ${msg.role}`}>
            {msg.role === 'bot' && (
              <div className="bot-info">
                <Bot size={14} />
                <span>{activePersona.name}</span>
              </div>
            )}
            <div className="text-content">{msg.text}</div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message-bubble bot">
            <div className="bot-info">
              <Bot size={14} />
              <span>{activePersona.name} is thinking...</span>
            </div>
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message" style={{ 
            color: '#ff4444', 
            padding: '10px', 
            background: 'rgba(255,0,0,0.1)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {!isLoading && messages.length <= 1 && (
        <div className="chips-container">
          {activePersona.suggestionChips.map((chip, idx) => (
            <div 
              key={idx} 
              className="chip"
              onClick={() => handleSend(chip)}
            >
              {chip}
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form 
        className="input-container" 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
      >
        <input
          type="text"
          className="message-input"
          placeholder={`Message ${activePersona.name}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !inputText.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default App;
