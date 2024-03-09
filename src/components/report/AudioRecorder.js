import React, { useState, useRef } from 'react';

function AudioRecorder(props) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorder = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

       // Agregar estas líneas para escuchar en tiempo real
    const audioElement = new Audio();
    audioElement.srcObject = stream;
    audioElement.play()
    
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.current.ondataavailable = event => {
        chunks.push(event.data);
      };
      mediaRecorder.current.onstop = () => {
        const completeBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(completeBlob);
      };
      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
       // Desconectar el micrófono
    mediaRecorder.current.stream.getTracks().forEach(track => track.stop());

      setRecording(false);
    }
  };

  return (
    <div>
      {recording ? (
        <button onClick={stopRecording}>Detener grabación</button>
      ) : (
        <button onClick={startRecording}>Iniciar grabación</button>
      )}
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
    </div>
  );
}

export default AudioRecorder;
