import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const CustomButtonComponent = ({
  title,
  description,
  buttons,
  selectedButtonType,  // This is new, to handle different button types within the component
  addCustomButton,
  handleButtonChange,
  removeButton,
}) => {
  const [selectedButtonType, setSelectedButtonType] = useState('QUICK_REPLY');

  // Function to add a new button based on the currently selected type
  const addButton = () => {
    if (selectedButtonType === 'Custom') {
      addCustomButton({ type: 'QUICK_REPLY', text: '' });
    } else if (selectedButtonType === 'Visit Website') {
      addCustomButton({ type: 'URL', text: '', url: '' });
    } else if (selectedButtonType === 'Call Phone Number') {
      addCustomButton({ type: 'PHONE_NUMBER', text: '', phone_number: '' });
    }
  };
  const addCustomButton = () => {
    const newButton = {
      type: selectedButtonType,
      text: "",
      ...(selectedButtonType === 'URL' && { url: '' }),
      ...(selectedButtonType === 'PHONE_NUMBER' && { phone_number: '' })
    };
    setCustomButtons([...customButtons, newButton]);
  };
  

  return (
    <div>
      <select
  value={selectedButtonType}
  onChange={(e) => setSelectedButtonType(e.target.value)}
>
  <option value="QUICK_REPLY">Custom</option>
  <option value="URL">Visit Website</option>
  <option value="PHONE_NUMBER">Call Phone Number</option>
</select>
{customButtons.map((button, index) => (
  <div key={index}>
    <input
      type="text"
      value={button.text}
      onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
      placeholder="Enter Button Text"
    />
    {button.type === 'URL' && (
      <input
        type="text"
        value={button.url || ''}
        onChange={(e) => handleButtonChange(index, 'url', e.target.value)}
        placeholder="Enter URL"
      />
    )}
    {button.type === 'PHONE_NUMBER' && (
      <input
        type="text"
        value={button.phone_number || ''}
        onChange={(e) => handleButtonChange(index, 'phone_number', e.target.value)}
        placeholder="Enter Phone Number"
      />
    )}
    <button onClick={() => removeCustomButton(index)}>Remove</button>
  </div>
))}

      <h2>{title}</h2>
      <p>{description}</p>
      {buttons.map((button, index) => (
        <div key={index}>
          <input
            type="text"
            value={button.text}
            onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
          />
          {button.type === 'URL' && (
            <input
              type="text"
              value={button.url || ''}
              onChange={(e) => handleButtonChange(index, 'url', e.target.value)}
              placeholder="Enter URL"
            />
          )}
          {button.type === 'PHONE_NUMBER' && (
            <input
              type="text"
              value={button.phone_number || ''}
              onChange={(e) => handleButtonChange(index, 'phone_number', e.target.value)}
              placeholder="Enter Phone Number"
            />
          )}
          <button onClick={() => removeButton(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addButton}>Add Button</button>
    </div>
  );
};


export default CustomButtonComponent;
