import React, { useState, useEffect } from "react";
import axios from "axios";
const FolderCreationModal = ({ isOpen, onClose, onCreate, folderToEdit }) => {
  // State for the folder name input
  const [folderName, setFolderName] = useState("");
  // State for error messages
  const [error, setError] = useState("");

  // Effect to set the folder name if editing an existing folder
  useEffect(() => {
    if (folderToEdit) {
      setFolderName(folderToEdit.name);
    } else {
      setFolderName(""); // Clear the folder name if not editing
    }
  }, [folderToEdit]);

  // Handle form submission
  const handleSubmit =  () => {
    console.log(folderName);

   
    if (folderName.trim().length < 3) {
      setError("Folder name must be at least 3 characters long.");
      return;
    }

    if (folderName.trim()) {
      if (folderToEdit) {
        onCreate(folderName, folderToEdit.id); // Pass the folder ID for editing
      } else {
        onCreate(folderName);
      }
      onClose();
    }
  };

  // Handle changes in the input field
  const handleChange = (e) => {
    setFolderName(e.target.value);
    if (e.target.value.trim().length >= 3) {
      setError("");
    }
  };

  // If the modal is not open, return null to avoid rendering
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/4 h-72">
        <h3 className="text-lg font-semibold mb-4">
          {folderToEdit ? "Edit Folder" : "Create New Folder"}
        </h3>
        <input
          type="text"
          value={folderName}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded w-full mb-4 focus:outline-none focus:border-blue-500"
          placeholder="Folder Name"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            {folderToEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderCreationModal;
