import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Mobile from "../../components/Mobile";
import Loader from "../../components/Loader";

import { format } from "date-fns";

import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import {
  templateData,
  submitBroadcastData,
  submitCsvDataToSecondApi,
} from "../../services/api";
import { Box, display } from "@mui/system";
import GroupModal from "./GroupModal";
import Modal from "../../components/Modal";

const styles = {
  menuItem: {
    display: "flex",
    justifyContent: "flex-start",
    padding: "4px 16px",
  },
};

const formatDate = (dateString) => {
  return format(new Date(dateString), "PPpp"); // Example: Jul 31, 2024, 12:39 AM
};

const ConfirmationModal = ({ campaign, message, onClose }) => (
  <Dialog open={true} onClose={onClose}>
    <DialogTitle>Broadcast Status</DialogTitle>

    <DialogContent>
      <Typography>{message}</Typography>
      {campaign && typeof campaign === "object" && (
        <div>
          <Typography>
            <strong>Username:</strong> {campaign.username}
          </Typography>
          <Typography>
            <strong>Broadcast Name:</strong> {campaign.senderid}
          </Typography>
          <Typography>
            <strong>Request ID:</strong> {campaign.request_id}
          </Typography>
          <Typography>
            <strong>Status:</strong> {campaign.status}
          </Typography>
          <Typography>
            <strong>Total Numbers:</strong> {campaign.numbers}
          </Typography>
          <Typography>
            <strong>Scheduled Date:</strong> {campaign.dat}
          </Typography>
          <Typography>
            <strong>Scheduled Time:</strong> {campaign.estimated_time}
          </Typography>
          <Typography>
            <strong>Template ID:</strong> {campaign.queue_no}
          </Typography>
          <Typography>
            <strong>Created ID:</strong> {formatDate(campaign.created_at)}
          </Typography>
        </div>
      )}
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose} color="primary">
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

