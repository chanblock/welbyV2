import { BASE_URL } from './apiConfig';

export const submitChatImg = async (message, imageBase64, messages) => {
    try {
      const response = await fetch(`${BASE_URL}/api/chat-img/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          image: imageBase64, // Agrega la imagen en base64 al cuerpo de la solicitud
          messages,
        }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  
  export const submitChat = async(message, messages)=>{
  
    try {
      const response = await fetch(`${BASE_URL}/api/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         message,
         messages,
        }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  
  }