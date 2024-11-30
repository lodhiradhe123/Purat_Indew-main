// src/containers/YourIntegration/SMS.js



import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SMS = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <form className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/5">SMPP Username :</label>
          <input type="text" className="mt-1 p-2 border rounded w-2/3" />
        </div>
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/5">SMPP Password :</label>
          <div className="relative w-2/3">
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
      <div className="flex items-center space-x-2">
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/5">SMPP Port :</label>
          <input type="text" className="mt-1 p-2 border rounded w-2/3" />
        </div>
        <div className="flex items-center w-1/2">
          <label className="block text-sm font-medium text-gray-700 w-1/5">SMPP Endpoint/URL :</label>
          <input type="text" className="mt-1 p-2 border rounded w-2/3" />
        </div>
      </div>
    </form>
  );
};

export default SMS;

