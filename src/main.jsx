// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';
// import Echo from 'laravel-echo';
// // import Pusher from 'pusher-js'; // Import Pusher
// window.io = require('socket.io-client');

// // Initialize Laravel Echo with Pusher-like settings for WebSockets
// const initEcho = () => {
//   // window.Echo = new Echo({
//   //   broadcaster: 'pusher',
//   //   key: import.meta.env.VITE_PUSHER_KEY, // Correct key access
//   //   cluster: import.meta.env.VITE_PUSHER_CLUSTER, // Set the Pusher cluster
//   //   wsHost: import.meta.env.VITE_WS_HOST || 'wa30.nuke.co.in',
//   //   wsPort: import.meta.env.VITE_WS_PORT || 6001,
//   //   wssPort: import.meta.env.VITE_WSS_PORT || 6001,
//   //   forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'http', // Use TLS if scheme is https
//   //   disableStats: true, // Disable stats for better performance
//   //   enabledTransports: ['ws', 'wss'], // WebSocket and Secure WebSocket
//   //   pusher: Pusher, // Explicitly pass Pusher to Echo
//   // });
// //   window.Echo = new Echo({
// //     broadcaster: 'pusher',
// //     key: 'e28ea2c03363bcb50762a54c53a6270e',  // Your app key
// //     cluster: 'mt1',  // Add the correct Pusher cluster here
// //     wsHost: '182.71.43.74',  // Public IP or domain of your WebSocket server
// //     wsPort: 6001,
// //     forceTLS: false,  // Set to true if you're using SSL
// //     disableStats: true,
// // });

// window.Echo = new Echo({
//   broadcaster: 'socket.io',
//   host: window.location.hostname + ':6001' // This should match the port you set up for Laravel Websockets
// });

// };

// // Render React App
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );

// // Initialize Echo after the app has mounted
// initEcho();


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// import Echo from 'laravel-echo';
// import io from 'socket.io-client'; // Import socket.io client

// // Initialize Laravel Echo with Socket.IO settings for WebSockets
// const initEcho = () => {
//   const host = import.meta.env.VITE_WS_HOST || window.location.hostname; // Use environment variable or fallback to current hostname
//   const port = import.meta.env.VITE_WS_PORT || 6001; // Set WebSocket port via environment or default to 6001
  
//   window.Echo = new Echo({
//     broadcaster: 'socket.io',
//     host: `${host}:${port}`, // Construct full WebSocket URL
//     client: io // Pass the imported socket.io client directly
//   });
// };

// Render React App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Initialize Echo after the app has mounted
// initEcho();
