import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chat.css'
import '../styles/Home.css'
import { submitChat, submitChatToAustralia } from '../api';

const ToDoAustralia = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Añade esta línea
  const chatBoxRef = useRef(null);
 

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (input.trim() === '') return;
    setIsLoading(true); // Añade esta línea
    // Lógica para enviar mensajes y obtener respuesta del servidor
    // ...
    // Añade tu lógica aquí
    const data = await submitChatToAustralia(input)
    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.message }]);
    setInput('');
    setIsLoading(false); // Añade esta línea
    
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="chat-outer-container">
      <div className="chat-container">
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role === 'user' ? 'user' : 'ai'}`}>
              {message.content}
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={sendMessage}>
        <span className="chat-input-span">
            <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                
            />
            {isLoading && <div className="spinner"></div>}
          </span>  
            <button type="submit" className="main-view-btn-info" >
                Send
            </button>
        </form>
      </div>
    </div>
  );
}

export default ToDoAustralia;
