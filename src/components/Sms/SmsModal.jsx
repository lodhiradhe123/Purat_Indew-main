import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CreateTemplateModal from "./CreateTemplateModal";
import Modal from "../Modal";
import Mobile from "../Mobile";
import AddSenderIDModal from "./AddSenderIdModal";
import AddLinkModal from "../Template/AddLinkModal";

import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { ArrowLeft, Upload } from "@mui/icons-material"; // Using MUI icons

import handleApiError from "../../utils/errorHandler";
import {
  gsmBroadcast,
  gsmCsvBroadcast,
  senderId,
  smsTemplate,
} from "../../services/api";

const SmsModal = ({ closeModal, user, refetchData }) => {
  const [broadcastName, setBroadcastName] = useState("");
  const [step, setStep] = useState(1); // Track the current step
  const [selectedSenderId, setSelectedSenderId] = useState("");
  const [senderIdList, setSenderIdList] = useState([]);
  const [templateId, setTemplateId] = useState(""); // State for selected template ID
  const [templatesList, setTemplatesList] = useState([]); // State for templates
  const [dltTemplateId, setDltTemplateId] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("English");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSenderIDModalOpen, setSenderIDModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("MO");
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [smsCount, setSmsCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadType, setUploadType] = useState("Bulk");
  const [mobileNumbers, setMobileNumbers] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [contactCount, setContactCount] = useState(0);
  const [csvPreview, setCsvPreview] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const previewData = { message };

  const fetchSenderIds = async () => {
    try {
      const payload = { action: "read", username: user?.username };
      const response = await senderId(payload);

      setSenderIdList(response.data?.data || []); // Store sender IDs in state
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const payload = { action: "read", username: user?.username };
      const response = await smsTemplate(payload);
      setTemplatesList(response.data?.data || []); // Store templates in state
    } catch (error) {
      handleApiError(error);
    }
  };

  const calculateSmsCount = (msg, lang) => {
    let length = msg.length;
    if (lang === "Unicode") {
      if (length <= 70) return 1;
      if (length <= 133) return 2;
      if (length <= 199) return 3;
      if (length <= 265) return 4;
      if (length <= 331) return 5;
    } else {
      // English SMS count logic
      if (length <= 160) return 1;
      if (length <= 306) return 2;
      if (length <= 459) return 3;
      if (length <= 612) return 4;
      if (length <= 765) return 5;
      if (length <= 918) return 6;
      if (length <= 1071) return 7;
      if (length <= 1224) return 8;
      if (length <= 1377) return 9;
      if (length <= 1530) return 10;
    }
    return Math.ceil(length / 153); // Fallback for longer messages
  };

  const handleAddLink = (link) => {
    setMessage((prevMessage) => prevMessage + " " + link); // Append the selected link to the message
  };

  const handleBroadcastNameChange = (e) => setBroadcastName(e.target.value);

  // Modified handleSubmit to properly handle CSV submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (selectedMode === "MO" && !selectedSenderId) {
      toast.error("Please select a Sender ID before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Common payload fields
      const basePayload = {
        username: user?.username,
        schedule_date: selectedDate,
        schedule_time: selectedTime,
        sender_id: selectedSenderId,
        unicode: language === "Unicode" ? 1 : 0,
        message: message,
        route: selectedMode,
        counts: smsCount,
        contacts: contactCount,
        template_id: templateId,
        template_dlt_id: dltTemplateId,
        broadcast_name: broadcastName,
      };

      if (uploadType === "Customized") {
        // Create FormData for multi-column CSV submission
        const formDataPayload = new FormData();

        // Append all base payload fields to FormData
        Object.keys(basePayload).forEach((key) => {
          formDataPayload.append(key, basePayload[key]);
        });

        // Append the CSV file
        formDataPayload.append("csv_file", csvFile);

        await gsmCsvBroadcast(formDataPayload);
      } else {
        // For single column CSV or manual numbers, use regular payload with textbox
        await gsmBroadcast({
          ...basePayload,
          textbox: mobileNumbers,
        });
      }

      toast.success("Broadcast submitted successfully");
      refetchData();
      closeModal();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTemplateChange = (event) => {
    const value = event.target.value;
    if (value === "create") {
      openTemplateModal(); // Open the modal when "Create SMS Template" is selected
    } else {
      setTemplateId(value); // Set the template ID for other selections
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);

    if (newValue === 0) {
      setTemplateId("");
    } else {
      setDltTemplateId("");
      setMessage("");
    }
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    setLanguage(/[^\x00-\x7F]/.test(newMessage) ? "Unicode" : "English");
  };

  const handleAddSenderID = () => {
    setSenderIDModalOpen(true);
  };

  const closeAddSenderID = () => {
    setSenderIDModalOpen(false);
  };

  const openTemplateModal = () => setIsTemplateModalOpen(true);
  const closeTemplateModal = () => setIsTemplateModalOpen(false);

  // Handle the toggle between MO and GSM
  const handleModeChange = (event) => {
    const mode = event.target.value;
    setSelectedMode(mode);

    if (mode === "GSM") {
      setSelectedSenderId("");
      setDltTemplateId("");
      setTemplateId("");
    } else if (mode === "MO") {
      setMessage("");
    }
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

      if (uploadType === "Bulk") {
        // For "Voice", ensure only one column exists
        const hasMultipleColumns = rows.some((row) => row.length > 1);
        if (hasMultipleColumns) {
          toast.error("CSV must only contain one column for Bulk uploads.");
          setCsvFile(null); // Reset CSV file
          return;
        }
      } else if (uploadType === "Customized") {
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

      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);
    };

    reader.readAsText(file);
  };

  const downloadSampleCsv = () => {
    const sampleContent =
      uploadType === "Bulk"
        ? "PhoneNumber\n918517955165\n918878695196\n7000206013\n919755630170"
        : "PhoneNumber,Name,PromoCode\n919755630170,John Doe,PROMO123\n0987654321,Jane Smith,PROMO456\n";

    const blob = new Blob([sampleContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Sample_${uploadType}_CSV.csv`;
    link.click();

    // Clean up the object URL to release memory
    URL.revokeObjectURL(url);
  };

  const renderStep1 = () => (
    <Box>
      <Typography variant="h5" color="primary">
        Send SMS
      </Typography>

      {/* Toggle between MO and GSM */}
      <Box display="flex" justifyContent="center">
        <FormControl component="fieldset">
          <RadioGroup row value={selectedMode} onChange={handleModeChange}>
            <FormControlLabel value="MO" control={<Radio />} label="MO" />
            <FormControlLabel value="GSM" control={<Radio />} label="GSM" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Broadcast Name - Appears in both */}
      <TextField
        label="Broadcast Name"
        name="broadcastName"
        value={broadcastName}
        onChange={handleBroadcastNameChange}
        fullWidth
        margin="normal"
        required
      />

      {/* sender ID - Appears only in MO */}
      {selectedMode === "MO" && (
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Sender ID</InputLabel>
          <Select
            value={selectedSenderId}
            onChange={(e) => {
              if (e.target.value === "add") {
                handleAddSenderID(); // Open Modal if "Add Sender ID" is selected
              } else {
                setSelectedSenderId(e.target.value);
              }
            }}
            label="Select Sender ID"
          >
            <MenuItem value="add">+ Add Sender ID</MenuItem>
            {senderIdList.map((sId) => (
              <MenuItem key={sId?.id} value={sId.sender_id}>
                {sId.sender_id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Template ID and SMS Template selection - Appears only in MO */}
      {selectedMode === "MO" && (
        <>
          <Typography variant="h6" sx={{ paddingTop: "4px" }}>
            Message
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ marginBottom: "8px" }}
          >
            <Tab label="Enter Message Manually" />
            <Tab label="Use SMS Template" />
          </Tabs>

          {activeTab === 0 ? (
            <>
              {/* Enter Message Manually Form */}
              <TextField
                label="DLT Template ID"
                fullWidth
                variant="outlined"
                value={dltTemplateId}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  setDltTemplateId(numericValue);
                }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                sx={{ marginBottom: "2px" }}
              />

              <Typography variant="caption" display="block" gutterBottom>
                For India: Add correct Template ID that is approved on DLT
                platform.
              </Typography>
            </>
          ) : (
            <>
              {/* Use SMS Template Form */}
              <FormControl fullWidth>
                <InputLabel>Select Template</InputLabel>
                <Select
                  value={templateId}
                  onChange={handleTemplateChange}
                  label="Select Template"
                >
                  <MenuItem value="create">+ Create SMS Template</MenuItem>
                  {templatesList.map((template) => (
                    <MenuItem key={template?.id} value={template?.id}>
                      {template?.template_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </>
      )}

      {/* Language and SMS TextArea - Always visible in GSM, visible in MO only when "Enter Message Manually" */}
      {(selectedMode === "GSM" || activeTab === 0) && (
        <Box>
          {/* Language Radio Buttons */}
          <RadioGroup
            row
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            sx={{ marginBottom: "4px" }}
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

          {/* TextArea for SMS Message */}
          <TextField
            label="Enter Message Here"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
          />

          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2" color="textSecondary">
              SMS Count: {smsCount} (Message Length: {message.length})
            </Typography>

            <button
              type="button"
              className="text-blue-500"
              onClick={() => setShowAddLinkModal(true)} // Opens the AddLinkModal
            >
              🔗 Add Link
            </button>
          </Box>
        </Box>
      )}

      {/* Date and Time - Appears in both */}
      <Box display="flex" gap={2} mt={2}>
        <TextField
          label="Scheduled Start Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          label="Scheduled Start Time"
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="h5" color="primary">
        Upload CSV
      </Typography>

      <Box display="flex" justifyContent="center">
        <RadioGroup row value={uploadType} onChange={handleUploadTypeChange}>
          <FormControlLabel value="Bulk" control={<Radio />} label="Bulk" />

          <FormControlLabel
            value="Customized"
            control={<Radio />}
            label="Customized"
          />
        </RadioGroup>
      </Box>

      {uploadType === "Bulk" && (
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
          />

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

      {uploadType === "Customized" && (
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

  useEffect(() => {
    fetchSenderIds();
    fetchTemplates();
  }, []);

  useEffect(() => {
    // Set date and time to current
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().split("T")[0];
    const formattedTime = currentDateTime
      .toTimeString()
      .split(":")
      .slice(0, 2)
      .join(":");

    setSelectedDate(formattedDate);
    setSelectedTime(formattedTime);
  }, []);

  useEffect(() => {
    const count = calculateSmsCount(message, language);
    setSmsCount(count);
  }, [message, language]);

  return (
    <Box display="flex" gap={4}>
      {/* Left Section (70% width) */}
      <Box
        width="65%"
        sx={{
          maxHeight: "80vh", // Adjustable max height for the scrollable area
          overflowY: "auto", // Enables vertical scrolling
        }}
        className="scrollbar-hide"
      >
        <form onSubmit={handleSubmit}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}

          {/* Navigation Buttons */}
          <Box display="flex" justifyContent="space-between" mt={2}>
            {step === 2 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setStep(step - 1)}
                startIcon={<ArrowLeft />}
              >
                Back
              </Button>
            )}
            {step === 1 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setStep(step + 1)}
                sx={{ marginLeft: "auto" }}
              >
                Next
              </Button>
            )}
            {step === 2 && (
              <Button
                type="submit"
                variant="contained"
                color="success"
                endIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Upload />
                  )
                }
                disabled={isSubmitting} // Disable the button during submission
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </Box>
        </form>
      </Box>

      {/* Right Section (30% width) - Fixed Position for Mobile Component */}
      <Box
        width="30%"
        sx={{
          position: "sticky",
          marginTop: "12px",
        }}
      >
        <Mobile data={previewData} />
      </Box>

      {/* Create Template Modal */}
      {isTemplateModalOpen && (
        <Modal
          isModalOpen={isTemplateModalOpen}
          closeModal={closeTemplateModal}
          width="35%"
          height="70%"
          className="rounded-lg"
        >
          <CreateTemplateModal
            onClose={closeTemplateModal}
            user={user?.username}
            refreshTemplates={fetchTemplates}
            refreshSenderIds={fetchSenderIds}
          />
        </Modal>
      )}

      {/* Sender ID Modal */}
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
            user={user?.username}
            refreshSenderIds={fetchSenderIds}
          />
        </Modal>
      )}

      {showAddLinkModal && (
        <AddLinkModal
          isOpen={showAddLinkModal}
          onClose={() => setShowAddLinkModal(false)} // Close the modal
          onAddLink={handleAddLink} // Append the selected link to the message
          user={user} // Assuming you are passing the user info
        />
      )}
    </Box>
  );
};

export default SmsModal;
