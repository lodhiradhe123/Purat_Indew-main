import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EditTemplate from "./EditTemplate.jsx";
import { FaInfoCircle } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  templateData,
} from "../../services/api";

// Language options
const languages = [
  { id: 1, name: 'English (US)', code: '1' },
  { id: 2, name: 'Telugu', code: '2' },
  { id: 3, name: 'Tamil', code: '3' },
  { id: 4, name: 'Russian', code: '4' },
  { id: 5, name: 'Punjabi', code: '5' },
  { id: 6, name: 'Marathi', code: '6' },
  { id: 7, name: 'Malayalam', code: '7' },
  { id: 8, name: 'Hindi', code: '8' },
  { id: 9, name: 'Gujarati', code: '9' },
  { id: 10, name: 'Urdu', code: '10' },
  { id: 11, name: 'Bengali', code: '11' },
  { id: 12, name: 'Kannada', code: '12' },
  { id: 13, name: 'English (UK)', code: '13' },
  { id: 14, name: 'English', code: '14' },
  { id: 15, name: 'Hebrew', code: '15' },
];

const CombinedTemplate = ({ user, onBack }) => {
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showEditTemplate, setShowEditTemplate] = useState(false);
  const [warning, setWarning] = useState('');

  const handleContinue = () => {
    if (validateName(name) && selectedLanguage) {
      checkTemplateName();
    } else {
      if (!validateName(name)) {
        setWarning("Name should only contain lowercase letters, numbers, and underscores, and be a maximum of 30 characters.");
        toast.warning("Invalid template name. Please follow the naming rules.");
      } else if (!selectedLanguage) {
        setWarning("Please select a language.");
        toast.warning("You must select a language.");
      }
    }
  };

  const handleSelectChange = (event) => {
    setSelectedLanguage(event.target.value);
    if (name) setWarning('');
  };

  const validateName = (name) => {
    const nameRegex = /^[a-z0-9_]{1,30}$/;
    return nameRegex.test(name);
  };

  const handleNameChange = (e) => {
    const value = e.target.value.toLowerCase();  // Convert to lowercase automatically
    if (validateName(value) || value === '') {
      setName(value);
      if (selectedLanguage) setWarning('');
    } else {
      setWarning("Name should only contain lowercase letters, numbers, and underscores, and be a maximum of 30 characters.");
      toast.warning("Invalid template name format.");
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Check if the template name exists
 // Check if the template name exists
const checkTemplateName = async () => {
  try {
    const response = await templateData({
      action: "verify",
      username: user.username,
      template_name: name,
    });

    const { status, message } = response.data;

    if (status === "1") {
      // New template - proceed to next page
      toast.success("Template name is available! Proceeding...");
      setShowEditTemplate(true);
    } else if (status === "0") {
      // Template name exists - show warning
      toast.error(`Template name exists: ${message}`);
    }
  } catch (error) {
    console.error("Error checking template name:", error);
    toast.error(`API Error: ${error.response?.data?.message || "Unable to verify template name."}`);
  }
};


  return (
    <>
      <ToastContainer />
      {!showEditTemplate ? (
        <>
          {/* header */}
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
            <div className="flex justify-between items-center">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
              </button>

              {/* Centered Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">New Message Template</h1>
            
              <button
                className="bg-white text-indigo-600 py-2 px-6 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
                onClick={handleContinue}
                aria-label="Start a new broadcast"
              >
                Continue →
              </button>
            </div>
          </div>
          
          <motion.div
            className="bg-white p-6 shadow-md mb-5 rounded-xl"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <form className="w-full flex flex-col items-center space-y-8">
              {/* START: Name input section */}
              <motion.div
                className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                variants={containerVariants}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Name</h2>
                  <Tippy content="Name should only contain lowercase letters, numbers, and underscores, and be a maximum of 30 characters.">
                    <FaInfoCircle className="text-gray-500 cursor-pointer" />
                  </Tippy>
                </div>
                <p className="text-gray-600 mb-3">Name your message template.</p>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter message template name..."
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </motion.div>
              
              {warning && <p className="text-red-500 mt-2">{warning}</p>}

              {/* START: Language selection section */}
              <motion.div
                className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                variants={containerVariants}
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Language</h2>
                <p className="text-gray-600 mb-3">
                  Choose a language for your template from the dropdown below.
                </p>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-white"
                  value={selectedLanguage}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="" disabled>Select a language</option>
                  {languages.map((language) => (
                    <option key={language.id} value={language.code}>{language.name}</option>
                  ))}
                </select>
              </motion.div>
            </form>
          </motion.div>
        </>
      ) : (
        <EditTemplate user={user} name={name} selectedLanguage={selectedLanguage} />
      )}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        © 2024 PuRat. All rights reserved.
      </footer>
    </>
  );
};

export default CombinedTemplate;
