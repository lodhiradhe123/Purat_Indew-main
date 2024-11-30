import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { io } from "socket.io-client";

import ChatList from "../../components/TeamInbox/LeftSection/ChatList";
import ChatContainer from "../../components/TeamInbox/MiddleSection/ChatContainer";
import UserInfo from "../../components/TeamInbox/RightSection/UserInfo";

import handleApiError from "../../utils/errorHandler";
import {
  templateData,
  fetchAllChats,
  fetchSelectedChatData,
} from "../../services/api";

const TeamInbox = ({ user }) => {
  const [templates, setTemplates] = useState([]);
  const [chats, setChats] = useState([]);
  const [action, setAction] = useState("active");
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);
  const [starredChats, setStarredChats] = useState({});
  const [timer, setTimer] = useState(null);
  const [socket, setSocket] = useState(null); // Socket state
  const selectedChatRef = useRef(null); // Create a ref for selectedChat

  // WebSocket connection setup
  useEffect(() => {
    const sender_id = user.mobile_no;

    // Initialize WebSocket connection with sender_id
    const newSocket = io("https://websocket.nuke.co.in", {
      query: { sender_id: sender_id },
    });
    setSocket(newSocket);

    // WebSocket connection established
    newSocket.on("connect", () => {
      console.log(
        `WebSocket connected with sender_id: ${sender_id} and socket ID: ${newSocket.id}`
      );
    });

    // Handle new incoming messages
    newSocket.on("newMessage", (message) => {
      console.log("Received new message:", message);

      // Attach a flag to indicate that this message comes from WebSocket
      message.isWebSocket = true;

      // Check if the message type is 'image', 'video', or 'document'
      if (
        message.type === "image" ||
        message.type === "video" ||
        message.type === "document"
      ) {
        // First update the 'media' field with the correct URL
        if (message.media) {
          console.log(`Media URL found in 'media' field: ${message.media}`);
        } else if (message.text) {
          // If 'media' field is missing, use the 'text' field as a fallback for the media URL
          message.media = message.text;
          console.log(`Media URL updated from 'text' field: ${message.media}`);
        } else {
          console.log("No media URL found.");
        }

        // Then, empty the 'text' field
        message.text = "";
      }

      // Adjust the timestamp (add 5 hours and 30 minutes)
      if (message.created_at || message.created) {
        const date = new Date(message.created_at || message.created);
        const adjustedTime = new Date(
          date.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
        ); // Add 5h 30m
        message.created_at = adjustedTime.toISOString(); // Or use toLocaleString() if you want a local format
        console.log(`Adjusted time: ${message.created_at}`);
      }

      // Log the updated message to verify changes
      console.log("Updated message:", message);

      // Now update the chat UI with the new message
      updateChatMessages(message); // Call the function to update the chat UI
    });

    // Handle disconnection
    newSocket.on("disconnect", () => {
      console.log(`WebSocket disconnected with sender_id: ${sender_id}`);
    });

    // Cleanup WebSocket connection on component unmount
    return () => {
      newSocket.off("newMessage");
      newSocket.disconnect();
    };
  }, [user.mobile_no]);

  // Re-run this effect when the mobile number changes

  const fetchTemplatesAndMessages = async () => {
    try {
      const response = await templateData({
        username: user.username,
        action: "read",
      });

      setTemplates(response?.data?.template || []);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchChats = async (actionType) => {
    try {
      const response = await fetchAllChats({
        action: actionType,
        username: user?.username,
      });
      if (response?.data?.data && response.data.data.length > 0) {
        // If data is present
        if (actionType === "allchat") {
          setContacts(response?.data?.data);
          setChats(response?.data?.data);
        } else {
          setChats(response?.data?.data);
        }
      } else if (response?.data?.message) {
        // Show specific message from backend
        setChats([]); // Clear chats when no data is found
      } else {
        // Generic fallback if no message is provided
        toast.error("No data found");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleFilterApply = (filteredChats) => {
    setChats(filteredChats.data || []); // Set filtered data into chats state
  };

  const fetchChatMessages = async (receiver_id) => {
    try {
      const response = await fetchSelectedChatData({
        action: "read",
        receiver_id,
        username: user?.username,
      });
      setSelectedChatMessages(response?.data?.data);

      const timeResponse = await fetchSelectedChatData({
        action: "get_time",
        receiver_id,
        username: user?.username,
      });

      setTimer(timeResponse?.data?.data?.created_at);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleChatSelection = (chat) => {
    console.log("Selected chat object:", chat);
    console.log("Selected chat_room:", chat.chat_room);
    console.log("Selected chat_room.receiver_id:", chat.chat_room?.receiver_id);

    setSelectedChat(chat);
    selectedChatRef.current = chat; // Update the ref when the selected chat changes
    fetchChatMessages(chat.chat_room.receiver_id);
  };

  const updateChatAgent = (chatId, agentName) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chat_room.id === chatId
          ? {
              ...chat,
              chat_room: {
                ...chat.chat_room,
                assign_user: {
                  ...chat.chat_room.assign_user,
                  assign_user: agentName,
                },
              },
            }
          : chat
      )
    );
  };

  const updateStarredChats = (chatId, isStarred) => {
    setStarredChats((prevStarredChats) => ({
      ...prevStarredChats,
      [chatId]: isStarred,
    }));

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chat_room.id === chatId
          ? {
              ...chat,
              chat_room: {
                ...chat.chat_room,
                is_starred: isStarred ? "favorite" : "none",
              },
            }
          : chat
      )
    );
  };

  const updateStatus = (chatId, status) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chat_room.id === chatId
          ? {
              ...chat,
              chat_room: { ...chat.chat_room, status },
            }
          : chat
      )
    );
  };

  const updateChatMessages = (newMessage) => {
    const selectedChat = selectedChatRef.current; // Use the ref instead of state

    // Check if selectedChat or chat_room.receiver_id is missing
    if (
      !selectedChat ||
      !selectedChat.chat_room ||
      !selectedChat.chat_room.receiver_id
    ) {
      console.log(
        "Selected chat or chat_room.receiver_id is undefined. Ignoring message."
      );
      return;
    }

    // Determine the identifier to compare (receiver_id or waId)
    const compareId = String(newMessage.receiver_id || newMessage.waId); // Ensure it's a string

    // Check if the message is from WebSocket and matches the selected chat
    if (newMessage.isWebSocket) {
      if (String(compareId) === String(selectedChat.chat_room.receiver_id)) {
        console.log("WebSocket message matches the current chat.");
        setSelectedChatMessages((prevMessages) => [
          ...prevMessages,
          newMessage,
        ]);
      } else {
        console.log(
          "WebSocket message does not match the current chat and will be ignored."
        );
      }
    } else {
      // For form or template messages, assume it's the current chat
      console.log("Updating from form or template.");
      setSelectedChatMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    // Optionally update the chat preview (if needed)
    if (selectedChat && selectedChat.chat_room) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.chat_room && chat.chat_room.id === selectedChat.chat_room.id
            ? {
                ...chat,
                text: newMessage.text,
              }
            : chat
        )
      );
    }
  };

  // Ensure selectedChatRef is always up-to-date
  useEffect(() => {
    selectedChatRef.current = selectedChat; // Sync the ref with the selectedChat state
  }, [selectedChat]);

  useEffect(() => {
    fetchTemplatesAndMessages();
  }, []);

  useEffect(() => {
    fetchChats(action);
  }, [action]);

  useEffect(() => {
    const initialStarredChats = chats.reduce((acc, chat) => {
      if (chat?.chat_room?.is_starred === "favorite") {
        acc[chat.chat_room.id] = true;
      }
      return acc;
    }, {});
    setStarredChats(initialStarredChats);
  }, [chats]);

  return (
    <div className="flex grow">
      <ToastContainer />

      <div className="basis-1/4 min-w-0">
        <ChatList
          templates={templates}
          chats={chats}
          action={action}
          setAction={setAction}
          user={user}
          contacts={contacts}
          selectedChat={selectedChat}
          setSelectedChat={handleChatSelection}
          starredChats={starredChats}
          updateStarredChats={updateStarredChats}
          updateChatMessages={updateChatMessages}
          onFilterApply={handleFilterApply}
          reFetchChats={fetchChats}
          actionType={action}
        />
      </div>

      <div className="basis-1/2 min-w-0">
        <ChatContainer
          templates={templates}
          selectedChat={selectedChat}
          selectedChatMessages={selectedChatMessages}
          user={user}
          setSelectedChat={setSelectedChat}
          updateStarredChats={updateStarredChats}
          updateStatus={updateStatus}
          updateChatAgent={updateChatAgent}
          updateChatMessages={updateChatMessages}
          timer={timer}
          reFetchChats={fetchChats}
          actionType={action}
        />
      </div>

      <div className="basis-1/4 min-w-0">
        <UserInfo selectedChat={selectedChat} user={user?.username} />
      </div>
    </div>
  );
};

export default TeamInbox;
