// src/containers/Profile/MessageDeletion/index.js
import React, { useState } from 'react';

const MessageDeletion = () => {
  const [autoDeleteSettings, setAutoDeleteSettings] = useState({
    media: false,
    mediaDays: 100,
    text: false,
    textDays: 100,
    contacts: false,
    contactsDays: 100,
  });

  const [manualDeleteSettings, setManualDeleteSettings] = useState({
    type: 'Text',
    days: 100,
  });

  const handleAutoDeleteChange = (e) => {
    const { name, value, checked, type } = e.target;
    setAutoDeleteSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleManualDeleteChange = (e) => {
    const { name, value } = e.target;
    setManualDeleteSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAutoDelete = () => {
    alert('Auto Deletion Settings Saved');
    // Save to localStorage or server as needed
  };

  const handleFindMessages = () => {
    alert('Finding Messages');
    // Logic to find messages based on criteria
  };

  return (
    <div className="p-6 bg-blue rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Auto-deletion settings</h2>
      <form className="space-y-4 mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="media"
            checked={autoDeleteSettings.media}
            onChange={handleAutoDeleteChange}
            className="h-4 w-4"
          />
          <label className="text-sm font-medium text-gray-700">
            Auto-delete all <span className="text-blue-400">Media</span> messages older than
          </label>
          <input
            type="number"
            name="mediaDays"
            value={autoDeleteSettings.mediaDays}
            onChange={handleAutoDeleteChange}
            className="p-2 border rounded w-16"
          />
          <span className="text-sm">days</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="text"
            checked={autoDeleteSettings.text}
            onChange={handleAutoDeleteChange}
            className="h-4 w-4"
          />
          <label className="text-sm font-medium text-gray-700">
            Auto-delete all <span className="text-blue-400">Text</span> messages older than
          </label>
          <input
            type="number"
            name="textDays"
            value={autoDeleteSettings.textDays}
            onChange={handleAutoDeleteChange}
            className="p-2 border rounded w-16"
          />
          <span className="text-sm">days</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="contacts"
            checked={autoDeleteSettings.contacts}
            onChange={handleAutoDeleteChange}
            className="h-4 w-4"
          />
          <label className="text-sm font-medium text-gray-700">
            Auto-delete all <span className="text-blue-400">Contacts</span> messages older than
          </label>
          <input
            type="number"
            name="contactsDays"
            value={autoDeleteSettings.contactsDays}
            onChange={handleAutoDeleteChange}
            className="p-2 border rounded w-16"
          />
          <span className="text-sm">days</span>
        </div>
        <button
          type="button"
          onClick={handleSaveAutoDelete}
          className="mt-4 p-2 bg-blue-500 w-24 text-white rounded"
        >
          Save
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Manual message deletion</h2>
      <form className="space-y-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Find all</label>
          <select
            name="type"
            value={manualDeleteSettings.type}
            onChange={handleManualDeleteChange}
            className="p-2 border rounded"
          >
            <option value="Text">Text</option>
            <option value="Media">Media</option>
            <option value="Contacts">Contacts</option>
          </select>
          <label className="text-sm font-medium text-gray-700">messages older than</label>
          <input
            type="number"
            name="days"
            value={manualDeleteSettings.days}
            onChange={handleManualDeleteChange}
            className="p-2 border rounded w-16"
          />
          <span className="text-sm">days</span>
          <button
            type="button"
            onClick={handleFindMessages}
            className="p-2 bg-blue-500 text-white rounded w-24"
          >
            Find
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageDeletion;

