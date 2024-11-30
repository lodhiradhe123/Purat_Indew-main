// src/containers/YourIntegration/OfficialWhatsApp.js

import React from 'react';

const OfficialWhatsApp = () => {
  return (
    <form className="space-y-4">
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 w-1/6 mr-3">Access Token : </label>
        <input type="text" className="mt-1 p-2 border rounded w-1/4" />
      </div>
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 w-1/6 mr-3">Phone Number ID : </label>
        <input type="text" className="mt-1 p-2 border rounded w-1/4" />
      </div>
      <div className="flex items-center">
        <label className="block text-sm font-medium text-gray-700 w-1/6 mr-3">WhatsApp Business Account ID :</label>
        <input type="text" className="mt-1 p-2 border rounded w-1/4" />
      </div>
    </form>
  );
};

export default OfficialWhatsApp;

