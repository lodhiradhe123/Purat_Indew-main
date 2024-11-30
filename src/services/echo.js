

// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// // Set Pusher as global constructor for Echo
// window.Pusher = Pusher;

// // const initializeEcho = () => {
// //     return new Echo({
// //         broadcaster: 'pusher',
// //         key: process.env.REACT_APP_PUSHER_KEY,  // Use the environment variable
// //         wsHost: process.env.REACT_APP_WS_HOST,
// //         wsPort: parseInt(process.env.REACT_APP_WS_PORT, 10),
// //         wssPort: parseInt(process.env.REACT_APP_WSS_PORT, 10),
// //         disableStats: true,
// //         enabledTransports: ['ws', 'wss'],  // Limiting to WebSocket only
// //         forceTLS: process.env.REACT_APP_FORCE_TLS === 'true',  // Based on environment variable
// //         cluster: process.env.REACT_APP_PUSHER_CLUSTER  // Optional, remove if not needed
// //     });
// // };



// const initializeEcho = () => {
//     const pusherKey = typeof process !== 'undefined' ? process.env.REACT_APP_PUSHER_KEY : 'fallback_key_here';
  
//     return new Echo({
//       broadcaster: 'pusher',
//       key: pusherKey,
//       wsHost: '182.71.43.74',
//       wsPort: 6001,
//       wssPort: 6001,
//       disableStats: true,
//       enabledTransports: ['ws', 'wss'],
//       forceTLS: false,
//       cluster: 'mt1'
//     });
//   };
//   export default initializeEcho;
  