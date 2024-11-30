import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import ChatList from "../../components/TeamInbox/LeftSection/ChatList";
import ChatContainer from "../../components/TeamInbox/MiddleSection/ChatContainer";
import UserInfo from "../../components/TeamInbox/RightSection/UserInfo";

import {
  templateData,
  fetchAllChats,
  fetchSelectedChatData,
} from "../../services/api";

const TeamInbox = ({ user }) => {
  const [templates, setTemplates] = useState([]);
  const [chats, setChats] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [action, setAction] = useState("active");
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);
  const [starredChats, setStarredChats] = useState({});
  const [timer, setTimer] = useState(null);
  const [socket, setSocket] = useState(null);
  const selectedChatRef = useRef(null); // Use ref to persist selectedChat across renders

  // WebSocket connection setup
  useEffect(() => {
    const sender_id = user.mobile_no;

    const newSocket = io("http://182.71.43.74:6001", {
      query: { sender_id: sender_id },
    });
    setSocket(newSocket);

    // WebSocket connection established
    newSocket.on("connect", () => {
      console.log(`WebSocket connected with sender_id: ${sender_id} and socket ID: ${newSocket.id}`);
    });

    // Handle new incoming messages
    newSocket.on("newMessage", (message) => {
      console.log("Received new message:", message);
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

  const fetchTemplatesAndMessages = async () => {
    try {
      const response = await templateData({
        username: user.username,
        action: "read",
      });

      setTemplates(response?.data?.template || []);
    } catch (error) {
      toast.error("Failed to fetch templates");
    }
  };

  const fetchChats = async (actionType) => {
    try {
      const response = await fetchAllChats({
        action: actionType,
        username: user?.username,
      });
      if (response?.data?.data && response.data.data.length > 0) {
        setContacts(response?.data?.data);
        setChats(response?.data?.data);
        setUnreadCount(response?.data?.total_unread);
        setTotalCount(response?.data?.total_count);
      } else {
        setChats([]); // Clear chats when no data is found
        setUnreadCount(0); // Reset unread count
        setTotalCount(0); // Reset total count
      }
    } catch (error) {
      toast.error("Failed to fetch chats");
      setUnreadCount(0); // Reset unread count
      setTotalCount(0); // Reset total count
    }
  };

  const handleFilterApply = (filteredChats) => {
    setChats(filteredChats.data || []); // Set filtered data into chats state
    setUnreadCount(filteredChats?.total_unread); // Optionally reset unread count
    setTotalCount(filteredChats?.total_count); // Set total count based on filtered chats
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
        action: "get_time", // Fetching time remaining
        receiver_id,
        username: user?.username,
      });

      setTimer(timeResponse?.data?.data?.created_at);
    } catch (error) {
      toast.error("Failed to fetch chat messages time");
    }
  };

  const handleChatSelection = (chat) => {
    console.log("Chat selected:", chat);

    if (chat?.chat_room?.receiver_id) {
      setSelectedChat(chat);
      selectedChatRef.current = chat;  // Set the chat to the ref
      fetchChatMessages(chat.chat_room.receiver_id);
    } else {
      console.log("Selected chat does not have a valid chat_room or receiver_id");
    }
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
    const currentChat = selectedChatRef.current;

    console.log("newMessage received:", newMessage);
    console.log("Current selectedChatRef receiver_id:", currentChat?.chat_room?.receiver_id);

    // Ensure selectedChatRef and chat_room exist before comparing
    if (!currentChat || !currentChat.chat_room?.receiver_id) {
      console.log("Selected chat or chat_room is missing. Avoiding reset for now.");
      return;
    }

    if (String(currentChat.chat_room.receiver_id) === String(newMessage.waId)) {
      console.log("Updating messages for selected chat:", currentChat.chat_room.name);

      // Add new message to selected chat
      setSelectedChatMessages((prevMessages) => 
         [...prevMessages, newMessage]);

      // Also update the latest message in the chat list
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.chat_room.receiver_id === newMessage.waId
            ? {
                ...chat,
                text: newMessage.text,
                created_at: new Date().toISOString(),
              }
            : chat
        )
      );
    } else {
      console.log("Message belongs to another chat, updating chat list.");

      // Update the chat list if it's a different chat
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.chat_room.receiver_id === newMessage.waId
            ? {
                ...chat,
                text: newMessage.text,
                created_at: new Date().toISOString(),
                hasNewMessage: true,
              }
            : chat
        )
      );
    }
  };

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

  useEffect(() => {
    console.log("Selected chat updated:", selectedChat);
    selectedChatRef.current = selectedChat;  // Keep ref updated when selectedChat changes
  }, [selectedChat]);

  return (
    <div className="flex grow">
      <div className="basis-1/4 min-w-0">
        <ChatList
          templates={templates}
          chats={chats}
          unreadCount={unreadCount}
          totalCount={totalCount}
          action={action}
          setAction={setAction}
          user={user}
          contacts={contacts}
          setSelectedChat={handleChatSelection}
          starredChats={starredChats}
          updateStarredChats={updateStarredChats}
          updateChatMessages={updateChatMessages}
          onFilterApply={handleFilterApply}
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
        />
      </div>

      <div className="basis-1/4 min-w-0">
        <UserInfo
          Contact={selectedChat?.chat_room?.receiver_id || ""}
          Name={selectedChat?.replySourceMessage || ""}
          user={user?.username}
        />
      </div>
    </div>
  );
};

