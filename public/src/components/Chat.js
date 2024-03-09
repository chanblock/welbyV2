import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chat.css'
import '../styles/Home.css'
import { submitChat,submitChatImg } from '../api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Añade esta línea
  const chatBoxRef = useRef(null);
  const [image, setImage] = useState(null);

 

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
    const data = await submitChat(input, messages)
    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.message }]);
    setInput('');
    setIsLoading(false); // Añade esta línea
    
  };


  const sendMessageImg = async (e) => {
    e.preventDefault();

    if (input.trim() === '') return;
    setIsLoading(true);

    let base64Image = null;
    console.log("Estado actual de image:", image);
    // Si hay una imagen, conviértela a base64
    if (image) {
      console.log("dnetro de img")
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = async () => {
            base64Image = reader.result;
            // Continúa con el envío del mensaje y la imagen
            const data = await submitChatImg(input, base64Image, messages);
            setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.message }]);
            setInput('');
            setImage(null); // Limpia el estado de la imagen
            setIsLoading(false);
        };
        reader.onerror = (error) => {
            console.error('Error al convertir la imagen:', error);
            setIsLoading(false);
        };
    } else {
        // Si no hay imagen, solo envía el mensaje
        const data = await submitChat(input, messages);
        setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.message }]);
        setInput('');
        setIsLoading(false);
    }
    
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
        <form className="chat-input" onSubmit={sendMessageImg}>
        <span className="chat-input-span">
        <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                console.log("Imagen cargada:", e.target.files[0]);
            }} // Actualiza el estado de la imagen
            
          />
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

export default Chat;
