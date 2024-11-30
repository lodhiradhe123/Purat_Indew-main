import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CallerIdModal from "../../components/Voice/CallerIdModal";
import Modal from "../../components/Modal";

import { UploadIcon, ArrowLeftIcon } from "@heroicons/react/solid";

import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";

import handleApiError from "../../utils/errorHandler";
import { voiceAudios, voiceBroadcast, voiceCallerId } from "../../services/api";

const NewBroadcastVoice = ({ closeModal, user, reFetchData }) => {
  const [formData, setFormData] = useState({
    broadcastName: "",
    callerNumber: "",
    selectedAudio: "",
    retries: 1,
    responseInput: "",
    callbackAudio: "",
    callFailedMessage: "",
    callFailedWhatsApp: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // Track the current step
  const [callerIDs, setCallerIDs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedAudio, setSelectedAudio] = useState({
    name: "",
    duration: 0,
  });
  const [audioFiles, setAudioFiles] = useState([]);
  const [creditCount, setCreditCount] = useState(0);

  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rows, setRows] = useState([
    { id: 1, dtmf: "", selectedAudio: "", isEnabled: true },
  ]);

  const [uploadType, setUploadType] = useState("Voice");
  const [mobileNumbers, setMobileNumbers] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [contactCount, setContactCount] = useState(0);
  const [csvPreview, setCsvPreview] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [errors, setErrors] = useState({
    broadcastName: "",
    callerNumber: "",
    selectedAudio: "",
    contacts: "",
  });

  const fetchCallerIds = async () => {
    try {
      const response = await voiceCallerId({ action: "read", username: user });

      if (response?.data?.status) {
        const idsFromAPI = response.data.data.map((item) => item.caller_id);
        setCallerIDs(["9999999999", ...idsFromAPI]); // Include default caller number
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchAudioFiles = async () => {
    setLoading(true);
    try {
      const payload = { username: user, action: "read" }; // Payload for the API
      const response = await voiceAudios(payload);

      if (response?.data?.status) {
        const audioList = response.data.data.reverse().map((audio) => ({
          id: audio.id,
          name: audio.name,
          url: audio.audio,
          date: audio.date,
          size: audio.filesize,
        }));
        setAudioFiles(audioList);
      } else {
        toast.error(response?.data?.message || "Failed to fetch audio files.");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAudioFile = async (username, file) => {
    if (!file) {
      throw new Error("No file selected");
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("action", "create");
    formData.append("audio_name", file.name);
    formData.append("audio_file_url", file);

    setIsUploading(true);
    try {
      const response = await voiceAudios(formData);
      if (response?.status === 201) {
        return response;
      } else {
        throw new Error(
          response?.data?.message || "Failed to upload audio file."
        );
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Create a promise to handle audio metadata loading
      const getDuration = () => {
        return new Promise((resolve, reject) => {
          const audio = document.createElement("audio");
          audio.src = URL.createObjectURL(file);

          audio.onloadedmetadata = () => {
            const duration = Math.ceil(audio.duration);
            URL.revokeObjectURL(audio.src);
            resolve(duration);
          };

          audio.onerror = () => {
            URL.revokeObjectURL(audio.src);
            reject(new Error("Failed to load audio metadata"));
          };
        });
      };

      // Get duration first
      const duration = await getDuration();

      // Check duration before proceeding with upload
      if (duration > 120) {
        toast.error("Audio duration cannot exceed 120 seconds.");
        return;
      }

      // Proceed with upload if duration is valid
      const response = await uploadAudioFile(user, file);

      if (response?.data?.status) {
        toast.success("Audio file uploaded successfully!");
        fetchAudioFiles(); // Refresh audio list
      } else {
        toast.error(response?.data?.message || "Failed to upload audio file.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAudioSelect = (audio) => {
    if (audio.duration > 120) {
      toast.error("Audio duration cannot exceed 120 seconds.");
      return; // Do not allow selection of this audio
    }

    setErrors((prev) => ({
      ...prev,
      selectedAudio: "",
    }));

    const calculatedCredits = Math.ceil(audio.duration / 30);
    const totalCredits = calculatedCredits * contactCount;

    setSelectedAudio({
      name: audio.name,
      duration: audio.duration,
      url: audio.url,
    });
    setFormData((prev) => ({
      ...prev,
      selectedAudio: `${audio.name} (${audio.duration}s)`,
    }));

    // Update the credit count
    setCreditCount(totalCredits);
    setFormData((prev) => ({
      ...prev,
      calculatedCredits, // Add the raw calculatedCredits to formData
    }));
  };

  const handleModalSubmit = (phoneNumber) => {
    setCallerIDs((prevIDs) => [...prevIDs, phoneNumber]);
    setFormData({ ...formData, callerNumber: phoneNumber });
    setIsModalOpen(false); // Close the modal after submitting
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("username", user);
      payload.append("broadcast_name", formData.broadcastName);
      payload.append("caller_id", formData.callerNumber);
      payload.append("audio_file_url", selectedAudio.url); // Use the selected audio file name
      payload.append("contacts", contactCount); // Use the contact count
      payload.append("counts", formData.calculatedCredits); // Use the calculated credit count
      payload.append("call_failed_message", formData.callFailedMessage);
      payload.append("call_failed_whatsapp", formData.callFailedWhatsApp);
      payload.append("retries", formData.retries);

      if (uploadType === "Voice") {
        payload.append("textbox", mobileNumbers);
      } else if (uploadType === "Custom_Voice") {
        if (csvFile) {
          payload.append("csv_file", csvFile);
        } else {
          toast.error("Please upload a CSV file for Custom Voice.");
          setIsSubmitting(false);
          return;
        }
      }

      const validCallbackAudio = rows.filter(isRowValid).map((row) => ({
        dtmf: row.dtmf,
        selected_audio: row.selectedAudio,
      }));

      if (validCallbackAudio.length > 0) {
        payload.append("callback_audio", JSON.stringify(validCallbackAudio));
      }

      const response = await voiceBroadcast(payload);

      if (response.data.status) {
        toast.success("Broadcast submitted successfully!");
        reFetchData();
        closeModal();
      } else {
        toast.error("Submission failed, please try again.");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadTypeChange = (event) => {
    setUploadType(event.target.value);
    setContactCount(0);
    setCsvFile(null);
    setCsvPreview([]);
    setMobileNumbers("");
  };

  const handleMobileNumbersChange = (event) => {
    const input = event.target.value;

    setErrors((prev) => ({
      ...prev,
      contacts: "",
    }));

    // Build a new input string by only allowing numeric characters and newlines
    const filteredInput = input
      .split("")
      .filter((char) => /^[0-9\n]*$/.test(char))
      .join("");

    setMobileNumbers(filteredInput);

    const validNumbers = filteredInput
      .split(/\n/)
      .filter((num) => num.trim() !== "");
    setContactCount(validNumbers.length);

    const audioDuration = selectedAudio.duration || 0;
    const calculatedCredits = Math.ceil(audioDuration / 30);
    const totalCredits = calculatedCredits * validNumbers.length;
    setCreditCount(totalCredits);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const currentNumbers = mobileNumbers
        .split("\n")
        .filter((num) => num.trim() !== "");
      const lastNumber = currentNumbers[currentNumbers.length - 1];

      // Check if the last entry is a valid number before adding a newline
      if (/^\d+$/.test(lastNumber)) {
        const newNumbers = [...currentNumbers, ""].join("\n");
        setMobileNumbers(newNumbers);

        // Update the count immediately
        setContactCount(currentNumbers.length);
      }
    }
  };

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(progress); // Update upload progress state
      }
    };

    reader.onload = () => {
      setCsvFile(file);
      setUploadProgress(100); // Set progress to 100% when file reading is complete

      const text = reader.result.trim();
      const rows = text.split("\n").map((row) => row.split(","));

      if (uploadType === "Voice") {
        // For "Voice", ensure only one column exists
        const hasMultipleColumns = rows.some((row) => row.length > 1);
        if (hasMultipleColumns) {
          toast.error("CSV must only contain one column for Voice uploads.");
          setCsvFile(null); // Reset CSV file
          return;
        }
      } else if (uploadType === "Custom_Voice") {
        // For "Custom_Voice", ensure more than one column exists
        if (rows[0].length <= 1) {
          toast.error(
            "CSV must contain more than one column for Customized uploads."
          );
          setCsvFile(null); // Reset CSV file
          return;
        }
      }

      const phoneNumbers = rows
        .slice(1)
        .map((row) => row[0])
        .filter((num) => /^\d+$/.test(num)); // Extract valid phone numbers

      const allNumbers = [
        ...new Set([...mobileNumbers.split(/\s+/), ...phoneNumbers]),
      ].filter((num) => /^\d+$/.test(num)); // Merge and remove duplicates

      setMobileNumbers(allNumbers.join("\n"));
      setContactCount(allNumbers.length);
      setCsvPreview(rows.slice(0, 6)); // Include header for preview, show first 5 data rows

      const audioDuration = selectedAudio.duration || 0;
      const calculatedCredits = Math.ceil(audioDuration / 30);
      const totalCredits = calculatedCredits * allNumbers.length;
      setCreditCount(totalCredits);

      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);
    };

    reader.readAsText(file);
  };

  const downloadSampleCsv = () => {
    const sampleContent =
      uploadType === "Voice"
        ? "PhoneNumber\n918517955165\n918878695196\n7000206013\n919755630170"
        : "PhoneNumber,Name\n919755630170,John Doe\n0987654321,Jane Smith\n";

    const blob = new Blob([sampleContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Sample_${uploadType}_CSV.csv`;
    link.click();

    // Clean up the object URL to release memory
    URL.revokeObjectURL(url);
  };

  const isRowValid = (row) => row.dtmf && row.selectedAudio;

  // Handle DTMF input change
  const handleDTMFChange = (index, value) => {
    if (/^[1-9]?$/.test(value)) {
      setRows((prev) => {
        const updatedRows = prev.map((row, i) =>
          i === index ? { ...row, dtmf: value } : row
        );

        // Enable the next row only if current row becomes valid
        if (isRowValid({ ...updatedRows[index], dtmf: value })) {
          enableNextRow(index, updatedRows);
        }

        // Remove any empty trailing rows except the first one
        return cleanupEmptyRows(updatedRows);
      });
    }
  };

  // Handle audio selection
  const handleAudioChange = (index, value) => {
    setRows((prev) => {
      const updatedRows = prev.map((row, i) =>
        i === index ? { ...row, selectedAudio: value } : row
      );

      // Enable the next row only if current row becomes valid
      if (isRowValid({ ...updatedRows[index], selectedAudio: value })) {
        enableNextRow(index, updatedRows);
      }

      // Remove any empty trailing rows except the first one
      return cleanupEmptyRows(updatedRows);
    });
  };

  // Clean up empty trailing rows
  const cleanupEmptyRows = (rows) => {
    if (rows.length === 1) return rows;

    // Keep only rows with data and the first empty row
    const validRows = rows.filter(
      (row, index) =>
        isRowValid(row) ||
        index === 0 ||
        (index > 0 && isRowValid(rows[index - 1]))
    );

    // Ensure at least one row exists
    return validRows.length === 0
      ? [{ id: 1, dtmf: "", selectedAudio: "", isEnabled: true }]
      : validRows;
  };

  // Enable the next row (if it exists)
  const enableNextRow = (index, rows) => {
    if (index + 1 < rows.length) {
      setRows((prev) =>
        prev.map((row, i) =>
          i === index + 1 ? { ...row, isEnabled: true } : row
        )
      );
    }
  };

  // Add a new row
  const handleAddRow = () => {
    if (rows.length < 4) {
      setRows((prev) => {
        // Only add new row if the last row has data
        const lastRow = prev[prev.length - 1];
        if (isRowValid(lastRow)) {
          return [
            ...prev,
            {
              id: prev.length + 1,
              dtmf: "",
              selectedAudio: "",
              isEnabled: true,
            },
          ];
        }
        return prev;
      });
    }
  };

  // Remove or reset a row
  const handleRemoveRow = (index) => {
    setRows((prev) => {
      if (prev.length === 1) {
        // Reset the single row if it's the only one
        return [{ id: 1, dtmf: "", selectedAudio: "", isEnabled: true }];
      }

      // Remove the row and clean up any trailing empty rows
      const updatedRows = prev.filter((_, i) => i !== index);
      return cleanupEmptyRows(updatedRows);
    });
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.broadcastName.trim()) {
      newErrors.broadcastName = "Broadcast name is required";
    }

    if (!formData.callerNumber) {
      newErrors.callerNumber = "Caller number is required";
    }

    if (!selectedAudio.name) {
      newErrors.selectedAudio = "Please select an audio file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (contactCount === 0) {
      newErrors.contacts = "Please add at least one contact";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    const hasValidRow = rows.some((row) => row.dtmf && row.selectedAudio);
    if (!hasValidRow) {
      newErrors.dtmf = "Please complete at least one DTMF row";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;

    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setStep(step + 1);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenAdvanceModal = () => setIsAdvanceModalOpen(true);
  const handleCloseAdvanceModal = () => setIsAdvanceModalOpen(false);

  // Render different steps
  const renderStep1 = () => (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        New Broadcast - Step 1
      </Typography>

      {/* Broadcast Name */}
      <TextField
        label="Broadcast Name"
        name="broadcastName"
        value={formData.broadcastName}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
        error={!!errors.broadcastName}
        helperText={errors.broadcastName}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        sx={{ marginTop: 1 }}
      >
        Add Caller ID
      </Button>

      <FormControl fullWidth margin="normal" error={!!errors.callerNumber}>
        <InputLabel>Caller Number</InputLabel>
        <Select
          name="callerNumber"
          value={formData.callerNumber}
          onChange={(e) => {
            if (e.target.value === "add") {
              handleOpenModal(); // Open modal when "Add Caller ID" is selected
            } else {
              handleInputChange(e);
            }
          }}
          label="Caller Number"
          required
        >
          <MenuItem value="add">+ Add Caller ID</MenuItem>
          {callerIDs.map((id, index) => (
            <MenuItem key={index} value={id}>
              {id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Audio File */}
      <TextField
        label={`Selected Audio (Duration : ${selectedAudio.duration || 0}s)`}
        name="selectedAudio"
        value={selectedAudio.name || ""}
        placeholder="Click an audio file to select"
        fullWidth
        margin="normal"
        required
        error={!!errors.selectedAudio}
        helperText={errors.selectedAudio}
        InputProps={{
          readOnly: true,
        }}
      />

      {/* Text to Speech (Disabled) */}
      <TextField
        label="Text to Speech (Deactivated)"
        name="textToSpeech"
        value={formData.textToSpeech}
        onChange={handleInputChange}
        disabled
        multiline
        rows={4}
        fullWidth
        margin="normal"
        variant="outlined"
        placeholder="Currently Deactivated"
      />
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        New Broadcast - Step 2
      </Typography>

      <Box display="flex" justifyContent="center">
        <RadioGroup row value={uploadType} onChange={handleUploadTypeChange}>
          <FormControlLabel value="Voice" control={<Radio />} label="Voice" />

          <FormControlLabel
            value="Custom_Voice"
            control={<Radio />}
            label="Custom Voice"
          />
        </RadioGroup>
      </Box>

      {uploadType === "Voice" && (
        <Box mt={2}>
          <TextField
            label="Enter Mobile Number or upload a CSV"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={mobileNumbers}
            onChange={handleMobileNumbersChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter one number per line or separated by spaces"
            error={!!errors.contacts}
            helperText={errors.contacts}
            required
          />

          <Box mt={2}>
            <TextField
              label="Contact Count"
              value={contactCount}
              fullWidth
              variant="outlined"
              disabled
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          <Box mt={2}>
            <TextField
              label="Credit Count"
              value={creditCount}
              fullWidth
              variant="outlined"
              disabled
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button variant="contained" component="label">
              Upload CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleCsvUpload}
              />
            </Button>

            {uploadProgress > 0 && (
              <Box ml={2} position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  size={40}
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="textSecondary"
                  >
                    {`${uploadProgress}%`}
                  </Typography>
                </Box>
              </Box>
            )}

            <Button variant="outlined" onClick={downloadSampleCsv}>
              Sample CSV
            </Button>
          </Box>
        </Box>
      )}

      {uploadType === "Custom_Voice" && (
        <Box>
          <Box mt={2}>
            <TextField
              label="Count"
              value={contactCount}
              fullWidth
              variant="outlined"
              disabled
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          <Box mt={2}>
            <TextField
              label="Credit Count"
              value={creditCount}
              fullWidth
              variant="outlined"
              disabled
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Button variant="contained" component="label">
              Upload CSV
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleCsvUpload}
              />
            </Button>

            {uploadProgress > 0 && (
              <Box ml={2} position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  size={40}
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="textSecondary"
                  >
                    {`${uploadProgress}%`}
                  </Typography>
                </Box>
              </Box>
            )}

            <Button variant="outlined" onClick={downloadSampleCsv}>
              Sample CSV
            </Button>
          </Box>

          {csvPreview.length > 0 && (
            <Box mt={2}>
              <Typography fontWeight="bold" gutterBottom>
                CSV Preview :
              </Typography>

              <Box
                sx={{
                  maxHeight: 200,
                  overflowY: "auto",
                  overflowX: "auto", // Enable horizontal scroll if columns are too wide
                  border: "1px solid #ddd",
                  padding: 1,
                  borderRadius: "4px",
                }}
                className="scrollbar-hide"
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {csvPreview[0].map((header, index) => (
                        <th
                          key={index}
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            backgroundColor: "#f4f4f4",
                            fontWeight: "bold",
                            whiteSpace: "nowrap", // Prevent header text wrapping
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvPreview.slice(1, 6).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              whiteSpace: "nowrap", // Prevent cell text wrapping
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  const renderStep3 = () => (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        New Broadcast - Step 3
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Retries</InputLabel>
        <Select
          name="retries"
          value={formData.retries}
          onChange={handleInputChange}
          label="Retries"
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
        </Select>
      </FormControl>

      {/* Call Failed Message */}
      <TextField
        label="Call Failed Message"
        name="callFailedMessage"
        value={formData.callFailedMessage}
        onChange={handleInputChange}
        multiline
        rows={3}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      {/* Call Failed WhatsApp */}
      <TextField
        label="Call Failed WhatsApp"
        name="callFailedWhatsApp"
        value={formData.callFailedWhatsApp}
        onChange={handleInputChange}
        multiline
        rows={3}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleOpenAdvanceModal}
        sx={{ mt: 2 }}
      >
        Advance
      </Button>
    </Box>
  );

  const RenderAdvanceModal = () => {
    const handleCancel = () => {
      // Clear all rows to default state
      setRows([{ id: 1, dtmf: "", selectedAudio: "", isEnabled: true }]);
      handleCloseAdvanceModal(); // Close the modal
    };

    const handleConfirm = () => {
      handleCloseAdvanceModal(); // Close the modal without changing row data
    };

    return (
      <Box>
        <Typography variant="h5" color="primary" gutterBottom>
          Advanced Features
        </Typography>

        {/* Dynamic Rows */}
        {rows.map((row, index) => {
          // Only render row if it's the first row, has data, or previous row has data
          const shouldRenderRow =
            index === 0 ||
            isRowValid(row) ||
            (index > 0 && isRowValid(rows[index - 1]));

          if (!shouldRenderRow) return null;

          return (
            <Box
              key={row.id}
              display="flex"
              alignItems="center"
              gap={2}
              mb={2}
              sx={{ opacity: row.isEnabled || index === 0 ? 1 : 0.5 }}
            >
              {/* DTMF Input */}
              <TextField
                label="DTMF (1-9)"
                type="text"
                size="small"
                value={row.dtmf}
                disabled={!row.isEnabled}
                onChange={(e) => handleDTMFChange(index, e.target.value)}
                inputProps={{
                  maxLength: 1,
                }}
                sx={{ flex: 1 }}
              />

              {/* Audio Selection */}
              <FormControl
                sx={{ flex: 2 }}
                size="small"
                disabled={!row.isEnabled}
              >
                <InputLabel>Select Audio</InputLabel>
                <Select
                  value={row.selectedAudio}
                  onChange={(e) => handleAudioChange(index, e.target.value)}
                >
                  {audioFiles.map((audio) => (
                    <MenuItem key={audio.id} value={audio.name}>
                      {audio.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Add/Remove Buttons */}
              {index === rows.length - 1 && rows.length < 4 ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddRow}
                  disabled={!isRowValid(row)} // Disable until current row is valid
                  sx={{ flex: 0.5 }}
                >
                  +
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveRow(index)}
                  sx={{ flex: 0.5 }}
                  disabled={rows.length === 1} // Disable if only one row is present
                >
                  ×
                </Button>
              )}
            </Box>
          );
        })}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" color="error" onClick={handleCancel}>
            Cancel
          </Button>

          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Box>
      </Box>
    );
  };

  useEffect(() => {
    fetchCallerIds();
    fetchAudioFiles();
  }, []);

  return (
    <Box display="flex" gap={4}>
      {/* Left Section */}
      <Box
        width="60%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            {step > 1 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleBack}
                startIcon={<ArrowLeftIcon />}
              >
                Back
              </Button>
            )}

            {step < 3 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextStep}
                sx={{ marginLeft: "auto" }}
              >
                Next
              </Button>
            )}

            {step === 3 && (
              <Button
                type="submit"
                variant="contained"
                color="success"
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <UploadIcon />
                  )
                }
                disabled={isSubmitting}
                sx={{ marginLeft: "auto" }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </Box>
        </form>
      </Box>

      {/* Right Section - Demo Audio Table */}
      <Box
        width="36%"
        mt={2}
        sx={{
          maxHeight: 450, // Set the height of the audio list container
          overflowY: "auto", // Enable vertical scrolling within this container
          backgroundColor: "white", // Optional: maintain consistent background
        }}
        className="scrollbar-hide"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="textPrimary">
            Audio Files
          </Typography>

          <Button
            variant="contained"
            color="primary"
            component="label"
            disabled={isUploading}
            startIcon={
              isUploading && <CircularProgress size={16} color="inherit" />
            }
          >
            {isUploading ? "Uploading..." : "Add"}
            <input
              type="file"
              accept="audio/*"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
        </Box>

        {loading ? (
          // Show spinner while loading
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
          >
            <CircularProgress color="primary" />
            <Typography variant="body2" ml={2}>
              Loading audio files...
            </Typography>
          </Box>
        ) : audioFiles.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No audio files uploaded yet.
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {audioFiles.map((file) => (
              <Box
                key={file.id}
                border={1}
                borderColor="grey.300"
                borderRadius={2}
                p={2}
                boxShadow={1}
                onClick={() => handleAudioSelect(file)} // Pass the entire file object
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  {file.name}
                </Typography>

                {/* Audio Player */}
                <audio
                  controls
                  src={file.url}
                  onLoadedMetadata={(e) => {
                    const duration = Math.round(e.target.duration);
                    file.duration = duration;

                    setAudioFiles((prevFiles) =>
                      prevFiles.map((f) =>
                        f.id === file.id ? { ...f, duration } : f
                      )
                    );
                  }}
                  style={{ width: "100%" }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Caller ID Modal */}
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          closeModal={handleCloseModal}
          width={400}
          height="35%"
        >
          <CallerIdModal
            closeModal={handleCloseModal}
            handleSubmit={handleModalSubmit}
            user={user}
          />
        </Modal>
      )}

      {isAdvanceModalOpen && (
        <Modal
          isModalOpen={isAdvanceModalOpen}
          closeModal={handleCloseAdvanceModal}
          width={500}
          height="55%"
        >
          <RenderAdvanceModal />
        </Modal>
      )}
    </Box>
  );
};

export default NewBroadcastVoice;