export default TeamInbox;


// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client"; // Add socket.io-client
// import ChatList from "../../components/TeamInbox/LeftSection/ChatList";
// import ChatContainer from "../../components/TeamInbox/MiddleSection/ChatContainer";
// import UserInfo from "../../components/TeamInbox/RightSection/UserInfo";

// import {
//   templateData,
//   fetchAllChats,
//   fetchSelectedChatData,
// } from "../../services/api";

// const TeamInbox = ({ user }) => {
//   const [templates, setTemplates] = useState([]);
//   const [chats, setChats] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [totalCount, setTotalCount] = useState(0);
//   const [action, setAction] = useState("active");
//   const [contacts, setContacts] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [selectedChatMessages, setSelectedChatMessages] = useState([]);
//   const [starredChats, setStarredChats] = useState({});
//   const [timer, setTimer] = useState(null);
//   const [socket, setSocket] = useState(null); // Socket state

//   // WebSocket connection setup
//   useEffect(() => {
//     const sender_id = user.mobile_no;
  
//     // Initialize WebSocket connection with sender_id
//     const newSocket = io("http://182.71.43.74:6001", {
//       query: { sender_id: sender_id },
//     });
//     setSocket(newSocket);
  
//     // WebSocket connection established
//     newSocket.on('connect', () => {
//       console.log(`WebSocket connected with sender_id: ${sender_id} and socket ID: ${newSocket.id}`);
//     });
  
//     // Handle new incoming messages
//     newSocket.on("newMessage", (message) => {
//       console.log("Received new message:", message);
  
//       // Check if the message type is 'image', 'video', or 'document'
//       if (message.type === 'image' || message.type === 'video' || message.type === 'document') {
//         // First update the 'media' field with the correct URL
//         if (message.media) {
//           console.log(`Media URL found in 'media' field: ${message.media}`);
//         } else if (message.text) {
//           // If 'media' field is missing, use the 'text' field as a fallback for the media URL
//           message.media = message.text;
//           console.log(`Media URL updated from 'text' field: ${message.media}`);
//         } else {
//           console.log("No media URL found.");
//         }
  
//         // Then, empty the 'text' field
//         message.text = "";
//       }
  
//       // Adjust the timestamp (add 5 hours and 30 minutes)
//       if (message.created_at || message.created) {
//         const date = new Date(message.created_at || message.created);
//         const adjustedTime = new Date(date.getTime() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000)); // Add 5h 30m
//         message.created_at = adjustedTime.toISOString(); // Or use toLocaleString() if you want a local format
//         console.log(`Adjusted time: ${message.created_at}`);
//       }
  
//       // Log the updated message to verify changes
//       console.log("Updated message:", message);
  
//       // Now update the chat UI with the new message
//       updateChatMessages(message); // Call the function to update the chat UI
//     });
  
//     // Handle disconnection
//     newSocket.on('disconnect', () => {
//       console.log(`WebSocket disconnected with sender_id: ${sender_id}`);
//     });
  
//     // Cleanup WebSocket connection on component unmount
//     return () => {
//       newSocket.off("newMessage");
//       newSocket.disconnect();
//     };
//   }, [user.mobile_no]);
  
  
  
  
//  // Re-run this effect when the mobile number changes

//   const fetchTemplatesAndMessages = async () => {
//     try {
//       const response = await templateData({
//         username: user.username,
//         action: "read",
//       });

//       setTemplates(response?.data?.template || []);
//     } catch (error) {
//       toast.error("Failed to fetch templates");
//     }
//   };

//   const fetchChats = async (actionType) => {
//     try {
//       const response = await fetchAllChats({
//         action: actionType,
//         username: user?.username,
//       });
//       if (response?.data?.data && response.data.data.length > 0) {
//         setContacts(response?.data?.data);
//         setChats(response?.data?.data);
//         setUnreadCount(response?.data?.total_unread);
//         setTotalCount(response?.data?.total_count);
//       } else if (response?.data?.message) {
//         setChats([]); // Clear chats when no data is found
//         setUnreadCount(0); // Reset unread count
//         setTotalCount(0); // Reset total count
//       } else {
//         toast.error("No data found");
//         setUnreadCount(0);
//         setTotalCount(0);
//       }
//     } catch (error) {
//       toast.error("Failed to fetch chats");
//       setUnreadCount(0); // Reset unread count
//       setTotalCount(0); // Reset total count
//     }
//   };

