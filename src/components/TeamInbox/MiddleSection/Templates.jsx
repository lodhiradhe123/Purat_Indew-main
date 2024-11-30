import { useState } from "react";

import Input from "../../Input";
import Button from "../../Button";

import { toast } from "react-toastify";

import handleApiError from "../../../utils/errorHandler";
import { fetchSelectedChatData, sendCrmBroadcast } from "../../../services/api";

const Templates = ({
  templates,
  handleModal,
  selectedChat,
  selectedContacts,
  user,
  updateChatMessages,
  closeChooseChannelModal,
  setSelectedTickets,
  agent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customFields, setCustomFields] = useState({});
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.template_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.template_body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    const regex = /{{(.*?)}}/g;
    const matches = [...template.template_body.matchAll(regex)].map(
      (match) => match[1]
    );
    const fields = matches.reduce((acc, field) => {
      acc[field] = customFields[field] || ""; // Preserve existing values
      return acc;
    }, {});
    setCustomFields(fields);
  };

  const handleFieldChange = (field, value) => {
    setCustomFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }));
  };

  const handleBackClick = () => {
    setCustomFields({});
    setSearchTerm("");
    setSelectedTemplate(null);
    handleModal(false);
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];

    setMediaFile(file);

    // Create a preview URL for media display
    const fileURL = URL.createObjectURL(file);
    setMediaPreview(fileURL);
  };

  const sendSelectedTemplate = async () => {
    if (!selectedTemplate) return;

    let message = selectedTemplate?.template_body;

    Object.keys(customFields).forEach((field) => {
      message = message.replace(`{{${field}}}`, customFields[field]);
    });

    // Construct the customFieldAttributes array for "attributes" field
    const customFieldAttributesArray = Object.values(customFields);

    const formData = new FormData();

    // Common fields for both broadcast and single chat
    formData.append("action", "createTemplate");
    formData.append("username", user);
    formData.append("template_name", selectedTemplate?.template_name);
    formData.append("template_id", selectedTemplate?.id);
    formData.append("attributes", JSON.stringify(customFieldAttributesArray));
    formData.append(
      "template_language",
      selectedTemplate?.language?.short_name
    );
    formData.append("eventDescription", "agent");

    // Handle media file if it exists
    if (mediaFile instanceof File) {
      // Explicitly check if mediaFile is a File object
      formData.append("template_media", mediaFile);
      formData.append("template_media_type", mediaFile.type.split("/")[0]);
      formData.append("type", "media");
    } else {
      formData.append("type", "text");
    }

    try {
      setLoading(true);

      if (selectedContacts && selectedContacts.length > 0) {
        // Broadcast scenario
        const textbox = selectedContacts.join("\n");
        formData.append("textbox", textbox);

        const response = await sendCrmBroadcast(formData);

        if (response?.data?.status) {
          toast.success("Message broadcasted successfully!");
          handleModal(false);
          closeChooseChannelModal();
          setSelectedTickets([]);
        } else {
          toast.error("Failed to send broadcast message");
        }
      } else if (selectedChat) {
        // Single chat scenario
        formData.append("text", message);
        formData.append("receiver_id", selectedChat?.chat_room.receiver_id);
        formData.append("agent", agent);

        const response = await fetchSelectedChatData(formData);

        if (response?.data?.data) {
          updateChatMessages(response?.data?.data);
          handleModal(false);
          toast.success("Template sent successfully!");
        } else {
          const errorMessages = response?.data?.error
            ? Object.values(response.data.error).flat().join(", ")
            : "Failed to send Template";
          toast.error(errorMessages);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
      handleModal(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-4 border-b-2 pb-4">
        <h2 className="text-lg font-semibold">Select Template</h2>

        <Input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="overflow-y-auto scrollbar-hide">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`bg-white px-2 py-4 my-3 rounded shadow-md cursor-pointer hover:bg-slate-50 ${
              selectedTemplate?.id === template.id
                ? "border-2 border-green-500"
                : ""
            }`}
            onClick={() => handleTemplateClick(template)}
          >
            <h3 className="font-bold">{template?.template_name}</h3>

            <p className="whitespace-pre-wrap">{template?.template_body}</p>

            <div className="flex justify-evenly gap-1 mt-4">
              {template.quick_reply_btn_text1 && (
                <Button variant="secondary">
                  {template.quick_reply_btn_text1}
                </Button>
              )}
              {template.quick_reply_btn_text2 && (
                <Button variant="secondary">
                  {template.quick_reply_btn_text2}
                </Button>
              )}
              {template.quick_reply_btn_text3 && (
                <Button variant="secondary">
                  {template.quick_reply_btn_text3}
                </Button>
              )}
            </div>

            {selectedTemplate?.id === template.id && (
              <div className="mt-4">
                {Object.keys(customFields).map((field) => (
                  <div key={field} className="my-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Field {`{{${field}}}`}
                    </label>

                    <Input
                      value={customFields[field]}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      className="mt-1 block w-full"
                    />
                  </div>
                ))}

                {selectedTemplate?.header_media_type && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload {selectedTemplate.header_media_type}
                    </label>
                    <input
                      type="file"
                      accept={
                        selectedTemplate.header_media_type === "Image"
                          ? "image/*"
                          : selectedTemplate.header_media_type === "Audio"
                          ? "audio/*"
                          : selectedTemplate.header_media_type === "Video"
                          ? "video/*"
                          : selectedTemplate.header_media_type === "Document"
                          ? ".pdf,.doc,.docx,.txt" // Adjust accepted file types for documents
                          : "*"
                      }
                      onChange={handleMediaUpload}
                      className="mt-1 block w-full"
                    />
                    {/* Show media preview */}
                    {mediaPreview &&
                      selectedTemplate.header_media_type === "Image" && (
                        <img
                          src={mediaPreview}
                          alt="preview"
                          className="mt-2 h-40"
                        />
                      )}
                    {mediaPreview &&
                      selectedTemplate.header_media_type === "Audio" && (
                        <audio controls className="mt-2">
                          <source src={mediaPreview} />
                          Your browser does not support the audio tag.
                        </audio>
                      )}
                    {mediaPreview &&
                      selectedTemplate.header_media_type === "Video" && (
                        <video controls className="mt-2 h-40">
                          <source src={mediaPreview} />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    {mediaPreview &&
                      selectedTemplate.header_media_type === "Document" && (
                        <div className="mt-2">
                          {mediaFile.type === "application/pdf" ? (
                            <iframe
                              src={mediaPreview}
                              className="w-full h-40"
                              title="PDF Preview"
                            />
                          ) : (
                            <p className="text-gray-700">
                              {mediaFile.name} (Preview not supported)
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="secondary" onClick={handleBackClick}>
                    Back
                  </Button>

                  <Button
                    variant="primary"
                    onClick={sendSelectedTemplate}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
