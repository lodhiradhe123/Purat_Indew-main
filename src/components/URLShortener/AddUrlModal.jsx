import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

const AddUrlModal = ({ onClose, onSubmit }) => {
  const [urlType, setUrlType] = useState("");
  const [longURL, setLongURL] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit(urlType, longURL);
    setUrlType("");
    setLongURL("");
    onClose(); // Close the modal after submission
  };

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {/* Modal Heading */}
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Add a New URL
      </Typography>

      {/* Input Fields */}
      <TextField
        label="Input Type"
        value={urlType}
        onChange={(e) => setUrlType(e.target.value)}
        required
      />
      <TextField
        label="Long URL"
        type="url"
        value={longURL}
        onChange={(e) => setLongURL(e.target.value)}
        required
      />

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faLink} />}
        >
          Shorten URL
        </Button>
      </Box>
    </Box>
  );
};

export default AddUrlModal;
