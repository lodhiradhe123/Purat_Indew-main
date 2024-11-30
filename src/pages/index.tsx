
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from '../App'; // Adjust the path based on your structure
// import '../index.css'; // Adjust the path based on your structure
// import { UserProvider } from '../components/ManageClientss/UserContext'; 


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <UserProvider>
//     <App />
//     <ClientsBoard />
//   </UserProvider>
// );











import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

