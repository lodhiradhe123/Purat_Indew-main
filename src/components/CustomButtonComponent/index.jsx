import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const CustomButtonComponent = ({
  title,
  description,
  buttons,
  addCustomButton,
  handleButtonChange,
  removeButton,
}) => {
  const [selectedButtonType, setSelectedButtonType] = useState('');

  // Count the existing buttons by type
  const customButtonCount = buttons.filter((btn) => btn.type === 'QUICK_REPLY').length;
  const visitWebsiteCount = buttons.filter((btn) => btn.type === 'URL').length;
  const callPhoneNumberCount = buttons.filter((btn) => btn.type === 'PHONE_NUMBER').length;

  // Validation: Ensure maximum limits for each button type
  const isAddButtonDisabled = () => {
    if (selectedButtonType === 'QUICK_REPLY' && customButtonCount >= 10) return true;
    if (selectedButtonType === 'URL' && visitWebsiteCount >= 2) return true;
    if (selectedButtonType === 'PHONE_NUMBER' && callPhoneNumberCount >= 1) return true;
    return false;
  };

  // Add Button logic based on the selected type
  const handleAddButton = () => {
    if (selectedButtonType) {
      addCustomButton({ type: selectedButtonType });
      setSelectedButtonType(''); // Reset dropdown after adding
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">{title} <span className="text-sm text-gray-400">• Optional</span></h2>
      <p className="text-gray-600 mb-4">{description}</p>

      {/* Display existing buttons */}
      <div className="space-y-4">
        {buttons.map((button, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-4 p-4 border border-gray-300 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Button type label */}
            <div className="flex flex-col space-y-1 w-1/4">
              <label className="text-gray-500 text-sm font-semibold">Type</label>
              <span className="p-2 border rounded-md bg-gray-100">{button.type}</span>
            </div>

            {/* Button text input */}
            <div className="flex-1 flex flex-col space-y-1">
              <label className="text-gray-500 text-sm font-semibold">Button text</label>
              <div className="relative">
                <input
                  type="text"
                  value={button.text}
                  onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                  placeholder="Button Text"
                  className="flex-1 p-2 border rounded-md w-full"
                  maxLength="25"
                />
                <span className="absolute right-2 top-2 text-sm text-gray-500">
                  {button.text.length}/25
                </span>
              </div>
            </div>

            {/* Additional inputs based on button type */}
            {button.type === 'URL' && (
              <div className="flex flex-col space-y-1 w-1/3">
                <label className="text-gray-500 text-sm font-semibold">Website URL</label>
                <input
                  type="text"
                  value={button.url}
                  onChange={(e) => handleButtonChange(index, 'url', e.target.value)}
                  placeholder="Website URL"
                  className="p-2 border rounded-md"
                />
              </div>
            )}

            {button.type === 'PHONE_NUMBER' && (
              <div className="flex flex-col space-y-1 w-1/3">
                <label className="text-gray-500 text-sm font-semibold">Phone Number</label>
                <input
                  type="text"
                  value={button.phone_number}
                  onChange={(e) => handleButtonChange(index, 'phone_number', e.target.value)}
                  placeholder="Phone Number"
                  className="p-2 border rounded-md"
                />
              </div>
            )}

            {/* Remove Button */}
            <button
              onClick={() => removeButton(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Dropdown to select a button type */}
      <div className="mt-4">
        <select
          value={selectedButtonType}
          onChange={(e) => setSelectedButtonType(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="" disabled>Select Button Type</option>
          <option value="QUICK_REPLY">Custom</option>
          <option value="URL">Visit Website</option>
          <option value="PHONE_NUMBER">Call Phone Number</option>
        </select>

        {/* Button to add the selected button */}
        <button
          onClick={handleAddButton}
          disabled={isAddButtonDisabled()} // Disable based on validation
          className={`ml-4 px-4 py-2 rounded-md text-white ${isAddButtonDisabled() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Button
        </button>

        {/* Validation messages */}
        <div className="text-sm text-red-500 mt-2">
          {customButtonCount >= 10 && selectedButtonType === 'QUICK_REPLY' && "Maximum 10 QUICK_REPLY buttons allowed."}
          {visitWebsiteCount >= 2 && selectedButtonType === 'URL' && "Maximum 2 URL buttons allowed."}
          {callPhoneNumberCount >= 1 && selectedButtonType === 'PHONE_NUMBER' && "Maximum 1 PHONE_NUMBER button allowed."}
        </div>
      </div>
    </div>
  );
};

export default CustomButtonComponent;
