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
  const handleSubmit = async () => {
    console.log(folderName);

   try {
    const response = await axios.post(
      "https://service2.nuke.co.in/api/file-folders",
      {
        action: "create",
        username: "rahul1011",
        folder_name:folderName ,
      },
      {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDIxMzQ0M2I4NjBiNTRlZWRlMjhjY2VlMGZmZWVkYWRiZWMzNmRjN2E5OThlZWIyZDExYTlkNDZmZWE0NTFlNzVlN2ZlYjZmZDYxNzg1OGEiLCJpYXQiOjE3MzE0ODc5MTAuODU4MjQ0LCJuYmYiOjE3MzE0ODc5MTAuODU4MjUxLCJleHAiOjE3NjMwMjM5MTAuODQ5OTM1LCJzdWIiOiI2OSIsInNjb3BlcyI6W119.g78aoi0_Kr-7MDl0Bu6eNVmUh2MJsOPwCn5NrEwvSuINeUH9rKCjIPDk7GP-du6ivym-WfjCg2RJmCu_YuIPzkRcRZJTvHe9da6zIeE8DZKqFzxZ1HCHe4P68NlWmRkiVfe8Rwvaxz8sgl4QK9VfAnS9cH8qNjth0r87lH7DtR9b1QvY_QpcgllR0HyMDjBaH7KUJzL10oTiOhMpYIJzUj_qqKhNs9P13FUMLsCgu193tU89Ir2ti3QPm4AA-GJX9SP5yAHRdhCw_5SnaX9BxWP2NDLejts_klQDFb1LZ8tWFKfh8wIllUrPeexQGj0ewPeBLyn64PK4DfSnpGXVxQnWypctvbH4ouWVHMt2vY0V6j5QWIjIe_KCR3229CwEfnC3ULRZVClYRHszfs_B5Jl4nmhO-5lgZ9LRbiMERk5pn7i8Y9DOjToirtCJJPef4l11fdGBk_fru1LKCs1i2h16wehQW1GbwZWSo3SKLkq9elmw6lyJLyrAX3mJgVjs4jv9YpAfk0eShKUIqE3i8TlIvLwZIOrradpSBDbqBD9YUzMadPqwfMU_2afYCbMtS24jNqdWZf6A102LOAbL4N8zINQfoNmsQScje2_NzCtybTveuhZDmHe6FVDVBgGtMjsXbAxMKvbItxrlwYdHVKDRkwD0ERWbiWoK3p7qQU0`,
          "Content-Type": "application/json",
        },
      }
    );
   } catch (error) {
    console.log(error.mesage);
   }
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
