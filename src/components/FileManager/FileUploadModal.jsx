import React, { useState, useRef } from 'react';
import { Modal, Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme) => ({
  // Section 1: Styles for the modal and its elements
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ddd',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '50%',
    [theme.breakpoints.down('sm')]: {
      width: '80%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  optionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    cursor: 'pointer',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    margin: '10px',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  selectedOption: {
    backgroundColor: '#f5f5f5',
    borderColor: '#337ab7',
    borderWidth: '2px',
  },
  fileInput: {
    display: 'none',
  },
  filePreview: {
    width: '100%',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '5px',
    margin: '10px',
  },
}));

const FileUploadModal = ({ onClose, onUpload }) => {
  const classes = useStyles();

  // Section 2: State Management
  const [selectedOption, setSelectedOption] = useState(null); // Tracks the selected file type option
  const [fileName, setFileName] = useState(''); // Stores the name of the selected file
  const fileInputRef = useRef(null); // Reference to the hidden file input element
  const [file, setFile] = useState(null); // Stores the selected file

  // Array of available file type options
  const options = [
    {
      id: 1,
      name: 'Images',
      icon: '/assets/images/svg/IMGS.svg',
      accept: '.jpeg,.jpg,.png',
    },
    {
      id: 2,
      name: 'Videos',
      icon: '/assets/images/svg/VIDEOS.svg',
      accept: 'video/*',
    },
    {
      id: 3,
      name: 'Documents',
      icon: '/assets/images/svg/DOC.svg',
      accept: '.pdf,.doc,.docx',
    },
    {
      id: 4,
      name: 'Audios',
      icon: '/assets/images/svg/AUDIO.svg',
      accept: 'audio/*',
    },
    {
      id: 5,
      name: 'Stickers',
      icon: '/assets/images/svg/STICKERS.svg',
      accept: '.png,.gif,.jpg,.jpeg',
    },
  ];

  // Section 3: Option Selection
  const handleOptionClick = (id) => {
    setSelectedOption(id); // Update the selected option when a file type is chosen
  };

  // Get the accepted file types based on the selected option
  const getAcceptType = () => {
    const selected = options.find((option) => option.id === selectedOption);
    return selected ? selected.accept : '*/*'; // Default to accepting all file types if no option is selected
  };

  // Section 4: File Input and Preview
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically open the file input dialog
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);    // Update the selected file state
      setFileName(file.name);    // Set the file name for display
    }
   
  };

  // Section 5: Upload and Close Actions
  const handleUploadClick = () => {
    
    if (fileName && file) {
      onUpload({ name: fileName, type: file.type, icon: URL.createObjectURL(file),file:file }); // Trigger the upload function passed via props
      onClose(); // Close the modal after uploading
    } else {
      alert('Please select a file and provide a file name.'); // Alert the user if no file is selected or file name is missing
    }
  };

  return (
    <Modal
      aria-labelledby="file-upload-modal"
      aria-describedby="file-upload-modal-description"
      className={classes.modal}
      open={true}
      onClose={onClose} // Close the modal when requested
    >
      <div className={classes.paper}>
        <Typography variant="h6" id="file-upload-modal">
          File Upload
        </Typography>
        <Typography variant="body2" id="file-upload-modal-description">
          Select a file to upload
        </Typography>

        {/* Section 3: Option Selection */}
        <ul className={classes.optionList}>
          {options.map((option) => (
            <li
              key={option.id}
              className={`${classes.option} ${selectedOption === option.id ? classes.selectedOption : ''}`}
              onClick={() => handleOptionClick(option.id)} // Select the file type option on click
            >
              <img src={option.icon} alt={option.name} /> {/* Display the icon for the file type */}
              {option.name} {/* Display the name of the file type */}
            </li>
          ))}
        </ul>

        {/* Section 4: File Input and Preview */}
        <div className="flex flex-col justify-center items-center">
          <input
            type="file"
            accept={getAcceptType()} // Restrict the file types based on the selected option
            ref={fileInputRef} // Reference to the hidden file input
            className={classes.fileInput}
            onChange={handleFileChange} // Handle file selection
          />
          <Button variant="contained" color="primary" onClick={handleBrowseClick}>
            Choose File
          </Button>
          {file && (
            <div className="mb-4">
              <img src={URL.createObjectURL(file)} alt="Selected file" className={classes.filePreview} /> {/* Display file preview */}
            </div>
          )}
          <TextField
            label="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)} // Update the file name as the user types
            className="w-full mb-4"
          />
          <Typography variant="body2" color="textSecondary">
            Supported Files: png, jpeg, jpg, gif, bmp, tiff, webp, svg+xml, eps, raw, ico, x-icon, vnd.microsoft.icon, postscript, json, mp4, quicktime, pdf
          </Typography>

          {/* Section 5: Upload and Close Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="contained" color="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={handleUploadClick}>
              Upload
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FileUploadModal;
