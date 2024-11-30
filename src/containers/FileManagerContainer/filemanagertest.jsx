
import React, { useState } from 'react';

import Header from '../../components/FileManager/Header';
import MainContent from '../../components/FileManager/MainContent';
import FolderCreationModal from '../../components/FileManager/FolderCreationModal'; // Corrected import
import FileUploadModal from '../../components/FileManager/FileUploadModal';
import Footer from "../../components/Footer/Footer";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [view, setView] = useState('list');
  const [isFolderModalOpen, setFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [isFileUploadModalOpen, setFileUploadModalOpen] = useState(false);


  const handleSearch = (e) => {
    // Implement search logic here
  };

  const handleNewFolder = () => {
    setFolderToEdit(null); // Ensure no folder is being edited
    setFolderModalOpen(true);
  };

  const handleRefresh = () => {
    // Implement refresh logic here
  };

  const handleToggleView = (viewType) => {
    setView(viewType);
  };

  const handleCreateFolder = (folderName, folderId = null) => {
    if (folderId) {
      // Editing an existing folder
      const updatedContents = getCurrentFolderContents().map(file =>
        file.id === folderId ? { ...file, name: folderName } : file
      );
      updateCurrentFolderContents(updatedContents);
    } else {
      // Creating a new folder
      const newFolder = { id: Date.now(), name: folderName, type: 'folder', icon: '/assets/images/png/blue-folder-13669.png', contents: [] };
      updateCurrentFolderContents([...getCurrentFolderContents(), newFolder]);
    }
    setFolderModalOpen(false);
  };

  const handleUploadFile = (file) => {
    const newFile = { id: Date.now(), name: file.name, type: file.type, icon: '/assets/images/png/file.png' };
    updateCurrentFolderContents([...getCurrentFolderContents(), newFile]);
    setFileUploadModalOpen(false);
  };

  const handleDeleteFile = (id) => {
    const updatedContents = getCurrentFolderContents().filter(file => file.id !== id);
    updateCurrentFolderContents(updatedContents);
  };

  const handleEditFile = (id) => {
    const fileToEdit = getCurrentFolderContents().find(file => file.id === id);
    if (fileToEdit.type === 'folder') {
      setFolderToEdit(fileToEdit);
      setFolderModalOpen(true);
    } else {
      setFileUploadModalOpen(true);
    }
  };

  const handleFolderClick = (folder) => {
    setCurrentPath([...currentPath, folder.name]);
  };

  const handleBreadcrumbClick = (index) => {
    setCurrentPath(currentPath.slice(0, index));
  };

  const getCurrentFolderContents = () => {
    return currentPath.reduce((acc, folderName) => {
      const folder = acc.find(item => item.type === 'folder' && item.name === folderName);
      return folder ? folder.contents : [];
    }, files);
  };

  const updateCurrentFolderContents = (newContents) => {
    const updatedFiles = [...files];
    let folder = updatedFiles;
    currentPath.forEach(folderName => {
      const foundFolder = folder.find(item => item.type === 'folder' && item.name === folderName);
      if (foundFolder) {
        folder = foundFolder.contents;
      }
    });
    // Create a new array to ensure immutability
    folder.length = 0;
    folder.push(...newContents);
    setFiles(updatedFiles);
  };

  return (
    <div className="mb-0">
      <div className="flex mt-0">
        <div className="flex-1">
          {/* header */}
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
            {/* Centered Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
              File Hosting
            </h1>
          </div>
          {/* header */}
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
          <Footer />
        </div>
        {isFolderModalOpen && (
          <FolderCreationModal
            isOpen={isFolderModalOpen}
            onClose={() => setFolderModalOpen(false)}
            onCreate={handleCreateFolder}
            folderToEdit={folderToEdit}
          />
        )}
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

