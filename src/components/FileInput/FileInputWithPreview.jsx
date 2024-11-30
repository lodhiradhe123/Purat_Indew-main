import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const FileInputWithPreview = ({ name, label, fileUrl, handleChange, removeFile,  }) => {
  return (
    <div className="w-full px-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        name={name}
        onChange={handleChange}
        className="mt-1 p-2 w-full border rounded"
        
      />
      
    </div>
  );
};

export default FileInputWithPreview;
