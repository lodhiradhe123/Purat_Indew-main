import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Button from "../../Button";
import Input from "../../Input";
import Modal from "../../Modal";
import CreateQuickReply from "./CreateQuickReply";

import DeleteConfirmation from "../../DeleteConfirmation/DeleteModal";
import handleApiError from "../../../utils/errorHandler";
import {
  handleQuickReplies,
  handleQuickRepliesFormData,
} from "../../../services/api";

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-8 h-6"
  >
    <rect
      x="9"
      y="9"
      width="13"
      height="13"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-8 h-6"
  >
    <path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-8 h-6"
  >
    <path d="M3 6h18" stroke="currentColor" strokeWidth="2" />
    <path
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="10"
      y1="11"
      x2="10"
      y2="17"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="14"
      y1="11"
      x2="14"
      y2="17"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const QuickReplyMessages = ({ user, onQuickReplySelect }) => {
  const [openCreateQuickReply, setOpenCreateQuickReply] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [filteredQuickReplies, setFilteredQuickReplies] = useState([]);
  const [currentQuickReply, setCurrentQuickReply] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyToDelete, setReplyToDelete] = useState(null);

  const fetchQuickReplies = async () => {
    try {
      const response = await handleQuickReplies({
        action: "read",
        username: user,
      });
      setQuickReplies(response?.data?.data);
      setFilteredQuickReplies(response?.data?.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSaveQuickReply = async (newReply) => {
    const action =
      currentQuickReply && currentQuickReply.id ? "update" : "create";
    const formData = new FormData();
    formData.append("action", action);
    formData.append("username", user);
    formData.append("heading", newReply.heading);
    formData.append("description", newReply.description);

    // Check if media is defined and append
    if (newReply.media) {
      formData.append("media", newReply.media);
    }

    if (currentQuickReply && currentQuickReply.id) {
      formData.append("id", currentQuickReply.id);
    }

    try {
      const response = await handleQuickRepliesFormData(formData);
      if (response.data.status === 1) {
        toast.success(
          `Quick reply ${
            action === "create" ? "created" : "updated"
          } successfully!`
        );
        fetchQuickReplies();
      } else {
        toast.error(response.data.message || "Failed to save quick reply");
      }
    } catch (error) {
      handleApiError(error);
    }
    setOpenCreateQuickReply(false);
  };

  const handleDeleteQuickReply = async () => {
    if (!replyToDelete) return;

    try {
      const response = await handleQuickReplies({
        action: "delete",
        id: replyToDelete.id,
        username: user,
      });
      if (response?.data?.status === 1) {
        toast.success("Quick reply deleted successfully!");
        fetchQuickReplies();
        setIsDeleteModalOpen(false);
        setReplyToDelete(null);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (searchTerm) {
      const filteredReplies = quickReplies.filter(
        (reply) =>
          reply.heading.toLowerCase().includes(searchTerm) ||
          reply.description.toLowerCase().includes(searchTerm)
      );
      setFilteredQuickReplies(filteredReplies);
    } else {
      setFilteredQuickReplies(quickReplies);
    }
  };

  const renderMedia = (media) => {
    if (!media) return null;

    const mediaUrl = `${media}`;
    const extension = media.split(".").pop().toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <img src={mediaUrl} alt="Media" className="max-h-32" />;
      case "mp4":
      case "webm":
      case "ogg":
        return <video controls src={mediaUrl} className="max-h-32" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <audio controls src={mediaUrl} className="max-h-32" />;
      case "pdf":
        return (
          <embed src={mediaUrl} type="application/pdf" className="max-h-32" />
        );
      default:
        return <p className="text-center">Cannot preview this file type</p>;
    }
  };

  const handleCreateModal = () => {
    setCurrentQuickReply(null);
    setOpenCreateQuickReply(true);
  };

  const handleEditQuickReply = (reply) => {
    setCurrentQuickReply(reply);
    setOpenCreateQuickReply(true);
  };

  const handleCopyQuickReply = (reply) => {
    setCurrentQuickReply({ ...reply, id: null });
    setOpenCreateQuickReply(true);
  };

  const handleDeleteModal = (reply) => {
    setReplyToDelete(reply);
    setIsDeleteModalOpen(true);
  };

  const handleQuickReplySelectInternal = (reply) => {
    const mediaUrl = reply.media ? `${reply.media}` : null;
    onQuickReplySelect(reply.description, mediaUrl);
  };

  useEffect(() => {
    fetchQuickReplies();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-around border-b pb-4">
        <h3 className="text-lg font-semibold">Use a Quick Response</h3>
        <Input
          type="search"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <Button variant="primary" onClick={handleCreateModal}>
          Create
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 my-4 overflow-y-auto scrollbar-hide">
        {filteredQuickReplies.map((reply) => (
          <div
            key={reply.id}
            className="border p-3 rounded bg-slate-50 relative"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-semibold truncate max-w-[70%]">
                {reply.heading}
              </h4>

              <div className="flex items-center bg-white rounded p-1">
                <button
                  className="hover:text-blue-500"
                  onClick={() => handleCopyQuickReply(reply)}
                >
                  <CopyIcon />
                </button>

                <div className="border-l h-6" />

                <button
                  className="hover:text-blue-500"
                  onClick={() => handleEditQuickReply(reply)}
                >
                  <EditIcon />
                </button>

                <div className="border-l h-6" />

                <button
                  className="hover:text-red-500"
                  onClick={() => handleDeleteModal(reply)}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>

            <div className="my-4 mr-8 h-40 overflow-auto scrollbar-hide whitespace-pre-wrap">
              <p>{reply.description}</p>

              {reply.media && (
                <div className="my-4">{renderMedia(reply.media)}</div>
              )}
            </div>

            <button
              className="absolute right-3 bottom-3 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
              onClick={() => handleQuickReplySelectInternal(reply)}
            >
              <SendIcon />
            </button>
          </div>
        ))}
      </div>

      {isDeleteModalOpen && (
        <Modal
          isModalOpen={isDeleteModalOpen}
          closeModal={() => setIsDeleteModalOpen(false)}
          width="30%"
          height="40%"
          className=" rounded-xl"
        >
          <DeleteConfirmation
            onConfirm={handleDeleteQuickReply}
            onCancel={() => setIsDeleteModalOpen(false)}
            itemType="Quick Reply"
          />
        </Modal>
      )}

      {openCreateQuickReply && (
        <Modal
          isModalOpen={openCreateQuickReply}
          closeModal={() => setOpenCreateQuickReply(false)}
          width="50vw"
          height="60vh"
          className="rounded-lg top-4"
        >
          <CreateQuickReply
            onSave={handleSaveQuickReply}
            initialData={currentQuickReply}
          />
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
};

export default QuickReplyMessages;
