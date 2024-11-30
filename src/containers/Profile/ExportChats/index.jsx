// src/containers/Profile/ImportExportChats/index.js
import React, { useState } from 'react';

const ExportChats = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
  };

  const handleFileUploadClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleExport = () => {
    alert('Export started');
    // Logic for exporting chats
  };

  return (
    <div className="p-6 bg-blue rounded shadow-md ">
      <div
        className="border-dashed border-4 border-gray-300 p-12 text-center rounded-lg"
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".zip"
        />
        <div onClick={handleFileUploadClick} className="cursor-pointer">
          <img src="/path/to/your/upload-icon.png" alt="Upload Icon" className="mx-auto mb-4" />
          <p className="text-gray-600">Upload the chat backup (zip) here</p>
          <p className="text-gray-600">Drag & Drop files here</p>
          <button className="mt-4 p-2 bg-blue-500 text-white rounded">Browse files</button>
        </div>
      </div>
      {file && <p className="mt-4 text-center">{file.name}</p>}
      <div className="mt-8 flex justify-center">
        <button onClick={handleExport} className="p-2 bg-blue-500 text-white rounded">
          Start Export
        </button>
      </div>
    </div>
  );
};

export default ExportChats;

