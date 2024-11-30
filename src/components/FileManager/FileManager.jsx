import React, { useState } from "react";
import Sidebar from "../FileManager/Sidebar";
import Header from "../FileManager/Header";
import MainContent from "../FileManager/MainContent";
import FolderCreationModal from "../FileManager/FolderCreationModel";
import FileUploadModal from "../FileManager/FileUploadModal";
import DashboardNavbar from "../Navbar/DashboardNavbar";
import Footer from "../Footer/Footer";
import { fileHosting } from "../../services/api";

const FileManager = () => {
  // Section 1: State Management
  const [files, setFiles] = useState([]); // Stores the files and folders
  const [currentPath, setCurrentPath] = useState([]); // Tracks the current navigation path as an array of folder names
  const [view, setView] = useState("list"); // Controls whether files are displayed in 'list' or 'grid' view
  const [isFolderModalOpen, setFolderModalOpen] = useState(false); // State to manage the visibility of the folder creation modal
  const [folderToEdit, setFolderToEdit] = useState(null); // Stores the folder that is being edited
  const [isFileUploadModalOpen, setFileUploadModalOpen] = useState(false); // State to manage the visibility of the file upload modal

  console.log("radheeeeeeeeeee");

  // Section 2: Handlers for File Operations
  const handleSearch = (e) => {
    // Implement search logic here (Filtering files based on search input)
  };

  const handleNewFolder = () => {
    setFolderToEdit(null); // Ensure no folder is being edited before opening the folder creation modal
    setFolderModalOpen(true); // Open the folder creation modal
  };

  const handleRefresh = () => {
    // Implement refresh logic here (Reloading or resetting the view)
  };

  const handleToggleView = (viewType) => {
    setView(viewType); // Toggle between 'list' and 'grid' view
  };

  const handleCreateFolder = (folderName, folderId = null) => {
    if (folderId) {
      // Editing an existing folder
      const updatedContents = getCurrentFolderContents().map((file) =>
        file.id === folderId ? { ...file, name: folderName } : file
      );
      updateCurrentFolderContents(updatedContents); // Update the folder name in the current folder contents
    } else {
      // Creating a new folder
      const newFolder = {
        id: Date.now(), // Unique ID for the folder
        name: folderName,
        type: "folder",
        icon: "/assets/images/png/blue-folder-13669.png", // Default folder icon
        contents: [], // New folders start with empty contents
      };
      updateCurrentFolderContents([...getCurrentFolderContents(), newFolder]); // Add the new folder to the current folder contents
    }
    setFolderModalOpen(false); // Close the folder creation modal
  };

  const handleUploadFile = (file) => {
    const newFile = {
      id: Date.now(), // Unique ID for the file
      name: file.name,
      type: file.type,
      icon: "/assets/images/png/file.png", // Default file icon
    };
    updateCurrentFolderContents([...getCurrentFolderContents(), newFile]); // Add the uploaded file to the current folder contents
    setFileUploadModalOpen(false); // Close the file upload modal
  };

  const handleDeleteFile = async (id) => {
    const payload = {
      action: "deleteFile",
      username: "rahul1011",
      id: "1",
    };

    try {
      const response = await fileHosting(payload);
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
    const updatedContents = getCurrentFolderContents().filter(
      (file) => file.id !== id
    ); // Filter out the file to be deleted
    updateCurrentFolderContents(updatedContents); // Update the current folder contents without the deleted file
  };

  const handleEditFile = (id) => {
    const fileToEdit = getCurrentFolderContents().find(
      (file) => file.id === id
    ); // Find the file to be edited
    if (fileToEdit.type === "folder") {
      setFolderToEdit(fileToEdit); // Set the folder to be edited
      setFolderModalOpen(true); // Open the folder creation modal for editing
    } else {
      setFileUploadModalOpen(true); // Open the file upload modal (assuming this is for editing file details)
    }
  };

  // Section 3: Folder Navigation
  const handleFolderClick = (folder) => {
    setCurrentPath([...currentPath, folder.name]); // Add the folder name to the current path, navigating into the folder
    console.log(currentPath);
  };

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index)); // Navigate back to a previous folder based on breadcrumb click
  };

  // Section 4: Utility Functions
  const getCurrentFolderContents = () => {
    // Navigate through the folder structure according to the current path and return the contents of the current folder
    return currentPath.reduce((acc, folderName) => {
      const folder = acc.find(
        (item) => item.type === "folder" && item.name === folderName
      );
      return folder ? folder.contents : [];
    }, files);
  };

  const updateCurrentFolderContents = (newContents) => {
    // Navigate through the folder structure according to the current path and update the contents of the current folder
    const updatedFiles = [...files];
    let folder = updatedFiles;
    currentPath.forEach((folderName) => {
      const foundFolder = folder.find(
        (item) => item.type === "folder" && item.name === folderName
      );
      if (foundFolder) {
        folder = foundFolder.contents;
      }
    });
    folder.splice(0, folder.length, ...newContents); // Replace the current folder's contents with the new contents
    setFiles(updatedFiles); // Update the files state with the modified folder contents
  };

  // Section 5: Rendering the Component
  return (
    <div className="mb-0">
      <DashboardNavbar /> {/* Navigation bar at the top of the page */}
      <div className="flex mt-0">
        <Sidebar /> {/* Sidebar navigation on the left */}
        <div className="flex-1">
          {/* Header section with title */}
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
              File Hosting
            </h1>
          </div>
          {/* Main header with search, view toggle, etc. */}
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
            <Header
              onSearch={handleSearch}
              onNewFolder={handleNewFolder}
              onRefresh={handleRefresh}
              onToggleView={handleToggleView}
              onUploadFile={() => setFileUploadModalOpen(true)}
              currentPath={currentPath}
              onBreadcrumbClick={handleBreadcrumbClick}
            />
            <MainContent
              view={view}
              files={getCurrentFolderContents()}
              onFolderClick={handleFolderClick}
              onDeleteFile={handleDeleteFile}
              onEditFile={handleEditFile}
            />
          </div>
          <Footer /> {/* Footer section at the bottom of the page */}
        </div>
        {/* Folder creation modal */}
        {isFolderModalOpen && (
          <FolderCreationModal
            isOpen={isFolderModalOpen}
            onClose={() => setFolderModalOpen(false)}
            onCreate={handleCreateFolder}
            folderToEdit={folderToEdit}
          />
        )}
        {/* File upload modal */}
        {isFileUploadModalOpen && (
          <FileUploadModal
            isOpen={isFileUploadModalOpen}
            onClose={() => setFileUploadModalOpen(false)}
            onUpload={handleUploadFile}
          />
        )}
      </div>
    </div>
  );
};

export default FileManager;
