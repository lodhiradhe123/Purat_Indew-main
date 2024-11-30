import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold, faItalic, faStrikethrough, faCode, faSmile, faFileAlt, faVideo,
  faMapMarkerAlt, faCameraAlt, faLink, faPhone, faCheck, faClipboard, faBullhorn, faBell, faKey
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CustomButtonComponent from '../CustomButtonComponent';
import background from '../../../public/assets/images/png/image.png';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import {
  templateData,
} from "../../services/api";

// Constants for placeholder media images
const placeholderMedia = {
  Document: 'https://via.placeholder.com/150?text=Document',
  Video: 'https://via.placeholder.com/150?text=Video',
  Location: 'https://via.placeholder.com/150?text=Location',
  Image: 'https://via.placeholder.com/150',
};

// Reusable Card component for displaying category options
const Card = ({ icon, title, description, options, selectedOption, onOptionChange }) => (
  <motion.div
    className="bg-white rounded-lg border border-gray-400 p-6 transition-all duration-300 ease-in-out"
    whileHover={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center mb-4">
      <FontAwesomeIcon icon={icon} className="text-blue-500 text-2xl" />
      <h2 className="ml-3 text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    {description && <p className="text-gray-600 mb-4 text-sm">{description}</p>}
    <div className="space-y-2">
      {options.map((option) => (
        <motion.button
          key={option}
          className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm ${selectedOption === option
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          onClick={() => onOptionChange(option)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {option}
        </motion.button>
      ))}
    </div>
  </motion.div>
);

const EditTemplate = ({ user, name, selectedLanguage }) => {
  // State variables
  const [message, setMessage] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [customButtons, setCustomButtons] = useState([]);
  const [visitWebsiteButtons, setVisitWebsiteButtons] = useState([]);
  const [phoneNumberButtons, setPhoneNumberButtons] = useState([]);
  const [completeFlowButtons, setCompleteFlowButtons] = useState([]);
  const [copyOfferCodeButtons, setCopyOfferCodeButtons] = useState([]);
  const [previewMessages, setPreviewMessages] = useState([]);
  const [previewCallToAction, setPreviewCallToAction] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [carouselItems, setCarouselItems] = useState([{ media: '', body: '', buttons: [] }]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedHeaderMedia, setSelectedHeaderMedia] = useState('');
  const [variableCounter, setVariableCounter] = useState(1);

  const navigate = useNavigate();

  // Input handlers
  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    const forbiddenWords = ["abuse", "gambling"];
    const containsForbiddenWords = forbiddenWords.some(word => newMessage.toLowerCase().includes(word));

    if (!containsForbiddenWords) {
      setMessage(newMessage);
    } else {
      alert('Your message contains forbidden words.');
    }
  };


  const handleHeaderTextChange = (e) => setHeaderText(e.target.value);
  const handleFooterTextChange = (e) => setFooterText(e.target.value);
  const handleOptionChange = (option) => setSelectedOption(option);
  const handleEmojiClick = (emojiObject) => setMessage(prevMessage => prevMessage + emojiObject.emoji);

  const handleHeaderMediaSelect = (mediaType) => setSelectedHeaderMedia(mediaType);

 
  const handleCallToActionClick = (buttonText) => setPreviewCallToAction([...previewCallToAction, buttonText]);

  // Function to handle changes in carousel cards
  const handleCardChange = (index, key, value) => {
    const updatedItems = [...carouselItems];
    updatedItems[index][key] = value;
    setCarouselItems(updatedItems);
  };

  // Functions to add/remove carousel cards
  const addCard = () => {
    if (carouselItems.length < 10) {
      setCarouselItems([...carouselItems, { media: '', body: '', buttons: [] }]);
    }
  };

  const removeCard = (index) => {
    setCarouselItems(carouselItems.filter((_, i) => i !== index));
  };

  // Functions to handle carousel buttons
  const addCarouselButton = (index) => {
    const updatedItems = [...carouselItems];
    if (updatedItems[index].buttons.length < 3) {
      updatedItems[index].buttons.push({ type: 'Custom', text: '', url: '', websiteType: '', country: '', phoneNumber: '', offerCode: '' });
      setCarouselItems(updatedItems);
    } else {
      alert('You can add only up to 3 buttons per carousel item.');
    }
  };

  const handleCarouselButtonChange = (cardIndex, buttonIndex, key, value) => {
    const updatedItems = [...carouselItems];
    updatedItems[cardIndex].buttons[buttonIndex][key] = value;
    setCarouselItems(updatedItems);
  };

  const removeCardButton = (cardIndex, buttonIndex) => {
    const updatedItems = [...carouselItems];
    updatedItems[cardIndex].buttons = updatedItems[cardIndex].buttons.filter((_, i) => i !== buttonIndex);
    setCarouselItems(updatedItems);
  };

  // Functions to handle custom buttons
  const addCustomButton = (buttonConfig = { type: 'Custom' }) => {
    setCustomButtons([...customButtons, { ...buttonConfig, text: '' }]);
  };
  

  const addVisitWebsiteButton = () => {
    if (visitWebsiteButtons.length < 2) {
      const newButton = { type: 'visitwebsite', text: '' };
      setVisitWebsiteButtons([...visitWebsiteButtons, newButton]);
      handleCallToActionClick('Visit Website ' + (visitWebsiteButtons.length + 1));
    }
  };

  const addPhoneNumberButton = () => {
    if (phoneNumberButtons.length < 1) {
      const newButton = { type: 'callphonenumber', text: '' };
      setPhoneNumberButtons([...phoneNumberButtons, newButton]);
      handleCallToActionClick('PhoneNumber ' + (phoneNumberButtons.length + 1));
    }
  };

  const addCompleteFlowButton = () => {
    if (completeFlowButtons.length < 1) {
      const newButton = { type: 'completeflow', text: '' };
      setCompleteFlowButtons([...completeFlowButtons, newButton]);
      handleCallToActionClick('Complete Flow ' + (completeFlowButtons.length + 1));
    }
  };

  const addCopyOfferCodeButton = () => {
    if (copyOfferCodeButtons.length < 1) {
      const newButton = { type: 'copyoffercode', text: '' };
      setCopyOfferCodeButtons([...copyOfferCodeButtons, newButton]);
      handleCallToActionClick('Copy Offer Code ' + (copyOfferCodeButtons.length + 1));
    }
  };

  const handleCustomButtonChange = (index, key, value) => {
    const updatedButtons = customButtons.map((button, i) => {
      if (i === index) {
        return { ...button, [key]: value };
      }
      return button;
    });
    setCustomButtons(updatedButtons);
    if (key === 'text') {
      const updatedMessages = previewMessages.map((msg, i) => {
        if (i === index) {
          return value;
        }
        return msg;
      });
      setPreviewMessages(updatedMessages);
    }
  };







 

  const removeCustomButton = (index) => {
    setCustomButtons(customButtons.filter((_, i) => i !== index));
    setPreviewMessages(previewMessages.filter((_, i) => i !== index));
  };



 





  // Submit function to handle form submission
  const handleSubmit = async () => {
    let category;
    switch (selectedOption) {
      case 'Custom':
        category = 1;
        break;
      case 'customUtility':
        category = 2;
        break;
      case 'customAuth':
        category = 3;
        break;
      default:
        category = 1;
    }
  
    // Validate carousel length
    if (carouselItems.length > 10) {
      alert('The carousels field must not have more than 10 items.');
      return;
    }
  
    // Map buttons to the required format for quick_replies
    const quickReplies = [
      // Map custom buttons as QUICK_REPLY
      ...customButtons.map(button => ({
        type: "QUICK_REPLY",
        text: button.text
      })),
      
      // Map phone number buttons as PHONE_NUMBER
      ...phoneNumberButtons.map(button => ({
        type: "PHONE_NUMBER",
        text: button.text,
        phone_number: button.phoneNumber
      })),
      
      // Map visit website buttons as URL
      ...visitWebsiteButtons.map(button => ({
        type: "URL",
        text: button.text,
        url: button.url
      }))
    ];
  
    try {
      const response = await templateData({
        action: 'create',
        username: user.username,
        template_name: name,
        category: category,
        language: selectedLanguage,
        template_body: message,
        template_footer: footerText,
        header_area_type: selectedHeaderMedia ? 'media' : 'text',
        header_text: selectedHeaderMedia === 'Header Text' ? headerText : '',
        header_media_type: selectedHeaderMedia,
        quick_replies: quickReplies, // Send the transformed buttons here
        carousels: carouselItems.map(item => ({
          media: item.media,
          body: item.body,
          buttons: item.buttons
        }))
      });
  
      console.log('Response:', response);
      if (response.status === 201 || response.status === '1') {
        navigate('/dashboard/whatsapp/broadcast');
      } else {
        alert('There was an issue submitting the template.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  



  // Carousel responsiveness settings
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  // Function to insert text in the textarea with tags for formatting and variables
  const insertText = (startTag, endTag = '', type = '') => {
    const textarea = document.getElementById('messageTextArea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    if (type === 'variable') {
      if (variableCounter > 10) return;
      const variableText = `{{${variableCounter}}}`;
      setVariableCounter(variableCounter + 1);
      const newText = text.substring(0, start) + variableText + text.substring(end);
      setMessage(newText);
    } else {
      const selectedText = text.substring(start, end);
      const newText = text.substring(0, start) + startTag + selectedText + endTag + text.substring(end);
      setMessage(newText);
    }
  };
  const handleButtonChange = (type, index, key, value) => {
    // Depending on the button type (custom, visitwebsite, callphonenumber), update the respective button list.
    if (type === 'Custom') {
      const updatedButtons = [...customButtons];
      updatedButtons[index] = {
        ...updatedButtons[index],
        [key]: value, // Update the specific field (text, url, etc.)
      };
      setCustomButtons(updatedButtons);
    } else if (type === 'visitwebsite') {
      const updatedButtons = [...visitWebsiteButtons];
      updatedButtons[index] = {
        ...updatedButtons[index],
        [key]: value,
      };
      setVisitWebsiteButtons(updatedButtons);
    } else if (type === 'callphonenumber') {
      const updatedButtons = [...phoneNumberButtons];
      updatedButtons[index] = {
        ...updatedButtons[index],
        [key]: value,
      };
      setPhoneNumberButtons(updatedButtons);
    }
  };
  

  return (
    < >
      <div className="w-full flex flex-col lg:flex-row gap-4 bg-white">

        {/* Main edit template section */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full md:w-3/3 p-8 bg-white rounded-lg shadow-md"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Edit Template: {name}</h2>

            <button
              className="px-4 py-2  bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>

          {/* Category section */}
          <div className="mb-6 mt-6">
            <h2 className="text-2xl font-bold mb-2">Category</h2>

            <p className="text-gray-600 mb-4">
              Choose a category that best describes your message template.
              <span className="text-blue-500 cursor-pointer ml-2">
                Learn more about category
              </span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
              <Card
                icon={faBullhorn}
                title="Marketing"
                options={['Custom', 'Catalogue', 'Carousel']}
                selectedOption={selectedOption}
                onOptionChange={handleOptionChange}
              />
              <Card
                icon={faBell}
                title="Utility"
                description="Messages about a specific transaction, account, order or customer request."
                options={['customUtility']}
                selectedOption={selectedOption}
                onOptionChange={handleOptionChange}
              />
              <Card
                icon={faKey}
                title="Authentication"
                description="One-time passwords that your customers use to authenticate a transaction or login."
                options={['customAuth']}
                selectedOption={selectedOption}
                onOptionChange={handleOptionChange}
              />
            </div>
          </div>

          {/* Body section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Body</h3>
            <textarea
              id="messageTextArea"
              value={message}
              onChange={handleInputChange}
              placeholder="Enter Template Message"
              className="w-full p-2 border border-gray-400 rounded-lg"
              rows="6"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">Characters: {message.length}/1024</span>
              <div className="flex space-x-2">
                <FontAwesomeIcon icon={faBold} className="text-gray-500 cursor-pointer" onClick={() => insertText('*', '*')} />
                <FontAwesomeIcon icon={faItalic} className="text-gray-500 cursor-pointer" onClick={() => insertText('~', '~')} />

                <FontAwesomeIcon icon={faSmile} className="text-gray-500 cursor-pointer" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
                <button className="text-blue-500" onClick={() => insertText('', '', 'variable')}>+ Add variable</button>
              </div>
            </div>
          </div>

          {/* Header section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Header</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Document', 'Header Text', 'Video', 'Location', 'Image'].map((mediaType) => (
                <motion.div
                  key={mediaType}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer flex flex-col items-center ${selectedHeaderMedia === mediaType ? 'bg-blue-100' : ''}`}
                  onClick={() => handleHeaderMediaSelect(mediaType)}
                >
                  <FontAwesomeIcon icon={
                    mediaType === 'Document' ? faFileAlt :
                      mediaType === 'Video' ? faVideo :
                        mediaType === 'Location' ? faMapMarkerAlt :
                          mediaType === 'Header Text' ? faBold :
                            faCameraAlt
                  } className="text-2xl mb-2 text-blue-500" />
                  <p className="text-gray-700">{mediaType}</p>
                </motion.div>
              ))}
            </div>
            {selectedHeaderMedia === 'Header Text' && (
              <div className="mt-4">
                <input
                  type="text"
                  value={headerText}
                  onChange={handleHeaderTextChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter header text"
                  maxLength="60"
                />
              </div>
            )}
          </div>



          {/* Footer section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Footer</h3>
            <input
              type="text"
              value={footerText}
              onChange={handleFooterTextChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter footer text"
              maxLength="60"
            />
            <span className="absolute right-3 bottom-1 text-xs text-gray-500">
              {footerText.length}/60
            </span>
          </div>

          {/* Custom buttons section based on selected option */}
          {selectedOption === 'Custom' && (
  <CustomButtonComponent
    title="Custom Buttons"
    description="Create buttons that let customers respond to your message or take actions."
    buttons={customButtons}
    addCustomButton={addCustomButton}
    handleButtonChange={(index, key, value) => handleButtonChange('Custom', index, key, value)} // Pass the function
    removeButton={removeCustomButton}
  />
)}

{selectedOption === 'customUtility' && (
  <CustomButtonComponent
    title="Call to Action Buttons"
    description="Buttons for visiting a website or calling a phone number."
    buttons={[...visitWebsiteButtons, ...phoneNumberButtons]}
    addCustomButton={addVisitWebsiteButton}
    handleButtonChange={(index, key, value) => handleButtonChange('visitwebsite', index, key, value)} // Pass the function
    removeButton={removeVisitWebsiteButton}
  />
)}


          {selectedOption === 'customAuth' && (
            <CustomButtonComponent
              title="Custom Buttons"
              description="Create buttons that let customers respond to your message or take actions."
              buttons={customButtons}
              addCustomButton={addCustomButton}
              addVisitWebsiteButton={addVisitWebsiteButton}
              addPhoneNumberButton={addPhoneNumberButton}
              addCompleteFlowButton={addCompleteFlowButton}
              addCopyOfferCodeButton={addCopyOfferCodeButton}
              handleButtonChange={handleCustomButtonChange}
              removeButton={removeCustomButton}
            />
          )}

          {/* Catalogue buttons section */}
          {selectedOption === 'Catalogue' && (
            <div className="relative inline-block text-left w-50 mt-12">
              <h2 className="text-xl font-bold">Catalogue Buttons</h2>
              <h3 className="text-xl font-bold mb-0.5 items-center">Button</h3>
              <h5 className="text-gray-600 mb-1">
                Create buttons that let customers respond to your message or take actions.
              </h5>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter text here...."
              />
            </div>
          )}

          {/* Carousel section */}
          {selectedOption === 'Carousel' && (
            <div className="relative inline-block text-left w-80 mt-5 ">
              <h2 className="text-xl font-bold">Carousel</h2>
              <Carousel
                responsive={responsive}
                showDots={true}
                arrows={true}
                infinite={false}
                autoPlay={false}
                containerClass="carousel-container"
                itemClass="carousel-item"
                removeArrowOnDeviceType={["tablet", "mobile"]}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="p-4  border  border-gray-400 rounded-lg shadow-lg bg-white mx-2 mt-5 mb-8 ">
                    <div className="mb-2 ">
                      <label className="block text-gray-700">Media</label>
                      <select
                        value={item.media}
                        onChange={(e) => handleCardChange(index, 'media', e.target.value)}
                        className="w-64 p-2 border border-gray-400 rounded-lg"
                      >
                        <option value="" disabled>Select media</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700">Body</label>
                      <input
                        type="text"
                        maxLength="300"
                        value={item.body}
                        onChange={(e) => handleCardChange(index, 'body', e.target.value)}
                        className="w-full p-2 border border-gray-400 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Button</label>
                      <button
                        type="button"
                        className="inline-flex justify-center w-2/4 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-300 text-sm  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 mb-2"
                        onClick={() => addCarouselButton(index)}
                      >
                        + Add a button
                      </button>

                      {item.buttons.map((button, buttonIndex) => (
                        <div key={buttonIndex} className="flex flex-col space-y-2 mt-2">
                          <div className="flex items-center space-x-2">
                            <select
                              className="w-32 p-2 border border-gray-300 rounded-lg"
                              value={button.type}
                              onChange={(e) => handleCarouselButtonChange(index, buttonIndex, 'type', e.target.value)}
                            >
                              <option value="Custom">Custom</option>
                              <option value="Visit website">Visit website</option>
                              <option value="Call Phone Number">Call Phone Number</option>
                            </select>
                          </div>

                          {button.type === 'Custom' && (
                            <div className="flex items-center inline-block space-x-4">
                              <input
                                type="text"
                                className="w-1/2 p-2 border border-gray-300 rounded-lg"
                                placeholder="Button Text"
                                value={button.text}
                                maxLength="25"
                                onChange={(e) => handleCarouselButtonChange(index, buttonIndex, 'text', e.target.value)}
                              />
                              <span className="text-gray-500">{button.text.length}/25</span>
                              <button
                                className="text-pink-100 mt-0 inline-block  rounded-full border bg-red-400 w-6 border-slate-500"
                                onClick={() => removeCardButton(index, buttonIndex)}
                              >
                                X
                              </button>
                            </div>
                          )}

                          {button.type === 'Visit website' && (
                            <>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  className="w-1/4 p-2 border border-gray-300 rounded-lg"
                                  placeholder="Button Text"
                                  value={button.text}
                                  maxLength="25"
                                  onChange={(e) => handleCarouselButtonChange(index, buttonIndex, 'text', e.target.value)}
                                />
                                <input
                                  type="text"
                                  className="w-2/4 p-2 border border-gray-400 rounded-lg"
                                  placeholder="URL"
                                  value={button.url}
                                  onChange={(e) => handleCarouselButtonChange(index, buttonIndex, 'url', e.target.value)}
                                />

                                <span className="text-gray-500">{button.text.length}/25</span>
                                <button
                                  className=" text-pink-200 mt-0 inline-block p-2 rounded-full border bg-red-400 w-10 border-slate-700"
                                  onClick={() => removeCardButton(index, buttonIndex)}
                                >
                                  X
                                </button>
                              </div>
                            </>
                          )}

                          {button.type === 'Call Phone Number' && (
                            <>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  className="w-1/4 p-2 border border-gray-300 rounded-lg"
                                  placeholder="Button Text"
                                  value={button.text}
                                  maxLength="25"
                                  onChange={(e) => handleCarouselButtonChange(index, buttonIndex, 'text', e.target.value)}
                                />

                                <input
                                  type="text"
                                  className="w-2/4 p-2 border border-gray-300 rounded-lg"
                                  placeholder="Phone Number"
                                  value={button.phoneNumber}
                                  onChange={(e) => handleCarouselButtonChange(index, buttonIndex, 'phoneNumber', e.target.value)}
                                />
                                <div className="flex items-center space-x-2">

                                  <span className="text-gray-500">{button.text.length}/25</span>
                                  <button
                                    className=" text-pink-200 mt-0 inline-block p-2 rounded-full border bg-red-400 w-10 border-slate-700"
                                    onClick={() => removeCardButton(index, buttonIndex)}
                                  >
                                    X
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Carousel>
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={addCard}
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  Add Card
                </button>
                <button
                  type="button"
                  onClick={() => removeCard(carouselItems.length - 1)}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Remove Last Card
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Modal to show all options */}
        {showAll && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-1/3">
              <h3 className="text-lg font-semibold mb-4">All Options</h3>
              {previewMessages.map((msg, index) => (
                <div key={index} className="mt-2">
                  <span className="text-blue-600 cursor-pointer">{msg}</span>
                </div>
              ))}
              {previewMessages.length > 0 && previewCallToAction.length > 0 && (
                <hr className="my-4" />
              )}
              {previewCallToAction.map((msg, index) => (
                <div key={index} className="mt-2 flex items-center">
                  <FontAwesomeIcon icon={
                    msg.includes('Visit Website') ? faLink :
                      msg.includes('PhoneNumber') ? faPhone :
                        msg.includes('Complete Flow') ? faCheck :
                          msg.includes('Copy Offer Code') ? faClipboard :
                            null
                  } className="mr-2" />
                  <span className="text-blue-600 cursor-pointer">{msg}</span>
                </div>
              ))}
              <button className="mt-4 text-white bg-blue-600 hover:bg-blue-400 px-4 py-2 rounded" onClick={() => setShowAll(false)}>Close</button>
            </div>
          </div>
        )}

        {/* Message preview section */}
        <div className='lg:w-1/3 h-[450px]'>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-white rounded-lg shadow-md overflow-hidden h-[60vh] fixed"
            style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="border border-gray-300 bg-white p-2">
              <h2 className="text-lg font-semibold">Message Preview</h2>
            </div>
            <div className="p-4">
              <div className="bg-white p-4 rounded-lg shadow-sm ">
                {selectedHeaderMedia && (
                  <div className="mb-4">
                    {selectedHeaderMedia === 'Document' && (
                      <div className="flex items-center">
                        <img src={placeholderMedia.Document} alt="Document" className="w-full h-auto" />
                      </div>
                    )}
                    {selectedHeaderMedia === 'Video' && (
                      <div className="flex items-center">
                        <img src={placeholderMedia.Video} alt="Video" className="w-full h-auto" />
                      </div>
                    )}
                    {selectedHeaderMedia === 'Location' && (
                      <div className="flex items-center">
                        <img src={placeholderMedia.Location} alt="Location" className="w-full h-auto" />
                      </div>
                    )}
                    {selectedHeaderMedia === 'Image' && (
                      <div className="flex items-center">
                        <img src={placeholderMedia.Image} alt="Image" className="w-full h-auto" />
                      </div>
                    )}
                  </div>
                )}
                <p className="font-bold">{headerText}</p>
                <p>{message || 'Your message...'}</p>
                <p className="text-xs">{footerText}</p>
                {previewMessages.slice(0, 2).map((msg, index) => (
                  <div key={index} className="mt-2">
                    <span className="text-blue-600 cursor-pointer">{msg}</span>
                  </div>
                ))}
                {previewCallToAction.slice(0, 2).map((msg, index) => (
                  <div key={index} className="mt-2 flex items-center">
                    <FontAwesomeIcon icon={
                      msg.includes('Visit Website') ? faLink :
                        msg.includes('PhoneNumber') ? faPhone :
                          msg.includes('Complete Flow') ? faCheck :
                            msg.includes('Copy Offer Code') ? faClipboard :
                              null
                    } className="mr-2" />
                    <span className="text-blue-600 cursor-pointer">{msg}</span>
                  </div>
                ))}
                <div className="text-right text-xs text-gray-500 mt-2">07:28</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EditTemplate;

