// src/containers/YourIntegration/Voice.js


// const Voice = () => {
//   return (
//     <form className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">API Endpoint</label>
//         <input type="text" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">API Authentication</label>
//         <input type="text" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Username</label>
//         <input type="text" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Password</label>
//         <input type="password" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Report Statuses</label>
//         <input type="text" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">SIP Username</label>
//         <input type="text" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">SIP Password</label>
//         <input type="password" className="mt-1 p-2 w-full border rounded" />
//       </div>
//     </form>
//   );
// };

// export default Voice;










import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Voice = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSIPPassword, setShowSIPPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowSIPPassword = () => setShowSIPPassword(!showSIPPassword);

  return (
    <form className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/4">API Endpoint : </label>
          <input type="text" className="mt-1 p-2 border rounded w-3/4" />
        </div>
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/4">API Authentication : </label>
          <input type="text" className="mt-1 p-2 border rounded w-3/4" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/4">Username : </label>
          <input type="text" className="mt-1 p-2 border rounded w-3/4" />
        </div>
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/4">Password : </label>
          <div className="relative w-3/4">
            <input
              type={showPassword ? 'text' : 'password'}
              className="mt-1 p-2 border rounded w-full"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/4">Report Statuses : </label>
          <input type="text" className="mt-1 p-2 border rounded w-3/4" />
        </div>
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/4">SIP Username : </label>
          <input type="text" className="mt-1 p-2 border rounded w-3/4" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/4">SIP Password : </label>
          <div className="relative w-3/4">
            <input
              type={showSIPPassword ? 'text' : 'password'}
              className="mt-1 p-2 border rounded w-full"
            />
            <button
              type="button"
              onClick={toggleShowSIPPassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              <FontAwesomeIcon icon={showSIPPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Voice;
