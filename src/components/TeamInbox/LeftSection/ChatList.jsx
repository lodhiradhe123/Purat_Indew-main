import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  faSearch,
  faFilter,
  faPlus,
  faStar,
  faFile,
  faDownload,
  faSpinner,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

import Dropdown from "../../Dropdown";
import Modal from "../../Modal";
import Button from "../../Button";
import AdvanceFilter from "./AdvanceFilter";
import ContactTemplate from "../LeftSection/ContactTemplate";

import handleApiError from "../../../utils/errorHandler";
import { getAllChats, updateChatStatus } from "../../../services/api";
import { CHATS_TYPE } from "../../../services/constant";

import "../TeamInbox.css";
import { Tooltip } from "@mui/material";

const ChatList = ({
  templates,
  chats,
  action,
  setAction,
  user,
  contacts,
  selectedChat,
  setSelectedChat,
  starredChats,
  updateStarredChats,
  updateChatMessages,
  onFilterApply,
  reFetchChats,
  actionType,
}) => {
  const [selectedChatType, setSelectedChatType] = useState(action);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showContactTemplate, setShowContactTemplate] = useState(false);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [showAssigned, setShowAssigned] = useState(true);
  const [dateRange, setDateRange] = useState([null, null]);
  const [dynamicTotalCount, setDynamicTotalCount] = useState(null);
  const [dynamicUnreadCount, setDynamicUnreadCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await reFetchChats(actionType);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleChatSelection = (e) => {
    const selectedValue = e.target.value;
    const selectedChatType = CHATS_TYPE.find(
      (type) => type.name === selectedValue
    );

    setSelectedChatType(selectedChatType.name);
    setAction(selectedChatType.action);
    setShowContactTemplate(false);
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If there's a search term, switch action to "allchat"
    if (value.trim().length > 0) {
      setAction("allchat"); // Change action to "allchat" for search results
    } else {
      setAction("active"); // Reset to previous action if search is cleared
    }
  };

  const toggleContactTemplate = () => {
    setShowContactTemplate(!showContactTemplate);
    if (!showContactTemplate) {
      setAction("allchat");
    }
  };

  const exportToCSV = async () => {
    try {
      const payload = {
        username: user?.username,
        action: "allchat",
        ...(dateRange[0] && { start_date: dateRange[0].toISOString() }),
        ...(dateRange[1] && { end_date: dateRange[1].toISOString() }),
      };

      const response = await getAllChats(payload);
      const chatsToExport = response?.data?.data;

      if (!chatsToExport || chatsToExport.length === 0) {
        toast.warning("No chats found for export");
        return;
      }

      // Prepare headers
      const headers = [
        "Contact No.",
        "Name",
        "Date",
        "Time",
        "Type",
        "Content",
      ];
      const rows = [headers];

      // Add chats to rows
      chatsToExport.forEach((chat) => {
        let content;
        if (chat.type === "text") {
          content = chat.text || "N/A";
        } else if (chat.type === null && chat.template_id) {
          content = `Template ID - ${chat.template_id}`;
        } else {
          content = chat.media || "N/A";
        }

        content = `"${content.replace(/"/g, '""')}"`;

        const createdDate = new Date(chat.created_at);
        const formattedDate = `${String(createdDate.getUTCDate()).padStart(
          2,
          "0"
        )}/${String(createdDate.getUTCMonth() + 1).padStart(
          2,
          "0"
        )}/${createdDate.getUTCFullYear()}`;

        const formattedTime = createdDate.toUTCString().split(" ")[4];

        rows.push([
          chat.receiver_id,
          chat.replySourceMessage || "N/A",
          formattedDate,
          formattedTime,
          chat.type || "N/A",
          content,
        ]);
      });

      // Convert rows to CSV content
      const csvContent = rows.map((row) => row.join(",")).join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "chats_export.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to export chats");
    }
  };

  // Sort function for chats
  const sortChatsByDate = (chatsArray) => {
    return [...chatsArray].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  // Filter chats based on search term and date range first
  const filteredChats = chats.filter((chat) => {
    const chatDate = new Date(chat.created_at);

    // Check if the chat matches the search term
    const matchesSearch =
      chat?.replySourceMessage
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      chat?.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat?.receiver_id?.toLowerCase().includes(searchTerm.toLowerCase());

    // Adjust the end date to include the entire day
    const adjustedEndDate = dateRange[1]
      ? new Date(dateRange[1].setHours(23, 59, 59, 999))
      : null;

    // Check if the chat is within the selected date range
    const isInDateRange =
      (!dateRange[0] || chatDate >= dateRange[0]) &&
      (!adjustedEndDate || chatDate <= adjustedEndDate);

    // Return true if it matches both search and date range
    return matchesSearch && isInDateRange;
  });

  // Then filter based on assigned/unassigned and sort the resulting array
  const displayedChats = sortChatsByDate(
    filteredChats.filter((chat) => {
      const isAssigned =
        chat.chat_room?.assign_user &&
        Object.keys(chat.chat_room.assign_user).length > 0;
      return showAssigned ? isAssigned : !isAssigned;
    })
  );

  // Recalculate counts dynamically based on filtered chats
  const recalculateCounts = (filteredChats) => {
    const totalChats = filteredChats.length;
    const unreadChats = filteredChats.filter(
      (chat) => chat.chat_room?.is_read === "unread"
    ).length;

    setDynamicTotalCount(totalChats);
    setDynamicUnreadCount(unreadChats);
  };

  const handleDateRangeChange = (update) => {
    setDateRange(update);

    if (update[0] && update[1]) {
      setAction("allchat"); // Show "allchat" when a date range is selected
    } else {
      setAction("active"); // Reset to active when date range is cleared
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    // Extract date components
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months are zero-indexed
    const year = date.getUTCFullYear();

    // Extract time components
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const strMinutes = minutes < 10 ? "0" + minutes : minutes;

    // Format the date and time
    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${strMinutes} ${ampm}`;

    return `${formattedDate} - ${formattedTime}`;
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "expired":
        return "bg-red-100 text-red-700";
      case "open":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "solved":
        return "bg-blue-100 text-blue-700";
      case "spam":
        return "bg-gray-100 text-gray-700";
      case "new":
        return "bg-purple-100 text-purple-700";
      case "qualified":
        return "bg-teal-100 text-teal-700";
      case "proposition":
        return "bg-amber-100 text-amber-700";
      case "won":
        return "bg-yellow-200 text-gold-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStarToggle = useCallback(
    async (chat) => {
      const chatId = chat.chat_room.id;
      const isStarred = !!starredChats[chatId];
      const newValue = isStarred ? 0 : 1;

      const payload = {
        action: "is_starred",
        receiver_id: chat.receiver_id,
        username: user.username,
        value: newValue,
      };

      try {
        await updateChatStatus(payload);
        updateStarredChats(chatId, !isStarred);

        if (selectedChat?.chat_room?.id === chatId) {
          setSelectedChat({
            ...selectedChat,
            chat_room: {
              ...selectedChat.chat_room,
              is_starred: !isStarred ? "favorite" : "none",
            },
          });
        }
      } catch (error) {
        handleApiError(error);
      }
    },
    [starredChats, updateStarredChats]
  );

  const renderMediaIcon = () => {
    return (
      <div className="flex gap-2 items-center my-1">
        <FontAwesomeIcon icon={faFile} className="text-gray-400 text-lg" />

        <p>Media File</p>
      </div>
    );
  };

  useEffect(() => {
    const initialChatType = CHATS_TYPE.find((type) => type.action === action);
    setSelectedChatType(
      initialChatType ? initialChatType.name : CHATS_TYPE[0].name
    );
  }, [action]);

  useEffect(() => {
    recalculateCounts(filteredChats);
  }, [filteredChats]);

  useEffect(() => {
    setLoading(true);
    // Simulating a short delay to show loading spinner
    setTimeout(() => setLoading(false), 500);
  }, [action, searchTerm, dateRange, showAssigned]);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-2">
        <div className="bg-slate-50 flex items-center gap-2 px-2 py-1.5 rounded-md">
          <FontAwesomeIcon icon={faSearch} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-slate-50 outline-none w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex justify-between items-center gap-2">
          <DatePicker
            selectsRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={handleDateRangeChange}
            isClearable
            placeholderText="Filter by date range"
            className="bg-slate-50 px-2 py-1.5 rounded-md outline-none"
          />

          <Button
            onClick={exportToCSV}
            title="Export contacts"
            className="bg-slate-50 border-none rounded-md font-medium !py-1.5"
          >
            <FontAwesomeIcon icon={faDownload} />
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div className="flex flex-col">
            <Dropdown
              options={CHATS_TYPE}
              value={selectedChatType}
              onChange={handleChatSelection}
              placeholder="All Chats"
              className="border-none font-medium text-xl pl-0"
            />
            <span className="text-xs font-medium text-slate-400">
              {`${dynamicTotalCount} Chats  ${dynamicUnreadCount} Unread`}
            </span>
          </div>

          <div className="flex gap-5">
            <Tooltip title="Refresh Chats" arrow>
              <FontAwesomeIcon
                icon={faRotateRight}
                spin={isRefreshing}
                onClick={handleRefresh}
                className="border-8 rounded-full bg-slate-200 text-slate-600 h-5 cursor-pointer hover:outline hover:outline-lime-600"
              />
            </Tooltip>

            <Tooltip title="Filter Chats" arrow>
              <FontAwesomeIcon
                icon={faFilter}
                onClick={handleModal}
                className="border-8 rounded-full bg-slate-200 text-slate-600 h-5 cursor-pointer hover:outline hover:outline-lime-600"
              />
            </Tooltip>

            <Tooltip title="Export Chats" arrow>
              <FontAwesomeIcon
                icon={faPlus}
                onClick={toggleContactTemplate}
                className="border-8 rounded-full bg-slate-200 text-slate-600 h-5 cursor-pointer hover:text-lime-600"
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="flex justify-around mb-3">
        <Button
          className={`bg-slate-50 border-none rounded-md font-medium ${
            showAssigned ? "outline outline-1 outline-slate-300" : ""
          }`}
          onClick={() => setShowAssigned(true)}
        >
          Assigned
        </Button>
        <Button
          className={`bg-slate-50 border-none rounded-md font-medium ${
            !showAssigned ? "outline outline-1 outline-slate-300" : ""
          }`}
          onClick={() => setShowAssigned(false)}
        >
          Unassigned
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="h-[50vh] overflow-y-scroll scrollbar-hide">
          {showContactTemplate ? (
            <ContactTemplate
              templates={templates}
              selectedReceiverId={selectedChat?.receiver_id}
              setShowContactTemplate={setShowContactTemplate}
              contacts={contacts}
              user={user?.username}
              updateChatMessages={updateChatMessages}
              reFetchChats={reFetchChats}
            />
          ) : displayedChats?.length > 0 ? (
            displayedChats?.map((chat) => {
              const displayName =
                chat?.replySourceMessage === "default_replySourceMessage"
                  ? chat?.receiver_id
                  : chat?.replySourceMessage;

              return (
                <div
                  key={chat?.chat_room?.id}
                  className="border-b py-4 hover:bg-[#fdfdfd] cursor-pointer px-2 my-1"
                  onMouseEnter={() => setHoveredChat(chat.chat_room.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{displayName}</h3>
                    <FontAwesomeIcon
                      icon={faStar}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering chat selection
                        handleStarToggle(chat);
                      }}
                      className={
                        starredChats[chat.chat_room.id]
                          ? "text-amber-300 cursor-pointer"
                          : hoveredChat === chat.chat_room.id
                          ? "text-slate-100 cursor-pointer"
                          : "hidden"
                      }
                    />
                  </div>

                  <div className="mb-1 text-sm truncate-multiline">
                    {chat.type === "text"
                      ? chat.text
                      : chat.type === null && chat.template_id
                      ? `Template ID: ${chat.template_id}`
                      : renderMediaIcon()}
                  </div>

                  <div className="flex justify-between text-xs">
                    <p
                      className={`px-2 py-1 rounded font-medium ${getStatusClass(
                        chat?.chat_room?.status
                      )}`}
                    >
                      {chat?.chat_room?.status}
                    </p>
                    <p>{formatDateTime(chat?.created_at)}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No messages found.</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          closeModal={handleModal}
          width="50vw"
          height="60vh"
        >
          <AdvanceFilter
            closeModal={handleModal}
            user={user}
            onFilterApply={onFilterApply}
          />
        </Modal>
      )}
    </div>
  );
};

export default ChatList;