const NewBroadcast = ({ closeModal, resetForm, user }) => {
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [footer, setFooter] = useState("");
  const [attributes, setAttributes] = useState({});
  const [callToAction, setCallToAction] = useState({});
  const [quickReply, setQuickReply] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [preview, setPreview] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedButtonType, setSelectedButtonType] = useState("none");
  const [buttonData, setButtonData] = useState({});
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [headerMediaType, setHeaderMediaType] = useState(null);
  const [mediaContent, setMediaContent] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // New state for modal visibility
  const [confirmationMessage, setConfirmationMessage] = useState(""); // New state to store API message
  const [confirmationCampaign, setConfirmationCampaign] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [broadcastName, setBroadcastName] = useState("");
  const [carousels, setCarousels] = useState([]); // New state for carousels
  const [mediaCarouselsContent, setMediaCarouselsContent] = useState(null); // For carousels media contain

  const [uploadType, setUploadType] = useState("Bulk");
  const [mobileNumbers, setMobileNumbers] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [contactCount, setContactCount] = useState(0);
  const [csvPreview, setCsvPreview] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle the change of the selected template
  const handleTemplateChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedTemplate(selectedId); // Set the selected template ID

    try {
      const response = await templateData({
        username: user.username,
        action: "read",
        id: selectedId,
      });
      const selectedTemplate = response?.data?.template?.find(
        (t) => t.id == selectedId
      );

      setMessage(selectedTemplate?.template_body || "");
      setHeaderMediaType(selectedTemplate?.header_media_type || null); // Set header media type
      setFooter(selectedTemplate?.template_footer || "");
      setCallToAction({
        callPhoneNumber: selectedTemplate?.call_phone_btn_phone_number,
        callPhoneText: selectedTemplate?.call_phone_btn_text,
        visitWebsiteText: selectedTemplate?.visit_website_btn_text,
        visitWebsiteUrl: selectedTemplate?.visit_website_url_text,
      });

      setQuickReply(selectedTemplate?.quick_replies || []);

      // Extract dynamic attributes from the message
      const matches =
        selectedTemplate?.template_body?.match(/{{\s*[\w]+\s*}}/g) || [];
      const attrObj = {};
      matches.forEach((match, index) => {
        const key = match.replace(/[{}]/g, "").trim();
        attrObj[`attribute${index + 1}`] = key;
      });
      setAttributes(attrObj);

      // Set carousels if available
      setCarousels(selectedTemplate?.carousels || []);
    } catch (error) {
      toast.error("Failed to fetch template message");
      console.error("Failed to fetch template message", error);
      setMessage("");
      setAttributes({});
      setQuickReply([]);
      setCarousels([]); // Reset carousels on error
    }
  };

  // Handle change in attributes
  const handleAttributeChange = (key, value) => {
    setAttributes((prevAttrs) => ({
      ...prevAttrs,
      [key]: value,
    }));
  };

  const renderCallToActionSection = () => {
    if (
      callToAction.callPhoneText ||
      callToAction.callPhoneNumber ||
      callToAction.visitWebsiteText ||
      callToAction.visitWebsiteUrl ||
      quickReply.length > 0
    ) {
      return (
        <div>
          <div className="flex justify-center items-center flex-wrap gap-3">
            {callToAction.callPhoneText && callToAction.callPhoneNumber && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  (window.location.href = `tel:${callToAction.callPhoneNumber}`)
                }
              >
                {callToAction.callPhoneText}
              </Button>
            )}

            {callToAction.visitWebsiteText && callToAction.visitWebsiteUrl && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  window.open(callToAction.visitWebsiteUrl, "_blank")
                }
              >
                {callToAction.visitWebsiteText}
              </Button>
            )}
          </div>

          <div>
            {quickReply.some((reply) => reply.type === "QUICK_REPLY") && (
              <div>
                <Typography variant="h6" className="mb-4">
                  Quick Replies
                </Typography>
                <div className="flex justify-center items-center flex-wrap gap-3">
                  {quickReply
                    .filter((reply) => reply.type === "QUICK_REPLY")
                    .map((reply, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        color="primary"
                        onClick={() => handleQuickReplyClick(reply)}
                      >
                        {reply.text}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {quickReply.some(
              (reply) => reply.type === "URL" || reply.type === "PHONE_NUMBER"
            ) && (
              <div className="mt-6">
                <Typography variant="h6" className="mb-4">
                  Call to Action
                </Typography>
                <div className="flex justify-center items-center flex-wrap gap-3">
                  {quickReply
                    .filter(
                      (reply) =>
                        reply.type === " URL" || reply.type === "PHONE_NUMBER"
                    )
                    .map((reply, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleQuickReplyClick(reply)}
                      >
                        {reply.text}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle quick reply clicks
  const handleQuickReplyClick = (reply) => {
    switch (reply.type) {
      case "PHONE_NUMBER":
        window.location.href = `tel:${reply.phone_number}`;
        break;
      case "URL":
        window.open(reply.url, "_blank");
        break;
      default:
        console.log("Quick reply clicked:", reply.text);
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

  //For Import Contacts From Group
  const handleGroupSelection = (selectedNumbers) => {
    // Get existing numbers as an array
    const existingNumbers = mobileNumbers
      .split(/\n/)
      .filter((num) => num.trim() !== "");

    // Combine existing and new numbers, remove duplicates
    const allNumbers = [...new Set([...existingNumbers, ...selectedNumbers])];

    // Update the textfield with combined numbers
    setMobileNumbers(allNumbers.join("\n"));

    // Update the contact count
    setContactCount(allNumbers.length);
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

  // Handle file upload for media content
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file); // Add logging for debugging
      setMediaContent(file); // Set the file object directly
    }
  };

  // Function to handle file upload for carousels media content
  const handleCarouselsMediaUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setCarousels((prevCarousels) => {
        const newCarousels = [...prevCarousels];
        newCarousels[index].mediaContent = file; // Store the file in the carousel's media content
        return newCarousels;
      });
    }
  };

  const handleImportFromFileManager = async () => {
    try {
      const response = await axios.get("/api/getImagePath"); // Replace with your API endpoint
      const imagePath = response.data.path;
      const mediaBlob = await fetch(imagePath).then((res) => res.blob());
      setMediaContent(mediaBlob);
    } catch (error) {
      console.error("Error fetching image path: ", error);
    }
  };

  const handleSubmitBroadcast = async () => {
    if (!selectedTemplate || !user.username || !message) {
      toast.error("Please ensure all fields are properly filled.");
      return;
    }

    setIsSubmitting(true);

    const dataToSubmit = new FormData();
    const templateId = selectedTemplate;
    const templateName = templates[templateId];

    dataToSubmit.append("template_name", templateName);
    dataToSubmit.append("username", user.username);
    dataToSubmit.append("message", message);
    dataToSubmit.append("scheduled_date", selectedDate);
    dataToSubmit.append("scheduled_time", selectedTime);
    dataToSubmit.append("media_file", mediaContent);
    dataToSubmit.append("template_id2", selectedTemplate);
    dataToSubmit.append("broadcast_name", broadcastName);

    // Append dynamic attributes to FormData
    Object.keys(attributes).forEach((key) => {
      dataToSubmit.append(key, attributes[key]);
    });

    // Append button data to FormData
    if (selectedButtonType === "callToAction") {
      dataToSubmit.append(
        "call_to_action_text",
        buttonData.callPhoneText || ""
      );
      dataToSubmit.append(
        "call_to_action_phone",
        buttonData.callPhoneNumber || ""
      );
      dataToSubmit.append(
        "call_to_action_website_text",
        buttonData.visitWebsiteText || ""
      );
      dataToSubmit.append(
        "call_to_action_website_url",
        buttonData.visitWebsiteUrl || ""
      );
    } else if (selectedButtonType === "quickReply") {
      dataToSubmit.append("quick_reply_text1", buttonData.quickReply1 || "");
      dataToSubmit.append("quick_reply_text2", buttonData.quickReply2 || "");
      dataToSubmit.append("quick_reply_text3", buttonData.quickReply3 || "");
    }

    // Append carousel media paths to FormData
    carousels.forEach((carousel, index) => {
      if (carousel.mediaContent) {
        dataToSubmit.append(
          `carousel_media_${index + 1}`,
          carousel.mediaContent
        );
      }
    });

    try {
      // Call the API to submit the data
      let response;

      // Handle conditional API calls based on uploadType
      if (uploadType === "Bulk") {
        dataToSubmit.append("textbox", mobileNumbers); // Bulk uses the textbox
        response = await submitBroadcastData(dataToSubmit); // Call Bulk API
      } else {
        dataToSubmit.append("csv_data", csvFile); // Non-Bulk uses CSV
        response = await submitCsvDataToSecondApi(dataToSubmit); // Call CSV API
      }

      const successMessage =
        response?.data?.message || "Broadcast submitted successfully!";
      const CampaignMessage =
        response?.data?.campaign_details || "Broadcast submitted successfully!";
      setConfirmationMessage(successMessage);
      setConfirmationCampaign(CampaignMessage);

      // Log the response to ensure it's reaching this point
      console.log("API response:", response);

      // Show confirmation modal
      setShowConfirmationModal(true);

      // Reset form states, but delay closing modal until user closes it
      resetStates();
    } catch (error) {
      console.error("Failed to submit broadcast:", error);
      toast.error("Failed to submit broadcast. Please try again.");

      // Check if error response and message are available
      if (error.response && error.response.data) {
        const apiErrorMessage =
          error.response.data.message ||
          "Failed to submit broadcast. Please try again.";
        toast.error(apiErrorMessage);

        // If there are validation errors, show each one
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          Object.keys(errors).forEach((key) => {
            errors[key].forEach((errorMsg) => {
              toast.error(errorMsg);
            });
          });
        }
      } else {
        // Fallback message if no specific message from the API
        toast.error("Failed to submit broadcast. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal close handler
  const handleCloseModal = () => {
    setShowConfirmationModal(false); // Close the confirmation modal
    resetStates(); // Now reset the form after modal is closed
    closeModal(); // Close the main form if needed
  };

  const resetStates = () => {
    setTemplates({});
    setSelectedTemplate("");
    setMessage("");
    setFooter("");
    setAttributes({});
    setCallToAction({});
    setQuickReply({});
    setCurrentPage(1);
    setUploadProgress(0);
    setMediaContent(null);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedButtonType("none");
    setButtonData({});
    setCarousels([]); // Reset carousels
  };

  // Function to handle removing media
  const handleRemoveMedia = (index) => {
    const updatedCarousels = [...carousels];
    updatedCarousels[index].mediaContent = null;
    setCarousels(updatedCarousels);
  };

  const handleNextPage = () => setCurrentPage(2);
  const handlePreviousPage = () => setCurrentPage(1);

  const handleGroupModalOpen = () => setShowGroupModal(true);
  const handleGroupModalClose = () => setShowGroupModal(false);

  useEffect(() => {
    if (!user || !user.username) {
      // If user is not available, no need to fetch templates
      return;
    }

    const fetchTemplatesAndMessages = async () => {
      try {
        const response = await templateData({
          username: user.username,
          action: "read",
        });

        if (response?.data?.template) {
          const templateList = response.data.template;
          const templateMap = templateList.reduce((acc, template) => {
            acc[template.id] = template.template_name;
            return acc;
          }, {});
          setTemplates(templateMap);
        } else {
          toast.error("No templates found");
        }
      } catch (error) {
        toast.error("Failed to fetch templates");
        console.error("Failed to fetch templates", error);
      }
    };

    // Set date and time
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toISOString().split("T")[0];
    const formattedTime = currentDateTime
      .toTimeString()
      .split(" ")[0]
      .slice(0, 5);

    setSelectedDate(formattedDate);
    setSelectedTime(formattedTime);

    // Fetch templates and messages
    fetchTemplatesAndMessages();
  }, [user]); // Add `user` to the dependencies array

  useEffect(() => {
    const previewData = {
      message,
      scheduled_date: selectedDate,
      scheduled_time: selectedTime,
      media_file: mediaContent ? URL.createObjectURL(mediaContent) : null,
      media_type: mediaContent ? mediaContent.type : null, // Include media type
      action: callToAction,
      reply: quickReply,
      carousels, // Include carousels in preview
      carousels: carousels.map((carousel) => ({
        ...carousel,
        media: carousel.mediaContent
          ? URL.createObjectURL(carousel.mediaContent)
          : null,
      })),
    };

    setPreview(previewData);
  }, [
    message,
    selectedDate,
    selectedTime,
    mediaContent,
    callToAction,
    quickReply,
    mediaCarouselsContent,
    carousels,
  ]); // Add carousels to dependencies

  useEffect(() => {
    resetForm.current = resetStates;
  }, [resetForm]);

  // Modal Component for Broadcast Confirmation

  return (
    <div className="flex gap-[2%]">
      <div className="left-content grow xl:basis-[70%] pr-4 overflow-y-auto scrollbar-hide">
        {currentPage === 1 && (
          <div className="flex flex-col gap-4">
            <Typography variant="h5" color="primary">
              New Broadcast
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Broadcast Name"
                  variant="outlined"
                  value={broadcastName}
                  onChange={(e) => setBroadcastName(e.target.value)}
                  placeholder="Broadcast Name"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Broadcast Number"
                  variant="outlined"
                  value={user?.mobile_no}
                  disabled
                  fullWidth
                />
              </Grid>
            </Grid>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Template</InputLabel>
              <Select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                label="Template"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200, // Set a max height for the dropdown
                    },
                  },
                }}
              >
                {Object.entries(templates).map(([id, name]) => (
                  <MenuItem key={id} value={id} style={styles.menuItem}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6">Message</Typography>

            <TextField
              variant="outlined"
              multiline
              rows={6}
              value={message}
              aria-readonly
              fullWidth
            />

            {footer && (
              <>
                <Typography variant="h6">Footer</Typography>

                <TextField
                  variant="outlined"
                  multiline
                  rows={1}
                  value={footer}
                  aria-readonly
                  fullWidth
                />
              </>
            )}

            {renderCallToActionSection()}

            {attributes?.length > 0 && (
              <>
                <Typography variant="h6">Attributes</Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {Object.keys(attributes).map((key) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <TextField
                        label={key}
                        variant="outlined"
                        value={attributes[key]}
                        onChange={(e) =>
                          handleAttributeChange(key, e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {carousels.length > 0 && (
              <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Carousels
                </Typography>

                <Grid container spacing={2}>
                  {carousels.map((carousel, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`carousel-${index}`}>
                      <div className="bg-white shadow-md rounded-lg p-4 overflow-hidden flex flex-col items-center">
                        <Typography variant="subtitle1" className="mb-2">
                          {carousel.media.toLowerCase() === "image"
                            ? "Image Preview"
                            : "Video Preview"}
                        </Typography>
                        {carousel.mediaContent ? (
                          <>
                            {carousel.media.toLowerCase() === "image" ? (
                              <img
                                src={URL.createObjectURL(carousel.mediaContent)}
                                alt={carousel.title}
                                className="w-full h-40 object-cover rounded cursor-pointer"
                              />
                            ) : (
                              <video
                                controls
                                src={URL.createObjectURL(carousel.mediaContent)}
                                className="w-full h-40 object-cover rounded cursor-pointer"
                              />
                            )}
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleRemoveMedia(index)}
                              className="mt-4"
                            >
                              Remove Media
                            </Button>
                          </>
                        ) : (
                          <input
                            type="file"
                            accept={
                              carousel.media.toLowerCase() === "image"
                                ? "image/*"
                                : "video/*"
                            }
                            onChange={(e) =>
                              handleCarouselsMediaUpload(e, index)
                            }
                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        )}
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}

            {/* datetime */}
            <Typography variant="h6">Scheduled Start Date</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  variant="outlined"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Time"
                  type="time"
                  variant="outlined"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>

            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextPage}
                className="mt-4"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* 2nd page */}
        {currentPage === 2 && (
          <div>
            <Box>
              <Typography variant="h5" color="primary">
                Upload CSV
              </Typography>

              <Box display="flex" justifyContent="center">
                <RadioGroup
                  row
                  value={uploadType}
                  onChange={handleUploadTypeChange}
                >
                  <FormControlLabel
                    value="Bulk"
                    control={<Radio />}
                    label="Bulk"
                  />

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

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleGroupModalOpen}
                    >
                      Import Contacts From Group
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
                        <table
                          style={{ width: "100%", borderCollapse: "collapse" }}
                        >
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

            <div className="mt-4">
              {headerMediaType &&
                headerMediaType !== "None" &&
                headerMediaType !== "null" &&
                headerMediaType !== "" &&
                headerMediaType !== "NULL" && (
                  <div>
                    <Typography variant="h6">Upload Media</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <input
                          type="file"
                          name="mediaFile"
                          accept={
                            headerMediaType === "Image"
                              ? "image/*"
                              : headerMediaType === "Video"
                              ? "video/*"
                              : "image/*,video/*,.pdf"
                          }
                          onChange={handleMediaUpload}
                          className="mt-4"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Button
                          type="button"
                          onClick={handleImportFromFileManager}
                          variant="contained"
                        >
                          Import from File Manager
                        </Button>
                      </Grid>
                    </Grid>

                    <div>
                      {mediaContent && (
                        <div className="mt-2">
                          {headerMediaType === "Image" && (
                            <img
                              src={URL.createObjectURL(mediaContent)}
                              alt="Uploaded Media"
                              className="mt-2 rounded"
                              style={{ maxHeight: "150px" }}
                            />
                          )}

                          {headerMediaType === "Video" && (
                            <video
                              controls
                              src={URL.createObjectURL(mediaContent)}
                              className="mt-2 rounded"
                              style={{ maxHeight: "150px" }}
                            />
                          )}

                          {headerMediaType === "Document" && (
                            <embed
                              src={URL.createObjectURL(mediaContent)}
                              type="application/pdf"
                              className="mt-2 rounded"
                              style={{ maxHeight: "150px" }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePreviousPage}
                className="mt-4"
              >
                Back
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={handleSubmitBroadcast}
                className="mt-4"
              >
                Submit and run
              </Button>
            </div>
          </div>
        )}

        {showGroupModal && (
          <Modal
            isModalOpen={showGroupModal}
            closeModal={handleGroupModalClose}
            width="600px"
            height="500px"
          >
            <GroupModal
              user={user?.username}
              onGroupSelect={handleGroupSelection}
              closeModal={handleGroupModalClose}
            />
          </Modal>
        )}
      </div>

      <div className="hidden xl:basis-[28%] xl:flex flex-col items-center">
        <Typography variant="h5" className="font-medium text-center mb-3">
          Preview
        </Typography>

        <Mobile data={preview} />
      </div>

      {/* Render confirmation modal */}
      {showConfirmationModal && (
        <ConfirmationModal
          message={confirmationMessage}
          campaign={confirmationCampaign}
          onClose={handleCloseModal} // Modal close logic
        />
      )}

      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default NewBroadcast;
