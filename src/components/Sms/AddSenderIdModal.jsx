import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  FormHelperText,
  Link,
  CircularProgress,
} from "@mui/material";

import { toast } from "react-toastify";
import { senderId } from "../../services/api";

// Modal Component for Adding Sender ID
const AddSenderIDModal = ({ handleClose, user, refreshSenderIds }) => {
  const [senderIDSections, setSenderIDSections] = useState([
    { destinationCountry: "", senderIDHeader: "", error: false },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle input changes for a specific section
  const handleInputChange = (index, field, value) => {
    const updatedSections = [...senderIDSections];
    updatedSections[index][field] = value;
    setSenderIDSections(updatedSections);
  };

  // Function to validate a specific section
  const validateSection = (index) => {
    const section = senderIDSections[index];
    return section.destinationCountry && section.senderIDHeader;
  };

  // Function to handle adding more sections
  const handleAddMore = () => {
    const lastIndex = senderIDSections.length - 1;

    // Validate the last section before adding a new one
    if (validateSection(lastIndex)) {
      setSenderIDSections([
        ...senderIDSections,
        { destinationCountry: "", senderIDHeader: "", error: false },
      ]);
    } else {
      // If the last section is invalid, set an error for that section
      const updatedSections = [...senderIDSections];
      updatedSections[lastIndex].error = true;
      setSenderIDSections(updatedSections);
    }
  };

  // Function to handle saving data
  const handleSave = async () => {
    const isValid = senderIDSections.every((section) =>
      validateSection(senderIDSections.indexOf(section))
    );

    if (isValid) {
      // Prepare the payload for the API
      const payload = {
        action: "create",
        sender_ids: senderIDSections.map((section) => ({
          sender_id: section.senderIDHeader,
          username: user, // Assuming the `user` prop contains username
          country_name: section.destinationCountry,
        })),
      };

      try {
        setIsSubmitting(true); // Set loading state
        await senderId(payload); // Call the API

        toast.success("Sender IDs added successfully!");
        refreshSenderIds();
        handleClose(); // Close the modal on success
      } catch (error) {
        toast.error("Failed to add Sender IDs. Please try again.");
      } finally {
        setIsSubmitting(false); // Reset loading state
      }
    } else {
      // Highlight errors if any section is invalid
      const updatedSections = senderIDSections.map((section) => ({
        ...section,
        error: !validateSection(senderIDSections.indexOf(section)),
      }));
      setSenderIDSections(updatedSections);
    }
  };

  // Function to handle removing a section
  const handleRemoveSection = (index) => {
    const updatedSections = senderIDSections.filter((_, i) => i !== index);
    setSenderIDSections(updatedSections);
  };

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Add Sender ID Details
      </Typography>

      {/* Render each section */}
      {senderIDSections.map((section, index) => (
        <Box
          key={index}
          sx={{
            marginBottom: 2,
            border: "1px solid #ccc",
            padding: 2,
            borderRadius: "8px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl
                fullWidth
                error={section.error && !section.destinationCountry}
                size="small"
              >
                <InputLabel>Destination Country</InputLabel>
                <Select
                  value={section.destinationCountry}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "destinationCountry",
                      e.target.value
                    )
                  }
                  label="Destination Country"
                  required
                >
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="USA">USA</MenuItem>
                  <MenuItem value="UK">UK</MenuItem>
                </Select>
                {section.error && !section.destinationCountry && (
                  <FormHelperText>This field is required</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Sender ID (Header)"
                fullWidth
                value={section.senderIDHeader}
                onChange={(e) =>
                  handleInputChange(index, "senderIDHeader", e.target.value)
                }
                error={section.error && !section.senderIDHeader}
                helperText={
                  section.error && !section.senderIDHeader
                    ? "This field is required"
                    : ""
                }
                size="small"
              />
            </Grid>
          </Grid>

          {/* Remove Button */}
          {index > 0 && (
            <Button
              variant="text"
              color="error"
              onClick={() => handleRemoveSection(index)}
              sx={{ marginTop: 2 }}
            >
              Remove
            </Button>
          )}
        </Box>
      ))}

      <Link
        href="#"
        variant="body2"
        sx={{ display: "block", marginTop: 2 }}
        onClick={handleAddMore}
      >
        + Add More
      </Link>

      {/* Modal Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button onClick={handleClose} sx={{ marginRight: 2 }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Create"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default AddSenderIDModal;
