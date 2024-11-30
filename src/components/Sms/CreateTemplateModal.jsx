import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  FormHelperText,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import AddSenderIDModal from "./AddSenderIdModal";
import Modal from "../Modal";

import { senderId, smsTemplate } from "../../services/api";
import { toast } from "react-toastify";

const CreateTemplateModal = ({
  onClose,
  user,
  refreshTemplates,
  refreshSenderIds,
}) => {
  const [templateName, setTemplateName] = useState("");
  const [selectedSenderId, setSelectedSenderId] = useState("");
  const [dltTemplateId, setDltTemplateId] = useState("");
  const [smsContent, setSmsContent] = useState("");
  const [language, setLanguage] = useState("English");
  const [errors, setErrors] = useState({});
  const [isSenderIDModalOpen, setSenderIDModalOpen] = useState(false);
  const [senderIdsList, setSenderIdsList] = useState([]); // List of sender IDs
  const [loadingSenderIds, setLoadingSenderIds] = useState(false); // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSenderIds = async () => {
    try {
      setLoadingSenderIds(true);
      const response = await senderId({ action: "read", username: user });

      setSenderIdsList(response?.data?.data || []);
    } catch (error) {
      toast.error("Failed to load Sender IDs");
    } finally {
      setLoadingSenderIds(false);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true); // Show loading state

        const payload = {
          action: "create",
          template_name: templateName,
          sender_id: selectedSenderId,
          dlt_template_id: dltTemplateId,
          unicode: language === "Unicode" ? 1 : 0, // 0 for English, 1 for Unicode
          sms_content: smsContent,
          username: user,
        };

        await smsTemplate(payload); // Call the API to create the template
        toast.success("Template created successfully!");

        refreshTemplates();
        onClose(); // Close the modal
      } catch (error) {
        toast.error("Failed to create template. Please try again.");
      } finally {
        setIsSubmitting(false); // Hide loading state
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!templateName.trim())
      newErrors.templateName = "Template Name is required";
    if (!selectedSenderId) newErrors.senderId = "Sender ID is required";
    if (!smsContent.trim()) newErrors.smsContent = "SMS Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSmsContentChange = (e) => {
    const value = e.target.value;
    setSmsContent(value);

    // Regular expression to check for non-ASCII characters (Unicode)
    const isUnicode = /[^\u0000-\u007F]/.test(value);
    setLanguage(isUnicode ? "Unicode" : "English");
  };

  const handleAddVariable = () => {
    setSmsContent(smsContent + "##variable##");
  };

  const handleAddSenderID = () => {
    setSenderIDModalOpen(true);
  };

  const closeAddSenderID = () => {
    setSenderIDModalOpen(false);
  };

  useEffect(() => {
    fetchSenderIds();
  }, []);

  return (
    <Box>
      <Typography variant="h6">Create Template</Typography>

      {/* First Row: Template Name and Sender ID */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Template Name"
            fullWidth
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            margin="normal"
            required
            error={!!errors.templateName}
            helperText={errors.templateName}
            size="small"
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.selectedSenderId}
            size="small"
          >
            <InputLabel>Sender ID</InputLabel>
            <Select
              value={selectedSenderId}
              onChange={(e) => {
                if (e.target.value === "add") {
                  handleAddSenderID(); // Open Modal if "Add Sender ID" is selected
                } else {
                  setSelectedSenderId(e.target.value);
                }
              }}
              required
              label="Sender ID"
            >
              <MenuItem value="add">+ Add Sender ID</MenuItem>
              {senderIdsList.map((sId) => (
                <MenuItem key={sId?.id} value={sId.sender_id}>
                  {sId.sender_id}
                </MenuItem>
              ))}
            </Select>
            {loadingSenderIds && <CircularProgress size={20} sx={{ mt: 1 }} />}
            {errors.senderId && (
              <FormHelperText>{errors.senderId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {/* DLT Template ID */}
      <TextField
        label="DLT Template ID"
        fullWidth
        value={dltTemplateId}
        onChange={(e) => setDltTemplateId(e.target.value)}
        margin="normal"
        size="small"
      />

      <Typography variant="caption" display="block">
        For India: Add correct Template ID that is approved on DLT platform.
      </Typography>

      {/* Language Radio Buttons */}
      <FormControl fullWidth margin="normal">
        <Typography variant="body2">Language</Typography>
        <RadioGroup
          row
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <FormControlLabel
            value="English"
            control={<Radio />}
            label="English"
          />
          <FormControlLabel
            value="Unicode"
            control={<Radio />}
            label="Unicode"
          />
        </RadioGroup>
      </FormControl>

      <TextField
        label="SMS Content"
        fullWidth
        value={smsContent}
        onChange={handleSmsContentChange}
        margin="normal"
        multiline
        rows={4}
        placeholder="Enter Message Here..."
        required
        error={!!errors.smsContent}
        helperText={errors.smsContent}
        size="small"
      />

      {/* + Add Variable Link */}
      <Button
        variant="text"
        color="primary"
        onClick={handleAddVariable}
        size="small"
      >
        + Add Variable
      </Button>

      {/* Variables Information */}
      <Typography variant="caption" display="block">
        Variables: Should be defined as ##name##, ##number##, ##email## and so
        on.
      </Typography>

      {/* Bottom Buttons: Cancel and Create */}
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          variant="text"
          onClick={onClose}
          sx={{ marginRight: 2 }}
          size="small"
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ backgroundColor: "#1976d2" }}
          size="small"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Create"
          )}
        </Button>
      </Box>

      {isSenderIDModalOpen && (
        <Modal
          isModalOpen={isSenderIDModalOpen}
          closeModal={closeAddSenderID}
          width="45%"
          height="55%"
          className="rounded-lg"
        >
          <AddSenderIDModal
            handleClose={closeAddSenderID}
            user={user}
            refreshSenderIds
          />
        </Modal>
      )}
    </Box>
  );
};

export default CreateTemplateModal;