//   const handleFilterApply = (filteredChats) => {
//     setChats(filteredChats.data || []); // Set filtered data into chats state
//     setUnreadCount(filteredChats?.total_unread); // Optionally reset unread count
//     setTotalCount(filteredChats?.total_count); // Set total count based on filtered chats
//   };

//   const fetchChatMessages = async (receiver_id) => {
//     try {
//       const response = await fetchSelectedChatData({
//         action: "read",
//         receiver_id,
//         username: user?.username,
//       });
//       setSelectedChatMessages(response?.data?.data);

//       const timeResponse = await fetchSelectedChatData({
//         action: "get_time", // Fetching time remaining
//         receiver_id,
//         username: user?.username,
//       });

//       setTimer(timeResponse?.data?.data?.created_at);
//     } catch (error) {
//       toast.error("Failed to fetch chat messages time");
//     }
//   };

//   const handleChatSelection = (chat) => {
//     setSelectedChat(chat);
//     fetchChatMessages(chat.chat_room.receiver_id);
//   };

//   const updateChatAgent = (chatId, agentName) => {
//     setChats((prevChats) =>
//       prevChats.map((chat) =>
//         chat.chat_room.id === chatId
//           ? {
//               ...chat,
//               chat_room: {
//                 ...chat.chat_room,
//                 assign_user: {
//                   ...chat.chat_room.assign_user,
//                   assign_user: agentName,
//                 },
//               },
//             }
//           : chat
//       )
//     );
//   };

//   const updateStarredChats = (chatId, isStarred) => {
//     setStarredChats((prevStarredChats) => ({
//       ...prevStarredChats,
//       [chatId]: isStarred,
//     }));

//     setChats((prevChats) =>
//       prevChats.map((chat) =>
//         chat.chat_room.id === chatId
//           ? {
//               ...chat,
//               chat_room: {
//                 ...chat.chat_room,
//                 is_starred: isStarred ? "favorite" : "none",
//               },
//             }
//           : chat
//       )
//     );
//   };

//   const updateStatus = (chatId, status) => {
//     setChats((prevChats) =>
//       prevChats.map((chat) =>
//         chat.chat_room.id === chatId
//           ? {
//               ...chat,
//               chat_room: { ...chat.chat_room, status },
//             }
//           : chat
//       )
//     );
//   };

//   const updateChatMessages = (newMessages) => {
//     setSelectedChatMessages((prevMessages) => [...prevMessages, newMessages]);

//     if (selectedChat && selectedChat.chat_room) {
//       setChats((prevChats) =>
//         prevChats.map((chat) =>
//           chat.chat_room && chat.chat_room.id === selectedChat.chat_room.id
//             ? {
//                 ...chat,
//                 text: newMessages.text,
//               }
//             : chat
//         )
//       );
//     }
//   };
 

//   useEffect(() => {
//     fetchTemplatesAndMessages();
//   }, []);

//   useEffect(() => {
//     fetchChats(action);
//   }, [action]);

//   useEffect(() => {
//     const initialStarredChats = chats.reduce((acc, chat) => {
//       if (chat?.chat_room?.is_starred === "favorite") {
//         acc[chat.chat_room.id] = true;
//       }
//       return acc;
//     }, {});
//     setStarredChats(initialStarredChats);
//   }, [chats]);

//   return (
//     <div className="flex grow">
//       <div className="basis-1/4 min-w-0">
//         <ChatList
//           templates={templates}
//           chats={chats}
//           unreadCount={unreadCount}
//           totalCount={totalCount}
//           action={action}
//           setAction={setAction}
//           user={user}
//           contacts={contacts}
//           setSelectedChat={handleChatSelection}
//           starredChats={starredChats}
//           updateStarredChats={updateStarredChats}
//           updateChatMessages={updateChatMessages}
//           onFilterApply={handleFilterApply}
//         />
//       </div>

//       <div className="basis-1/2 min-w-0">
//         <ChatContainer
//           templates={templates}
//           selectedChat={selectedChat}
//           selectedChatMessages={selectedChatMessages}
//           user={user}
//           setSelectedChat={setSelectedChat}
//           updateStarredChats={updateStarredChats}
//           updateStatus={updateStatus}
//           updateChatAgent={updateChatAgent}
//           updateChatMessages={updateChatMessages}
//           timer={timer}
//         />
//       </div>

//       <div className="basis-1/4 min-w-0">
//         <UserInfo
//           Contact={selectedChat?.chat_room?.receiver_id || ""}
//           Name={selectedChat?.replySourceMessage || ""}
//           user={user?.username}
//         />
//       </div>
//     </div>
//   );
// };

// export default TeamInbox;
