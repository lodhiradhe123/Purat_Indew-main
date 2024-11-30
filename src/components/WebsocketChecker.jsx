// WebsocketChecker.jsx
import React, { useState, useEffect } from 'react';

const WebsocketChecker = () => {
  const [websocketStatus, setWebsocketStatus] = useState('unknown');

  const checkWebsocket = () => {
    // Add your WebSocket connection check logic here
    // For example:
    if (window.Echo.connector.connected) {
      setWebsocketStatus('connected');
    } else {
      setWebsocketStatus('disconnected');
    }
  };

  useEffect(() => {
    checkWebsocket();
  }, []);

  return (
    <div>
      <p>WebSocket status: {websocketStatus}</p>
    </div>
  );
};

export default WebsocketChecker;