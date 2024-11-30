import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import handleApiError from "../../../utils/errorHandler";
import { chatbotFlow } from "../../../services/api";

const CreateChatbotModal = ({ user }) => {
  const navigate = useNavigate();

  const [chatbotName, setChatbotName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createChatbot = async () => {
    if (!chatbotName.trim()) {
      toast.error("Please enter a chatbot name.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { action: "create", username: user, name: chatbotName };
      await chatbotFlow(payload);

      navigate("/dashboard/whatsapp/createChatbot", {
        state: { chatbotName },
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e) => {
    setChatbotName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      createChatbot();
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold pb-2 border-b border-gray-500">
          Add New Chatbot
        </h2>

        <p className="text-base font-semibold my-4">Chatbot Name</p>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Enter chatbot name"
          value={chatbotName}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 bg-gray-50 rounded-md outline-none"
          disabled={isLoading}
        />

        {isLoading && <p className="mt-2 text-sm text-gray-500">Saving...</p>}
      </div>

      {/* Button aligned to the bottom-right */}
      <div className="flex justify-end mt-4">
        <button
          onClick={createChatbot}
          disabled={!chatbotName.trim() || isLoading}
          className={`px-4 py-2 rounded-md text-white ${
            chatbotName.trim()
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-blue-300 cursor-not-allowed"
          } transition`}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CreateChatbotModal;
