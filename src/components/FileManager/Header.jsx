import React from 'react';
import { FiSearch, FiFolderPlus, FiGrid, FiList, FiUpload } from 'react-icons/fi';

const Header = ({ onSearch, onNewFolder, onRefresh, onToggleView, onUploadFile, currentPath, onBreadcrumbClick }) => {
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      
      {/* Section 1: Search Bar */}
      <div className="flex justify-between items-center">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <FiSearch className="absolute left-5 text-gray-500 text-lg" />
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by Name"
            className="text-center pl-5 p-2 border border-gray-300 rounded"
            onChange={onSearch} // Trigger the search function when the input value changes
          />
        </div>

        {/* Section 2: Action Buttons */}
        <div className="flex items-center space-x-2 mr-9">
          
          {/* Conditionally Render "New Folder" Button: Only show if at the root directory (currentPath is empty) */}
          {currentPath.length === 0 && (
            <button
              className="flex items-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={onNewFolder} // Trigger the function to create a new folder
            >
              <FiFolderPlus className="mr-1" /> {/* Icon for New Folder */}
              New Folder
            </button>
          )}

          {/* Upload File Button */}
          <button
            className="flex items-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onUploadFile} // Trigger the function to upload a file
          >
            <FiUpload className="mr-1" /> {/* Icon for Upload File */}
            Upload File
          </button>

          {/* Toggle to Grid View Button */}
          <button
            className="flex items-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onToggleView('grid')} // Toggle the view to Grid layout
          >
            <FiList /> {/* Icon for Grid View */}
          </button>

          {/* Toggle to List View Button */}
          <button
            className="flex items-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => onToggleView('list')} // Toggle the view to List layout
          >
            <FiGrid /> {/* Icon for List View */}
          </button>
        </div>
      </div>

      {/* Section 3: Breadcrumb Navigation */}
      <div className="flex items-center mt-4 space-x-2">
        <span className="text-gray-500">Current Path:</span>
        <nav className="flex space-x-2">
          
          {/* Home Button: Always visible, returns to the root directory */}
          <button
            className={`text-blue-500 hover:underline ${currentPath.length === 0 ? 'font-bold' : ''}`}
            onClick={() => onBreadcrumbClick(0)} // Navigate to the root directory (index 0)
          >
            Home
          </button>
          
          {/* Breadcrumb Navigation: Dynamically generates buttons for each folder in the current path */}
          {currentPath.map((folder, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span>/</span> {/* Separator between folders */}
              <button
                className={`text-blue-500 hover:underline ${index === currentPath.length - 1 ? 'font-bold' : ''}`}
                onClick={() => onBreadcrumbClick(index + 1)} // Navigate to the selected directory
              >
                {folder}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Header;
