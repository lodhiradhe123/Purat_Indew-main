import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faSmile,
  faFileAlt,
  faVideo,
  faMapMarkerAlt,
  faCameraAlt,
  faLink,
  faPhone,
  faCheck,
  faClipboard,
  faBullhorn,
  faBell,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import {
  FaWhatsapp,
  FaVideo,
  FaChevronLeft,
  FaEllipsisV,
  FaPhone,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CustomButtonComponent from "../CustomButtonComponent";
import background from "../../../public/assets/images/png/image.png";
import EmojiPicker from "emoji-picker-react";
import { templateData } from "../../services/api";
import AddLinkModal from "./AddLinkModal"; // Import modal here
import "./ButtonStyles.css"; // Make sure the path is correct
import WhatsAppPreviewCarousel from "./CarouselPreview"; // Adjust the path based on your file structure

// Constants for placeholder media images
const placeholderMedia = {
  Document: "https://via.placeholder.com/150?text=Document",
  Video: "https://via.placeholder.com/150?text=Video",
  Location: "https://via.placeholder.com/150?text=Location",
  Image: "https://via.placeholder.com/150",
};

// Reusable Card component for displaying category options
const Card = ({
  icon,
  title,
  description,
  options,
  selectedOption,
  onOptionChange,
}) => (
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
          className={`w-full text-left px-4 py-2 rounded-md transition-colors text-sm ${
            selectedOption === option
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
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
  const [message, setMessage] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [customButtons, setCustomButtons] = useState([]);
  const [visitWebsiteButtons, setVisitWebsiteButtons] = useState([]);
  const [phoneNumberButtons, setPhoneNumberButtons] = useState([]);

  const [previewMessages, setPreviewMessages] = useState([]);
  const [previewCallToAction, setPreviewCallToAction] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [carouselItems, setCarouselItems] = useState([
    { media: "", body: "", buttons: [] },
  ]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedHeaderMedia, setSelectedHeaderMedia] = useState("");
  const [variableCounter, setVariableCounter] = useState(1);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false); // State to control modal visibility
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedButtonType, setSelectedButtonType] = useState("QUICK_REPLY");
  const [selectedMediaType, setSelectedMediaType] = useState(null); // Global state for media type

  const navigate = useNavigate();

  // Input handlers
  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    const forbiddenWords = ["abuse", "gambling"];
    const containsForbiddenWords = forbiddenWords.some((word) =>
      newMessage.toLowerCase().includes(word)
    );

    if (!containsForbiddenWords) {
      setMessage(newMessage);
    } else {
      alert("Your message contains forbidden words.");
    }
  };

  const handleHeaderTextChange = (e) => setHeaderText(e.target.value);
  const handleFooterTextChange = (e) => setFooterText(e.target.value);
  const handleOptionChange = (option) => setSelectedOption(option);
  const handleEmojiClick = (emojiObject) =>
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);

  const handleHeaderMediaSelect = (mediaType) =>
    setSelectedHeaderMedia(mediaType);

  const handleCallToActionClick = (buttonText) =>
    setPreviewCallToAction([...previewCallToAction, buttonText]);

  // Function to handle changes in carousel cards
  const handleCardChange = (index, key, value) => {
    if (key === "media") {
      if (index === 0) {
        // Update the media type for all cards when selected on the first card
        setSelectedMediaType(value); // Set the global media type
        setCarouselItems((prevItems) =>
          prevItems.map((item) => ({
            ...item,
            media: value, // Update media type for all cards
          }))
        );
      } else {
        // Show a toast when trying to change media type from other cards
        toast.info("Media type can only be selected from the first card.");
      }
    } else {
      // Handle other fields (body, buttons, etc.)
      const updatedItems = [...carouselItems];
      updatedItems[index][key] = value;
      setCarouselItems(updatedItems);
    }
  };

  // Add a new card to the carousel
  const addCard = () => {
    if (carouselItems.length < 10) {
      setCarouselItems([
        ...carouselItems,
        { media: selectedMediaType || "", body: "", buttons: [] },
      ]);
    }
  };

  // Remove a card from the carousel
  const removeCard = (index) => {
    setCarouselItems(carouselItems.filter((_, i) => i !== index));
  };

  // Functions to handle carousel buttons
  const addCarouselButton = (index) => {
    const updatedItems = [...carouselItems];

    if (updatedItems[index].buttons.length < 2) {
      // Create a new button object based on the button type
      const newButton = {
        type: "Custom", // default type
        text: "",
      };

      // Push the new button object
      updatedItems[index].buttons.push(newButton);
      setCarouselItems(updatedItems);
    } else {
      alert("You can add only up to 2 buttons per carousel item.");
    }
  };

  const handleCarouselButtonChange = (index, buttonIndex, field, value) => {
    const updatedItems = [...carouselItems];
    const button = updatedItems[index].buttons[buttonIndex];

    // Update the button field
    button[field] = value;

    // Ensure only relevant fields exist based on the type
    if (field === "type") {
      if (value === "URL") {
        button.url = ""; // Add URL field if button is "URL"
        delete button.phoneNumber; // Remove phoneNumber field if it exists
      } else if (value === "PHONE_NUMBER") {
        button.phoneNumber = ""; // Add phoneNumber field if button is "PHONE_NUMBER"
        delete button.url; // Remove URL field if it exists
      } else {
        // For QUICK_REPLY or Custom, remove other unnecessary fields
        delete button.url;
        delete button.phoneNumber;
      }
    }

    setCarouselItems(updatedItems);
  };

  const removeCardButton = (cardIndex, buttonIndex) => {
    const updatedItems = [...carouselItems];
    updatedItems[cardIndex].buttons = updatedItems[cardIndex].buttons.filter(
      (_, i) => i !== buttonIndex
    );
    setCarouselItems(updatedItems);
  };

  const getReplyIcon = (type) => {
    switch (type) {
      case "QUICK_REPLY":
        return "/assets/images/svg/reply2.svg"; // Icon for Quick Reply
      case "URL":
        return "/assets/images/svg/icon-web.svg"; // Icon for URL
      case "PHONE_NUMBER":
        return "/assets/images/svg/icon-web.svg"; // Icon for Phone
      default:
        return "/assets/images/svg/default.svg"; // Default icon
    }
  };

  // Functions to handle custom buttons
  // Function to add a general custom button (text only)
  // Function to add a general custom button (text only)
  const addCustomButton = () => {
    let newButton = {
      type: selectedButtonType, // This should reflect the type selected from the dropdown
      text: "", // Default text
      ...(selectedButtonType === "URL" && { url: "" }), // Add URL field if type is URL
      ...(selectedButtonType === "PHONE_NUMBER" && { phone_number: "" }), // Add phone number field if type is PHONE_NUMBER
    };
    setCustomButtons([...customButtons, newButton]);
  };

  // Function to add a phone number button
  const addPhoneNumberButton = () => {
    const newButton = {
      type: "PHONE_NUMBER",
      text: "Call",
      phone_number: "", // Initialize without a phone number
    };
    setPhoneNumberButtons([...phoneNumberButtons, newButton]);
  };

  // Function to add a URL button
  const addVisitWebsiteButton = () => {
    const newButton = {
      type: "URL",
      text: "Contact Support",
      url: "", // Initialize without a URL
    };
    setVisitWebsiteButtons([...visitWebsiteButtons, newButton]);
  };

  const removeCustomButton = (index) => {
    setCustomButtons(customButtons.filter((_, i) => i !== index));
    setPreviewMessages(previewMessages.filter((_, i) => i !== index));
  };

  // Submit function to handle form submission
  const handleSubmit = () => {
    // Open the confirmation modal instead of submitting directly
    setIsConfirmModalOpen(true);
  };
  const handleConfirmSubmit = async () => {
    let category;
    switch (selectedOption) {
      case "Custom":
        category = 1;
        break;
      case "customUtility":
        category = 2;
        break;
      case "customAuth":
        category = 3;
        break;
      default:
        category = 1;
    }
  
    // Check if the selected option is "Carousel" and perform validations
    let carousels = null;
    if (selectedOption === "Carousel") {
      // Condition 1: At least 2 carousel cards should exist
      if (carouselItems.length < 2) {
        alert("Error: You must have at least 2 cards in the carousel.");
        return; // Stop submission
      }
  
      // Condition 2: All carousel cards should have the same media type
      const firstMediaType = carouselItems[0].media;
      const isMediaConsistent = carouselItems.every(
        (item) => item.media === firstMediaType
      );
      if (!isMediaConsistent) {
        alert("Error: All carousel cards must contain the same media type (either all Image or all Video).");
        return; // Stop submission
      }
  
      // Condition 3: Every carousel card should have text in the body
      const isBodyFilled = carouselItems.every((item) => item.body.trim() !== "");
      if (!isBodyFilled) {
        alert("Error: Each carousel card must contain text in the body.");
        return; // Stop submission
      }
  
      // Condition 4: Every carousel card should have at least 1 button and all buttons must be of the same type
      const firstButtonType = carouselItems[0].buttons[0]?.type;
      const areButtonsValid = carouselItems.every(
        (item) => item.buttons.length > 0 && item.buttons.every((btn) => btn.type === firstButtonType)
      );
      if (!areButtonsValid) {
        alert("Error: Each carousel card must have at least 1 button, and all buttons must be of the same type across all cards.");
        return; // Stop submission
      }
  
      // If all conditions pass, map the carousel items
      carousels = carouselItems.map((item) => ({
        media: item.media,
        body: item.body,
        buttons: item.buttons,
      }));
    }
  
    const quickReplies = [
      ...customButtons.map((button) => ({
        type: button.type, // Ensure this is mapped correctly to the actual button type
        text: button.text,
        ...(button.type === "URL" && { url: button.url }),
        ...(button.type === "PHONE_NUMBER" && {
          phone_number: button.phone_number,
        }),
      })),
    ];
  
    // Proceed with submission if no errors are found
    try {
      const response = await templateData({
        action: "create",
        username: user.username,
        template_name: name,
        category: category,
        language: selectedLanguage,
        template_body: message,
        template_footer: footerText,
        header_area_type: selectedHeaderMedia ? "media" : "text",
        header_text: selectedHeaderMedia === "Header Text" ? headerText : "",
        header_media_type: selectedHeaderMedia,
        quick_replies: quickReplies,
        carousels: carousels, // Send carousels if selected
        type: selectedOption.toLowerCase(), // Include the type field in the payload
      });
  
      if (response.status === 201 || response.status === "1") {
        navigate("/dashboard/whatsapp/broadcast");
      } else {
        alert("There was an issue submitting the template.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  
    // Close the modal after submission
    setIsConfirmModalOpen(false);
  };
  

  // Carousel responsiveness settings
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // Function to insert text in the textarea with tags for formatting and variables
  const insertText = (startTag, endTag = "", type = "") => {
    const textarea = document.getElementById("messageTextArea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    if (type === "variable") {
      if (variableCounter > 10) return;
      const variableText = `{{${variableCounter}}}`;
      setVariableCounter(variableCounter + 1);
      const newText =
        text.substring(0, start) + variableText + text.substring(end);
      setMessage(newText);
    } else {
      const selectedText = text.substring(start, end);
      const newText =
        text.substring(0, start) +
        startTag +
        selectedText +
        endTag +
        text.substring(end);
      setMessage(newText);
    }
  };
  const handleButtonChange = (type, index, key, value) => {
    if (type === "Custom") {
      const updatedButtons = [...customButtons];
      updatedButtons[index] = {
        ...updatedButtons[index],
        [key]: value,
      };
      setCustomButtons(updatedButtons);
    } else if (type === "visitwebsite") {
      const updatedButtons = [...visitWebsiteButtons];
      updatedButtons[index] = {
        ...updatedButtons[index],
        [key]: value,
      };
      setVisitWebsiteButtons(updatedButtons);
    } else if (type === "callphonenumber") {
      const updatedButtons = [...phoneNumberButtons];
      updatedButtons[index] = {
        ...updatedButtons[index],
        [key]: value,
      };
      setPhoneNumberButtons(updatedButtons);
    }
    // Update previewButtons when changes are made
    const updatedPreviewButtons = [
      ...customButtons,
      ...visitWebsiteButtons,
      ...phoneNumberButtons,
    ];
    setPreviewCallToAction(updatedPreviewButtons);
  };

  const handleAddLink = (link) => {
    setMessage((prevMessage) => prevMessage + link); // Append the selected link to the message
  };

  const previewButtons = [
    ...customButtons,
    ...visitWebsiteButtons,
    ...phoneNumberButtons,
  ];

  return (
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white   p-8 w-full max-w-full flex"
    >
      {/* Left Section for Template Details (Scrollable) */}
      <div className="flex-1 max-w-8xl pr-8 h-[80vh] overflow-y-auto scrollbar-hide">
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
                options={["Custom", "Catalogue", "Carousel"]}
                selectedOption={selectedOption}
                onOptionChange={handleOptionChange}
              />
              <Card
                icon={faBell}
                title="Utility"
                description="Messages about a specific transaction, account, order or customer request."
                options={["customUtility"]}
                selectedOption={selectedOption}
                onOptionChange={handleOptionChange}
              />
              <Card
                icon={faKey}
                title="Authentication"
                description="One-time passwords that your customers use to authenticate a transaction or login."
                options={["customAuth"]}
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
              <span className="text-sm text-gray-500">
                Characters: {message.length}/1024
              </span>
              <div className="flex space-x-2">
                <FontAwesomeIcon
                  icon={faBold}
                  className="text-gray-500 cursor-pointer"
                  onClick={() => insertText("*", "*")}
                />
                <FontAwesomeIcon
                  icon={faItalic}
                  className="text-gray-500 cursor-pointer"
                  onClick={() => insertText("~", "~")}
                />

                <FontAwesomeIcon
                  icon={faSmile}
                  className="text-gray-500 cursor-pointer"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                {showEmojiPicker && (
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                )}
                <button
                  className="text-blue-500"
                  onClick={() => insertText("", "", "variable")}
                >
                  + Add variable
                </button>
                <button
                  className="text-blue-500"
                  onClick={() => setShowAddLinkModal(true)} // Opens the modal
                >
                  🔗 Add Link
                </button>
              </div>
            </div>
            <AddLinkModal
              isOpen={showAddLinkModal} // Opens/closes modal
              onClose={() => setShowAddLinkModal(false)} // Closes modal
              onAddLink={handleAddLink} // Handles adding the link to the message
              user={user}
            />
          </div>
          {selectedOption !== "Carousel" && (
            <>
              {/* Header section */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Header</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    "Document",
                    "Header Text",
                    "Video",
                    "Location",
                    "Image",
                  ].map((mediaType) => (
                    <motion.div
                      key={mediaType}
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer flex flex-col items-center ${
                        selectedHeaderMedia === mediaType ? "bg-blue-100" : ""
                      }`}
                      onClick={() => handleHeaderMediaSelect(mediaType)}
                    >
                      <FontAwesomeIcon
                        icon={
                          mediaType === "Document"
                            ? faFileAlt
                            : mediaType === "Video"
                            ? faVideo
                            : mediaType === "Location"
                            ? faMapMarkerAlt
                            : mediaType === "Header Text"
                            ? faBold
                            : faCameraAlt
                        }
                        className="text-2xl mb-2 text-blue-500"
                      />
                      <p className="text-gray-700">{mediaType}</p>
                    </motion.div>
                  ))}
                </div>
                {selectedHeaderMedia === "Header Text" && (
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
                <span className="bottom-1 text-xs text-gray-500">
                  {footerText.length}/60
                </span>
              </div>
            </>
          )}

          {/* Custom buttons section based on selected option */}

          {selectedOption === "Custom" && (
            <>
              <h3 className="text-xl font-semibold mb-2">Custom Buttons </h3>
              <p className="text-gray-600 mb-4">
                Create buttons that let customers respond to your message or
                take actions.
              </p>

              <div className="flex items-center space-x-4">
                <select
                  value={selectedButtonType}
                  onChange={(e) => setSelectedButtonType(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="QUICK_REPLY">Custom</option>
                  <option value="URL">Visit Website</option>
                  <option value="PHONE_NUMBER">Call Phone Number</option>
                </select>
                <button
                  onClick={addCustomButton}
                  disabled={
                    (selectedButtonType === "QUICK_REPLY" &&
                      customButtons.filter((b) => b.type === "QUICK_REPLY")
                        .length >= 10) ||
                    (selectedButtonType === "URL" &&
                      customButtons.filter((b) => b.type === "URL").length >=
                        2) ||
                    (selectedButtonType === "PHONE_NUMBER" &&
                      customButtons.filter((b) => b.type === "PHONE_NUMBER")
                        .length >= 1)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Button
                </button>
              </div>
              {/* Render custom buttons */}
              <div className="mt-4 space-y-4">
                {customButtons.map((button, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md shadow-sm bg-white"
                  >
                    <div className="flex-1">
                      <label className="block font-semibold text-gray-700 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) =>
                          handleButtonChange(
                            "Custom",
                            index,
                            "text",
                            e.target.value
                          )
                        }
                        placeholder="Button Text"
                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength="25"
                      />
                      <small className="text-gray-500">Max 25 characters</small>
                    </div>
                    {/* URL Input */}
                    {button.type === "URL" && (
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700 mb-1">
                          Website URL
                        </label>
                        <input
                          type="text"
                          value={button.url}
                          onChange={(e) =>
                            handleButtonChange(
                              "Custom",
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="Enter URL"
                          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    {/* Phone Number Input */}
                    {button.type === "PHONE_NUMBER" && (
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={button.phone_number}
                          onChange={(e) =>
                            handleButtonChange(
                              "Custom",
                              index,
                              "phone_number",
                              e.target.value
                            )
                          }
                          placeholder="Enter Phone Number"
                          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => removeCustomButton(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedOption === "customUtility" && (
            <>
              <h3 className="text-xl font-semibold mb-2">Custom Buttons </h3>
              <p className="text-gray-600 mb-4">
                Create buttons that let customers respond to your message or
                take actions.
              </p>

              <div className="flex items-center space-x-4">
                <select
                  value={selectedButtonType}
                  onChange={(e) => setSelectedButtonType(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="QUICK_REPLY">Custom</option>
                  <option value="URL">Visit Website</option>
                  <option value="PHONE_NUMBER">Call Phone Number</option>
                </select>
                <button
                  onClick={addCustomButton}
                  disabled={
                    (selectedButtonType === "QUICK_REPLY" &&
                      customButtons.filter((b) => b.type === "QUICK_REPLY")
                        .length >= 10) ||
                    (selectedButtonType === "URL" &&
                      customButtons.filter((b) => b.type === "URL").length >=
                        2) ||
                    (selectedButtonType === "PHONE_NUMBER" &&
                      customButtons.filter((b) => b.type === "PHONE_NUMBER")
                        .length >= 1)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Button
                </button>
              </div>
              {/* Render custom buttons */}
              <div className="mt-4 space-y-4">
                {customButtons.map((button, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md shadow-sm bg-white"
                  >
                    <div className="flex-1">
                      <label className="block font-semibold text-gray-700 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) =>
                          handleButtonChange(
                            "Custom",
                            index,
                            "text",
                            e.target.value
                          )
                        }
                        placeholder="Button Text"
                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength="25"
                      />
                      <small className="text-gray-500">Max 25 characters</small>
                    </div>
                    {/* URL Input */}
                    {button.type === "URL" && (
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700 mb-1">
                          Website URL
                        </label>
                        <input
                          type="text"
                          value={button.url}
                          onChange={(e) =>
                            handleButtonChange(
                              "Custom",
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="Enter URL"
                          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    {/* Phone Number Input */}
                    {button.type === "PHONE_NUMBER" && (
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={button.phone_number}
                          onChange={(e) =>
                            handleButtonChange(
                              "Custom",
                              index,
                              "phone_number",
                              e.target.value
                            )
                          }
                          placeholder="Enter Phone Number"
                          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => removeCustomButton(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedOption === "customAuth" && (
            <>
              <h3 className="text-xl font-semibold mb-2">Custom Buttons </h3>
              <p className="text-gray-600 mb-4">
                Create buttons that let customers respond to your message or
                take actions.
              </p>

              <div className="flex items-center space-x-4">
                <select
                  value={selectedButtonType}
                  onChange={(e) => setSelectedButtonType(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="QUICK_REPLY">Custom</option>
                  <option value="URL">Visit Website</option>
                  <option value="PHONE_NUMBER">Call Phone Number</option>
                </select>
                <button
                  onClick={addCustomButton}
                  disabled={
                    (selectedButtonType === "QUICK_REPLY" &&
                      customButtons.filter((b) => b.type === "QUICK_REPLY")
                        .length >= 10) ||
                    (selectedButtonType === "URL" &&
                      customButtons.filter((b) => b.type === "URL").length >=
                        2) ||
                    (selectedButtonType === "PHONE_NUMBER" &&
                      customButtons.filter((b) => b.type === "PHONE_NUMBER")
                        .length >= 1)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Button
                </button>
              </div>
              {/* Render custom buttons */}
              <div className="mt-4 space-y-4">
                {customButtons.map((button, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md shadow-sm bg-white"
                  >
                    <div className="flex-1">
                      <label className="block font-semibold text-gray-700 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) =>
                          handleButtonChange(
                            "Custom",
                            index,
                            "text",
                            e.target.value
                          )
                        }
                        placeholder="Button Text"
                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength="25"
                      />
                      <small className="text-gray-500">Max 25 characters</small>
                    </div>
                    {/* URL Input */}
                    {button.type === "URL" && (
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700 mb-1">
                          Website URL
                        </label>
                        <input
                          type="text"
                          value={button.url}
                          onChange={(e) =>
                            handleButtonChange(
                              "Custom",
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="Enter URL"
                          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    {/* Phone Number Input */}
                    {button.type === "PHONE_NUMBER" && (
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={button.phone_number}
                          onChange={(e) =>
                            handleButtonChange(
                              "Custom",
                              index,
                              "phone_number",
                              e.target.value
                            )
                          }
                          placeholder="Enter Phone Number"
                          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => removeCustomButton(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Catalogue buttons section */}
          {selectedOption === "Catalogue" && (
            <div className="relative inline-block text-left w-50 mt-12">
              <h2 className="text-xl font-bold">Catalogue Buttons</h2>
              <h3 className="text-xl font-bold mb-0.5 items-center">Button</h3>
              <h5 className="text-gray-600 mb-1">
                Create buttons that let customers respond to your message or
                take actions.
              </h5>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter text here...."
              />
            </div>
          )}

          {/* Carousel section */}
          {selectedOption === "Carousel" && (
            <>
              <div className="mt-4 space-y-4">
                {customButtons.map((button, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md shadow-sm bg-white"
                  >
                    <div className="flex-1">
                      <label className="block font-semibold text-gray-700 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) =>
                          handleButtonChange(
                            "Custom",
                            index,
                            "text",
                            e.target.value
                          )
                        }
                        placeholder="Button Text"
                        className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength="25"
                      />
                      <small className="text-gray-500">Max 25 characters</small>
                    </div>
                    {/* URL Input */}
                    {button.type === "URL" && (
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700 mb-1">
                          Website URL
                        </label>
                        <input
                          type="text"
                          value={button.url}
                          onChange={(e) =>
                            handleButtonChange(
                              "Custom",
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="Enter URL"
                          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    {/* Phone Number Input */}
                    {button.type === "PHONE_NUMBER" && (
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={button.phone_number}
                          onChange={(e) =>
                            handleButtonChange(
                              "Custom",
                              index,
                              "phone_number",
                              e.target.value
                            )
                          }
                          placeholder="Enter Phone Number"
                          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={() => removeCustomButton(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Carousel button end */}
              {/* Carousel start */}

              <div className="bg-white rounded-lg border border-gray-400 p-6 transition-all duration-300 ease-in-out ">
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
                    <div
                      key={index}
                      className="p-4  border  border-gray-400 rounded-lg shadow-lg bg-white mx-2 mt-5 mb-8 w-full"
                    >
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Media</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {["Image", "Video"].map((mediaType) => (
                            <motion.div
                              key={mediaType}
                              whileHover={{ scale: 1.05 }}
                              className={`p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer flex flex-col items-center ${
                                selectedMediaType === mediaType
                                  ? "bg-blue-100"
                                  : ""
                              }`}
                              onClick={() =>
                                handleCardChange(index, "media", mediaType)
                              }
                            >
                              <FontAwesomeIcon
                                icon={
                                  mediaType === "Video" ? faVideo : faCameraAlt
                                }
                                className="text-2xl mb-2 text-blue-500"
                              />
                              <p className="text-gray-700">{mediaType}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Conditionally Render the Media Based on Selected Media Type */}
                      {selectedMediaType === "Image" && (
                  <div className="mb-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
                  <h4 className="font-semibold text-blue-800">
                    Important Note:
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Image content (media type) must remain the same for all cards. You can only select it in the first card.
                  </p>
                </div>
                
                   
                      )}

                      {selectedMediaType === "Video" && (
                       <div className="mb-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
                       <h4 className="font-semibold text-blue-800">
                         Important Note:
                       </h4>
                       <p className="text-blue-700 text-sm">
                         Video content (media type) must remain the same for all cards. You can only select it in the first card.
                       </p>
                     </div>
                     
                      )}
                      <div className="mb-2">
                        <h3 className=" font-semibold mb-2">Body</h3>
                      </div>

                      <textarea
                        id="messageTextArea"
                        value={item.body}
                        onChange={(e) =>
                          handleCardChange(index, "body", e.target.value)
                        }
                        placeholder="Enter Template Message"
                        className="w-4/5 p-2 border border-gray-400 rounded-lg"
                        rows="6"
                      />
                      <div>
                        <h3 className=" font-semibold mb-2">Button</h3>
                        <div className="mb-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-md">
                  <h4 className="font-semibold text-blue-800">
                    Important Note:
                  </h4>
                  <p className="text-blue-700 text-sm">
                  Ensure that all items in the carousel have the same button patterns. If using "Quick Reply" on one item, all items should include the same. The same applies to "Visit Website."
                  </p>
                </div>
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => addCarouselButton(index)}
                        >
                          + Add a button
                        </button>
                        

                        {item.buttons.map((button, buttonIndex) => (
                          <div
                            key={buttonIndex}
                            className="flex flex-col space-y-2 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              
                              <select
                                className="w-32 p-2 border border-gray-300 rounded-lg"
                                value={button.type}
                                onChange={(e) =>
                                  handleCarouselButtonChange(
                                    index,
                                    buttonIndex,
                                    "type",
                                    e.target.value
                                  )
                                }
                              >
                                <option>--Select--</option>
                                <option value="QUICK_REPLY">Quick Reply</option>
                                <option value="URL">Visit Website</option>
                              </select>
                            </div>

                            {button.type === "QUICK_REPLY" && (
                              <div className="flex items-center inline-block space-x-4">
                                <input
                                  type="text"
                                  className="w-1/2 p-2 border border-gray-300 rounded-lg"
                                  placeholder="Button Text"
                                  value={button.text}
                                  maxLength="25"
                                  onChange={(e) =>
                                    handleCarouselButtonChange(
                                      index,
                                      buttonIndex,
                                      "text",
                                      e.target.value
                                    )
                                  }
                                />
                                <span className="text-gray-500">
                                  {button.text.length}/25
                                </span>
                                <button
                                  className="text-pink-100 mt-0 inline-block rounded-full border bg-red-400 w-6 border-slate-500"
                                  onClick={() =>
                                    removeCardButton(index, buttonIndex)
                                  }
                                >
                                  X
                                </button>
                              </div>
                            )}

                            {button.type === "URL" && (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  className="w-1/4 p-2 border border-gray-300 rounded-lg"
                                  placeholder="Button Text"
                                  value={button.text}
                                  maxLength="25"
                                  onChange={(e) =>
                                    handleCarouselButtonChange(
                                      index,
                                      buttonIndex,
                                      "text",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="text"
                                  className="w-2/4 p-2 border border-gray-400 rounded-lg"
                                  placeholder="URL"
                                  value={button.url}
                                  onChange={(e) =>
                                    handleCarouselButtonChange(
                                      index,
                                      buttonIndex,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                />
                                <span className="text-gray-500">
                                  {button.text.length}/25
                                </span>
                                <button
                                  className=" text-pink-200 mt-0 inline-block p-2 rounded-full border bg-red-400 w-10 border-slate-700"
                                  onClick={() =>
                                    removeCardButton(index, buttonIndex)
                                  }
                                >
                                  X
                                </button>
                              </div>
                            )}

                            {button.type === "PHONE_NUMBER" && (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  className="w-1/4 p-2 border border-gray-300 rounded-lg"
                                  placeholder="Button Text"
                                  value={button.text}
                                  maxLength="25"
                                  onChange={(e) =>
                                    handleCarouselButtonChange(
                                      index,
                                      buttonIndex,
                                      "text",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  type="text"
                                  className="w-2/4 p-2 border border-gray-300 rounded-lg"
                                  placeholder="Phone Number"
                                  value={button.phoneNumber}
                                  onChange={(e) =>
                                    handleCarouselButtonChange(
                                      index,
                                      buttonIndex,
                                      "phoneNumber",
                                      e.target.value
                                    )
                                  }
                                />
                                <span className="text-gray-500">
                                  {button.text.length}/25
                                </span>
                                <button
                                  className="text-pink-200 mt-0 inline-block p-2 rounded-full border bg-red-400 w-10 border-slate-700"
                                  onClick={() =>
                                    removeCardButton(index, buttonIndex)
                                  }
                                >
                                  X
                                </button>
                              </div>
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Card
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCard(carouselItems.length - 1)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove Last Card
                  </button>
                </div>
              </div>
            </>
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
                  <FontAwesomeIcon
                    icon={
                      msg.includes("Visit Website")
                        ? faLink
                        : msg.includes("PhoneNumber")
                        ? faPhone
                        : msg.includes("Complete Flow")
                        ? faCheck
                        : msg.includes("Copy Offer Code")
                        ? faClipboard
                        : null
                    }
                    className="mr-2"
                  />
                  <span className="text-blue-600 cursor-pointer">{msg}</span>
                </div>
              ))}
              <button
                className="mt-4 text-white bg-blue-600 hover:bg-blue-400 px-4 py-2 rounded"
                onClick={() => setShowAll(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - WhatsApp-style Preview */}
      <div className="w-96 bg-gray-100 p-6 rounded-lg shadow-inner">
        <div className="bg-[#075E54] text-white p-2 flex items-center">
          <FaChevronLeft className="mr-2" />

          <FaWhatsapp className="mr-2" />

          <span className="flex-grow">Whatsapp</span>

          <FaVideo className="mx-2" />

          <FaPhone className="mx-2" />

          <FaEllipsisV className="ml-2" />
        </div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className=" w-full bg-[#E5DDD5] rounded-lg shadow-md overflow-scroll h-[70vh] relative scrollbar-hide "
          style={{
            backgroundImage: `url(${background})`, // Replace this with WhatsApp background image
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="p-4">
            <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%] ml-auto mb-2">
              {selectedHeaderMedia && (
                <div className="mb-4">
                  {selectedHeaderMedia === "Document" && (
                    <div className="flex items-center">
                      <img
                        src={placeholderMedia.Document}
                        alt="Document"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  {selectedHeaderMedia === "Video" && (
                    <div className="flex items-center">
                      <img
                        src={placeholderMedia.Video}
                        alt="Video"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  {selectedHeaderMedia === "Location" && (
                    <div className="flex items-center">
                      <img
                        src={placeholderMedia.Location}
                        alt="Location"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  {selectedHeaderMedia === "Image" && (
                    <div className="flex items-center">
                      <img
                        src={placeholderMedia.Image}
                        alt="Image"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Header Text */}
              <p className="font-bold">{headerText}</p>

              {/* Message Text */}
              <p className="whitespace-pre-wrap">
                {message || "Your message..."}
              </p>

              {/* Footer Text */}
              <p className="text-xs">{footerText}</p>

              {/* Render Buttons */}
              <div className="bg-white flex flex-col space-y-2 items-center text-[#8043f3] py-2 text-sm hover:bg-gray-100 transition duration-300 ease-in-out w-full text-center border-t">
                {previewButtons.length > 0 &&
                  previewButtons.map((button, index) => (
                    <button
                      key={index}
                      className="whatsapp-button flex items-center justify-center py-2 px-4 rounded-md bg-white text-blue hover:bg-[#6c3fd1] border-none"
                    >
                      {/* Icon */}
                      <img
                        src={getReplyIcon(button.type)} // Get the icon based on the button type
                        width={16}
                        height={16}
                        alt={`${button.type} icon`}
                        className="mr-2" // Add margin for spacing between icon and text
                      />

                      {/* Button Text */}
                      {button.type === "URL" ? (
                        <a
                          href={button.url || "#"}
                          className="whatsapp-button-link text-blue"
                        >
                          {button.text || "Visit Website"}
                        </a>
                      ) : button.type === "PHONE_NUMBER" ? (
                        <span>{button.text || "Call"}</span>
                      ) : (
                        <span>{button.text || "Quick Reply"}</span>
                      )}
                    </button>
                  ))}
              </div>

              {/* Timestamp */}
              <div className="text-right text-xs text-gray-500 mt-2">07:28</div>
            </div>

            {/* crousel section */}
            {selectedOption === "Carousel" && (
              <div className="bg-white  rounded-lg shadow-sm max-w-[80%] ml-auto mb-2">
                <WhatsAppPreviewCarousel carouselItems={carouselItems} />
              </div>
            )}
          </div>
        </motion.div>
      </div>
      {/* Confirmation Modal should be rendered outside the form, but inside the main JSX block */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)} // Close modal on cancel
        onConfirm={handleConfirmSubmit} // Confirm and submit form
      />
    </motion.div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Submission</h2>
        <p>Are you sure you want to submit?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={onConfirm}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTemplate;
