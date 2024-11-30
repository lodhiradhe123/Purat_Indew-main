// import React, { useState, useMemo, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import UserProfileModal from "./UserProfileModal";
// import UserTransactionModal from "./UserTransactionModal";
// import FundsManagementModal from "./FundsManagementModal";
// import { clients } from "../../services/api"; // Already set up
// import Modal from "../Modal";

// const BroadcastList = ({ user }) => {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [orderBy, setOrderBy] = useState("createdDate");
//     const [order, setOrder] = useState("desc");
//     const [filter, setFilter] = useState("newest");
//     const [profileModalOpen, setProfileModalOpen] = useState(false);
//     const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
//     const [isFundsModalOpen, setFundsModalOpen] = useState(false);
//     const [broadcastData, setBroadcastData] = useState([]); // Store API data here
//     const [loading, setLoading] = useState(true); // Loading state
//     const [selectedUsername, setSelectedUsername] = useState(""); // For passing client_username

//     const fetchBroadcasts = async () => {
//         try {
//             const response = await clients({
//                 action: "read", // Payload to send
//                 username: user, // Assuming username is 'user' as per your example
//             });

//             const broadcast = response.data.data;

//             if (response.data && Array.isArray(response.data.data)) {
//                 setBroadcastData(response.data.data); // Store the fetched data
//             } else {
//                 toast.error("Failed to fetch broadcast data");
//             }
//         } catch (error) {
//             toast.error("Error fetching broadcast data");
//             toast.error("API error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleOpenTransactionModal = (username) => {
//         console.log("Opening transaction modal for client:", username); // Debugging to check correct username
//         setSelectedUsername(username); // Set the username to be sent to the modal
//         setTransactionModalOpen(true); // Open the transaction modal
//     };

//     const handleOpenFundsModal = (username) => {
//         console.log("Opening funds modal for client:", username); // Debugging to check correct username
//         setSelectedUsername(username); // Set the username to be sent to the funds modal
//         setFundsModalOpen(true); // Open the funds modal
//     };

//     useEffect(() => {
//         fetchBroadcasts();
//     }, [user]);

//     const handleChangeUserType = async (userId, currentUserType) => {
//         const newUserType =
//             currentUserType === "client" ? "reseller" : "client";

//         try {
//             const response = await clients({
//                 action: "usertype",
//                 client_id: userId,
//                 user_type: newUserType,
//             });

//             if (response.data.data) {
//                 setBroadcastData((prevData) =>
//                     prevData.map((broadcast) =>
//                         broadcast.id === userId
//                             ? { ...broadcast, user_type: newUserType }
//                             : broadcast
//                     )
//                 );
//                 fetchBroadcasts();
//                 toast.success(`User type changed to ${newUserType}`);
//             } else {
//                 console.error("Failed to update user type");
//                 toast.error("Failed to update user type");
//             }
//         } catch (error) {
//             console.error("Error updating user type:", error);
//             toast.error("Error updating user type");
//         }
//     };

//     const filteredAndSortedBroadcasts = useMemo(() => {
//         let filtered = broadcastData.filter((broadcast) =>
//             Object.values(broadcast).some(
//                 (value) =>
//                     value &&
//                     value
//                         .toString()
//                         .toLowerCase()
//                         .includes(searchTerm.toLowerCase())
//             )
//         );

//         if (filter === "newest") {
//             filtered = filtered.sort(
//                 (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
//             );
//         } else {
//             filtered = filtered.sort(
//                 (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
//             );
//         }

//         return filtered;
//     }, [broadcastData, searchTerm, filter]);

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const handleRequestSort = (property) => {
//         const isAsc = orderBy === property && order === "asc";
//         setOrder(isAsc ? "desc" : "asc");
//         setOrderBy(property);
//     };

//     const handleOpenUserProfile = () => {
//         setProfileModalOpen(true);
//     };

//     const handleLoginClick = (username) => {
//         console.log(`Logging in user: ${username}`);
//         toast.success(`Login successful for ${username}`);
//     };

//     const handleStatusToggle = async (userId) => {
//         const updatedBroadcastData = broadcastData.map((broadcast) =>
//             broadcast.id === userId
//                 ? {
//                       ...broadcast,
//                       status:
//                           broadcast.status === "enabled"
//                               ? "disabled"
//                               : "enabled",
//                   }
//                 : broadcast
//         );
//         setBroadcastData(updatedBroadcastData);
//     };

//     const handleDownloadCSV = () => {
//         const headers = [
//             "Action",
//             "User Name",
//             "Email",
//             "User Type",
//             "Name",
//             "Mobile No.",
//             "Login",
//             "Status",
//             "Created Date",
//             "WhatsApp Credits",
//             "Promotional Credits",
//             "Transactional Credits",
//             "Voice Credits",
//             "Global Credits",
//             "GSM SMS",
//             "Business WhatsApp Credits",
//         ];
//         const csvContent = [
//             headers.join(","),
//             ...filteredAndSortedBroadcasts.map((broadcast) =>
//                 [
//                     "Settings, Transactions, Funds",
//                     broadcast.username,
//                     broadcast.email,
//                     broadcast.usertype,
//                     broadcast.name,
//                     broadcast.mobile,
//                     broadcast.login,
//                     broadcast.status,
//                     broadcast.createdDate,
//                     broadcast.whatsappCredits,
//                     broadcast.promotionalCredits,
//                     broadcast.transactionalCredits,
//                     broadcast.voiceCredits,
//                     broadcast.globalCredits,
//                     broadcast.gsmSMS,
//                     broadcast.businessWhatsappCredits,
//                 ].join(",")
//             ),
//         ].join("\n");

//         const blob = new Blob([csvContent], {
//             type: "text/csv;charset=utf-8;",
//         });
//         const link = document.createElement("a");
//         if (link.download !== undefined) {
//             const url = URL.createObjectURL(blob);
//             link.setAttribute("href", url);
//             link.setAttribute("download", `broadcast_list_${Date.now()}.csv`);
//             link.style.visibility = "hidden";
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         }
//     };

//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="p-4 bg-white rounded-xl shadow-lg mb-12 mt-12"
//         >
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//                 <h1 className="text-2xl font-bold text-black">User List</h1>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//                 <input
//                     type="text"
//                     className="w-full p-2 border rounded"
//                     placeholder="Search users"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <select
//                     value={filter}
//                     onChange={(e) => setFilter(e.target.value)}
//                     className="w-full p-2 border rounded"
//                 >
//                     <option value="newest">Newest</option>
//                     <option value="oldest">Oldest</option>
//                 </select>
//                 <button
//                     className="w-full p-2 border rounded bg-blue-500 text-white"
//                     onClick={handleDownloadCSV}
//                 >
//                     Download CSV
//                 </button>
//             </div>

//             {loading ? (
//                 <div className="text-center py-12">Loading data...</div>
//             ) : filteredAndSortedBroadcasts.length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full bg-white border border-gray-300">
//                         <thead className="bg-blue-500 text-white">
//                             <tr>
//                                 <th
//                                     style={{ width: "200px" }}
//                                     className="p-2 cursor-pointer"
//                                 >
//                                     Action
//                                 </th>
//                                 {[
//                                     "User Name",
//                                     "Email",
//                                     "User Type",
//                                     "Name",
//                                     "Mobile No.",
//                                     "Login",
//                                     "Status",
//                                     "Created Date",
//                                     "WhatsApp Credits",
//                                     "Promotional Credits",
//                                     "Transactional Credits",
//                                     "Voice Credits",
//                                     "Global Credits",
//                                     "GSM SMS",
//                                     "Business WhatsApp Credits",
//                                 ].map((headCell) => (
//                                     <th
//                                         key={headCell}
//                                         className="p-2 cursor-pointer"
//                                         onClick={() =>
//                                             handleRequestSort(
//                                                 headCell.toLowerCase()
//                                             )
//                                         }
//                                     >
//                                         {headCell}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <AnimatePresence>
//                                 {filteredAndSortedBroadcasts
//                                     .slice(
//                                         page * rowsPerPage,
//                                         page * rowsPerPage + rowsPerPage
//                                     )
//                                     .map((broadcast) => (
//                                         <motion.tr
//                                             key={broadcast.id}
//                                             initial={{ opacity: 0 }}
//                                             animate={{ opacity: 1 }}
//                                             exit={{ opacity: 0 }}
//                                             transition={{ duration: 0.3 }}
//                                             className="bg-gray-100 odd:bg-gray-200"
//                                         >
//                                             <td
//                                                 className="p-2"
//                                                 style={{ width: "200px" }}
//                                             >
//                                                 <div className="flex flex-col">
//                                                     <button
//                                                         className="text-blue-500"
//                                                         onClick={
//                                                             handleOpenUserProfile
//                                                         }
//                                                     >
//                                                         ⚙️ Settings
//                                                     </button>

//                                                     <td className="p-2">
//                                                         <button onClick={() => handleOpenTransactionModal(broadcast.client_username)}>
//                                                         💳 Transactions
//                                                         </button>
//                                                     </td>

//                                                     <button onClick={() => handleOpenFundsModal(broadcast.client_username)}>
//                                                         💼 Funds
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                             <td className="p-2">
//                                                 {broadcast.username}
//                                             </td>
//                                             <td className="p-2">
//                                                 {broadcast.client_email}
//                                             </td>

//                                             <td className="p-2">
//                                                 <div>{broadcast.user_type}</div>{" "}
//                                                 <button
//                                                     className="mt-2 p-2 rounded bg-blue-500 text-white"
//                                                     onClick={() =>
//                                                         handleChangeUserType(
//                                                             broadcast.id,
//                                                             broadcast.user_type
//                                                         )
//                                                     }
//                                                 >
//                                                     Change User Type
//                                                 </button>
//                                             </td>

//                                             <td className="p-2">
//                                                 {broadcast.first_name}
//                                             </td>
//                                             <td className="p-2">
//                                                 {broadcast.client_mobile_no}
//                                             </td>
//                                             <td className="p-2">
//                                                 <button
//                                                     className="bg-blue-500 text-white p-2 rounded"
//                                                     onClick={() =>
//                                                         handleLoginClick(
//                                                             broadcast.username
//                                                         )
//                                                     }
//                                                 >
//                                                     Login
//                                                 </button>
//                                             </td>
//                                             <td className="p-2">
//                                                 <button
//                                                     className={`p-2 rounded ${
//                                                         broadcast.status ===
//                                                         "enabled"
//                                                             ? "bg-green-500"
//                                                             : "bg-red-500"
//                                                     } text-white`}
//                                                     onClick={() =>
//                                                         handleStatusToggle(
//                                                             broadcast.id
//                                                         )
//                                                     }
//                                                 >
//                                                     {broadcast.status ===
//                                                     "enabled"
//                                                         ? "Enabled"
//                                                         : "Disabled"}
//                                                 </button>
//                                             </td>
//                                             <td className="p-2">
//                                                 {broadcast.created_at}
//                                             </td>
//                                             <td className="p-2">
//                                                 {
//                                                     broadcast.credit
//                                                         .whatsapp_credits
//                                                 }
//                                             </td>
//                                             <td className="p-2">
//                                                 {broadcast.promotionalCredits}
//                                             </td>
//                                             <td className="p-2">
//                                                 {broadcast.transactionalCredits}
//                                             </td>
//                                             <td className="p-2">
//                                                 {broadcast.credit.voice_credits}
//                                             </td>
//                                             <td className="p-2">
//                                                 {broadcast.globalCredits}
//                                             </td>
//                                             <td className="p-2">
//                                                 {broadcast.gsmSMS}
//                                             </td>
//                                             <td className="p-2">
//                                                 {
//                                                     broadcast.businessWhatsappCredits
//                                                 }
//                                             </td>
//                                         </motion.tr>
//                                     ))}
//                             </AnimatePresence>
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="text-center py-12"
//                 >
//                     No users found.
//                 </motion.div>
//             )}

//             <UserTransactionModal
//                 open={isTransactionModalOpen}
//                 handleClose={() => setTransactionModalOpen(false)}
//                 clientUsername={selectedUsername} // Pass the selected username from the state
//             />

//             {filteredAndSortedBroadcasts.length > 0 && (
//                 <div className="flex justify-between items-center py-2">
//                     <button
//                         onClick={(e) =>
//                             handleChangePage(e, Math.max(page - 1, 0))
//                         }
//                         className="p-2 border rounded bg-gray-200"
//                     >
//                         Previous
//                     </button>
//                     <button
//                         onClick={(e) => handleChangePage(e, page + 1)}
//                         className="p-2 border rounded bg-gray-200"
//                     >
//                         Next
//                     </button>
//                 </div>
//             )}

//             <UserProfileModal
//                 open={profileModalOpen}
//                 handleClose={() => setProfileModalOpen(false)}
//                 user={{}}
//             />
//             {isFundsModalOpen && (
//                 <Modal
//                     isModalOpen={isFundsModalOpen}
//                     closeModal={() => setFundsModalOpen(false)}
//                 >
//                     <FundsManagementModal
//                         open={isFundsModalOpen}
//                         handleClose={() => setFundsModalOpen(false)}
//                         user={selectedUsername} // Pass selected username here as well
//                         services={[]}
//                     />
//                 </Modal>
//             )}

//             <ToastContainer position="top-left" autoClose={3000} />
//         </motion.div>
//     );
// };

// export default BroadcastList;

// import React, { useState, useMemo, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import UserProfileModal from "./UserProfileModal";
// import UserTransactionModal from "./UserTransactionModal";
// import FundsManagementModal from "./FundsManagementModal";
// import { clients, impersonate } from "../../services/api";
// import Modal from "../Modal";

// const ClientsBoard = ({ user }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [orderBy, setOrderBy] = useState("createdDate");
//   const [order, setOrder] = useState("desc");
//   const [filter, setFilter] = useState("newest");
//   const [profileModalOpen, setProfileModalOpen] = useState(false);
//   const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
//   const [isFundsModalOpen, setFundsModalOpen] = useState(false);
//   const [broadcastData, setBroadcastData] = useState([]); // Store API data here
//   const [loading, setLoading] = useState(true); // Loading state
//   const [selectedUsername, setSelectedUsername] = useState(""); // For passing client_username
//   const [userProfileData, setUserProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     clientMobileNo: "",
//     clientEmail: "",
//     user_type: "",
//     country: "",
//   });

//   const fetchBroadcasts = async () => {
//     try {
//       const response = await clients({
//         action: "read", // Payload to send
//         username: user, // Assuming username is 'user' as per your example
//       });

//       const broadcast = response.data.data;
//       console.log("broadcast", broadcast);

//       if (response.data && Array.isArray(response.data.data)) {
//         setBroadcastData(response.data.data); // Store the fetched data
//       } else {
//         toast.error("Failed to fetch broadcast data");
//       }
//     } catch (error) {
//       toast.error("Error fetching broadcast data");
//       console.error("API error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const LoginClick = async (id) => {
//     try {
//       const response = await impersonate({
//         user_id: id, // Ensure id is being passed here
//       });

//       if (response.status === 200) {
//         toast.success(`Login successful for user ${id}`);
//       } else {
//         toast.error("Failed to login");
//       }
//     } catch (error) {
//       toast.error("Error occurred while logging in");
//       console.error("API error:", error);
//     }
//   };

//   const handleOpenTransactionModal = (username) => {
//     console.log("Opening transaction modal for client:", username); // Debugging to check correct username
//     setSelectedUsername(username); // Set the username to be sent to the modal
//     setTransactionModalOpen(true); // Open the transaction modal
//   };

//   const handleOpenFundsModal = (username) => {
//     console.log("Opening funds modal for client:", username); // Debugging to check correct username
//     setSelectedUsername(username); // Set the username to be sent to the funds modal
//     setFundsModalOpen(true); // Open the funds modal
//   };

//   const handleOpenUserProfileModal = (
//     firstName,
//     lastName,
//     clientMobileNo,
//     clientEmail,
//     user_type,
//     client_username,
//     country
//   ) => {
//     setUserProfileData({
//       firstName,
//       lastName,
//       clientMobileNo,
//       clientEmail,
//       user_type,
//       client_username,
//       country,
//     });
//     setProfileModalOpen(true);
//   };

//   const handleStatusToggle = async (userId, currentStatus, client_username) => {
//     console.log("broadcast data client", broadcastData);
//     console.log("clientusername", broadcastData?.[0]?.client_username);
//     const newStatus = currentStatus === "enabled" ? "false" : "true"; // Toggle between true and false
//     try {
//       const response = await clients({
//         action: "changeStatus", // Your action here
//         c_username: client_username, // Pass client username
//         status: newStatus, // Send the new status value
//       });

//       if (response.data && response.data.success) {
//         // Update the local state to reflect the change

//         setBroadcastData((prevData) =>
//           prevData.map((broadcast) =>
//             broadcast.id === userId
//               ? {
//                   ...broadcast,
//                   status: newStatus === "true" ? "enabled" : "disabled",
//                 }
//               : broadcast
//           )
//         );
//         toast.success(
//           `Status changed to ${newStatus === "true" ? "enabled" : "disabled"}`
//         );
//       } else {
//         toast.error("Failed to change status");
//       }
//     } catch (error) {
//       toast.error("Error occurred while changing status");
//       console.error("API error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBroadcasts();
//   }, [user]);

//   const handleChangeUserType = async (userId, currentUserType) => {
//     const newUserType = currentUserType === "client" ? "reseller" : "client";

//     try {
//       const response = await clients({
//         action: "usertype",
//         client_id: userId,
//         user_type: newUserType,
//       });

//       if (response.data.data) {
//         setBroadcastData((prevData) =>
//           prevData.map((broadcast) =>
//             broadcast.id === userId
//               ? { ...broadcast, user_type: newUserType }
//               : broadcast
//           )
//         );
//         fetchBroadcasts();
//         toast.success(`User type changed to ${newUserType}`);
//       } else {
//         console.error("Failed to update user type");
//         toast.error("Failed to update user type");
//       }
//     } catch (error) {
//       console.error("Error updating user type:", error);
//       toast.error("Error updating user type");
//     }
//   };

//   const filteredAndSortedBroadcasts = useMemo(() => {
//     // console.log("broadcastData in useMemo:", broadcastData);

//     let filtered = broadcastData.filter((broadcast) =>
//       Object.values(broadcast).some(
//         (value) =>
//           value &&
//           value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );

//     if (filter === "newest") {
//       filtered = filtered.sort(
//         (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
//       );
//     } else {
//       filtered = filtered.sort(
//         (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
//       );
//     }

//     return filtered;
//   }, [broadcastData, searchTerm, filter]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleOpenUserProfile = () => {
//     setProfileModalOpen(true);
//   };

//   const handleLoginClick = (id) => {
//     console.log(`Logging in user: ${id}`);
//     LoginClick(id); // Pass the id here to LoginClick
//   };

//   // const handleStatusToggle = async (userId) => {
//   //     const updatedBroadcastData = broadcastData.map((broadcast) =>
//   //         broadcast.id === userId
//   //             ? {
//   //                   ...broadcast,
//   //                   status:
//   //                       broadcast.status === "enabled"
//   //                           ? "disabled"
//   //                           : "enabled",
//   //               }
//   //             : broadcast
//   //     );
//   //     setBroadcastData(updatedBroadcastData);

//   // };

//   const handleDownloadCSV = () => {
//     const headers = [
//       "Action",
//       "User Name",
//       "Email",
//       "User Type",
//       "Name",
//       "Mobile No.",
//       "Login",
//       "Status",
//       "Created Date",
//       "WhatsApp Credits",
//       "Promotional Credits",
//       "Transactional Credits",
//       "Voice Credits",
//       "Global Credits",
//       "GSM SMS",
//       "Business WhatsApp Credits",
//     ];
//     const csvContent = [
//       headers.join(","),
//       ...filteredAndSortedBroadcasts.map((broadcast) =>
//         [
//           "Settings, Transactions, Funds",
//           broadcast.username,
//           broadcast.email,
//           broadcast.usertype,
//           broadcast.name,
//           broadcast.mobile,
//           broadcast.login,
//           broadcast.status,
//           broadcast.createdDate,
//           broadcast.whatsappCredits,
//           broadcast.promotionalCredits,
//           broadcast.transactionalCredits,
//           broadcast.voiceCredits,
//           broadcast.globalCredits,
//           broadcast.gsmSMS,
//           broadcast.businessWhatsappCredits,
//         ].join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], {
//       type: "text/csv;charset=utf-8;",
//     });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", `broadcast_list_${Date.now()}.csv`);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="p-4 bg-white rounded-xl shadow-lg mb-12 mt-12"
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-black">User List</h1>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <input
//           type="text"
//           className="w-full p-2 border rounded"
//           placeholder="Search users"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="newest">Newest</option>
//           <option value="oldest">Oldest</option>
//         </select>
//         <button
//           className="w-full p-2 border rounded bg-blue-500 text-white"
//           onClick={handleDownloadCSV}
//         >
//           Download CSV
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center py-12">Loading data...</div>
//       ) : filteredAndSortedBroadcasts.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead className="bg-blue-500 text-white">
//               <tr>
//                 <th style={{ width: "200px" }} className="p-2 cursor-pointer">
//                   Action
//                 </th>
//                 {[
//                   "User Name",
//                   "Email",
//                   "User Type",
//                   "Name",
//                   "Mobile No.",
//                   "Login",
//                   "Status",
//                   "Created Date",
//                   "WhatsApp Credits",
//                   "Promotional Credits",
//                   "Transactional Credits",
//                   "Voice Credits",
//                   "Global Credits",
//                   "GSM SMS",
//                   "Business WhatsApp Credits",
//                 ].map((headCell) => (
//                   <th
//                     key={headCell}
//                     className="p-2 cursor-pointer"
//                     onClick={() => handleRequestSort(headCell.toLowerCase())}
//                   >
//                     {headCell}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               <AnimatePresence>
//                 {filteredAndSortedBroadcasts
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((broadcast) => (
//                     <motion.tr
//                       key={broadcast.id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="bg-gray-100 odd:bg-gray-200"
//                     >
//                       <td className="p-2" style={{ width: "200px" }}>
//                         <div className="flex flex-col">
//                           <button
//                             className="text-blue-500"
//                             onClick={() =>
//                               handleOpenUserProfileModal(
//                                 broadcast.first_name,
//                                 broadcast.last_name,
//                                 broadcast.client_mobile_no,
//                                 broadcast.client_email,
//                                 broadcast.user_type,
//                                 broadcast.client_username,
//                                 broadcast.country
//                               )
//                             }
//                           >
//                             ⚙️ Settings
//                           </button>

//                           <td className="p-2">
//                             <button
//                               onClick={() =>
//                                 handleOpenTransactionModal(
//                                   broadcast.client_username
//                                 )
//                               }
//                             >
//                               💳 Transactions
//                             </button>
//                           </td>

//                           <button
//                             onClick={() =>
//                               handleOpenFundsModal(broadcast.client_username)
//                             }
//                           >
//                             💼 Funds
//                           </button>
//                         </div>
//                       </td>
//                       <td className="p-2">{broadcast.username}</td>
//                       <td className="p-2">{broadcast.client_email}</td>

//                       <td className="p-2">
//                         <div>{broadcast.user_type}</div>{" "}
//                         <button
//                           className="mt-2 p-2 rounded bg-blue-500 text-white"
//                           onClick={() =>
//                             handleChangeUserType(
//                               broadcast.id,
//                               broadcast.user_type
//                             )
//                           }
//                         >
//                           Change User Type
//                         </button>
//                       </td>

//                       <td className="p-2">{broadcast.first_name}</td>
//                       <td className="p-2">{broadcast.client_mobile_no}</td>
//                       <td className="p-2">
//                         <button
//                           className="bg-blue-500 text-white p-2 rounded"
//                           onClick={() => handleLoginClick(broadcast.id)}
//                         >
//                           Login
//                         </button>
//                       </td>
//                       <td className="p-2">
//                         <button
//                           className={`p-2 rounded ${
//                             broadcast.status === "enabled"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           } text-white`}
//                           onClick={() =>
//                             handleStatusToggle(
//                               broadcastData.id,
//                               broadcastData.client_username
//                             )
//                           }
//                         >
//                           {broadcast.status === "enabled"
//                             ? "Enabled"
//                             : "Disabled"}
//                         </button>
//                       </td>
//                       <td className="p-2">{broadcast.created_at}</td>
//                       <td className="p-2">
//                         {broadcast.credit.whatsapp_credits}
//                       </td>
//                       <td className="p-2">{broadcast.promotionalCredits}</td>
//                       <td className="p-2">{broadcast.transactionalCredits}</td>
//                       <td className="p-2">{broadcast.credit.voice_credits}</td>
//                       <td className="p-2">{broadcast.globalCredits}</td>
//                       <td className="p-2">{broadcast.gsmSMS}</td>
//                       <td className="p-2">
//                         {broadcast.businessWhatsappCredits}
//                       </td>
//                     </motion.tr>
//                   ))}
//               </AnimatePresence>
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center py-12"
//         >
//           No users found.
//         </motion.div>
//       )}

//       <UserProfileModal
//         open={profileModalOpen}
//         handleClose={() => setProfileModalOpen(false)}
//         {...userProfileData} // Pass the stored user profile data as props
//       />

//       <UserTransactionModal
//         open={isTransactionModalOpen}
//         handleClose={() => setTransactionModalOpen(false)}
//         clientUsername={selectedUsername} // Pass the selected username from the state
//       />

//       {filteredAndSortedBroadcasts.length > 0 && (
//         <div className="flex justify-between items-center py-2">
//           <button
//             onClick={(e) => handleChangePage(e, Math.max(page - 1, 0))}
//             className="p-2 border rounded bg-gray-200"
//           >
//             Previous
//           </button>
//           <button
//             onClick={(e) => handleChangePage(e, page + 1)}
//             className="p-2 border rounded bg-gray-200"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {isFundsModalOpen && (
//         <Modal
//           isModalOpen={isFundsModalOpen}
//           closeModal={() => setFundsModalOpen(false)}
//         >
//           <FundsManagementModal
//             open={isFundsModalOpen}
//             handleClose={() => setFundsModalOpen(false)}
//             user={user}
//             clientUsername={selectedUsername} // Pass selected username here as well
//             services={[]}
//           />
//         </Modal>
//       )}

//       <ToastContainer position="top-right" autoClose={4000} />
//     </motion.div>
//   );
// };

// export default ClientsBoard;

// import React, { useState, useMemo, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import UserProfileModal from "./UserProfileModal";
// import UserTransactionModal from "./UserTransactionModal";
// import FundsManagementModal from "./FundsManagementModal";
// import { clients, impersonate } from "../../services/api";
// import Modal from "../Modal";
// import { useNavigate } from "react-router-dom";

// const ClientsBoard = ({ user }) => {

//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(0);
//   const [clientUsernames, setClientUsernames] = useState([]);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [orderBy, setOrderBy] = useState("createdDate");
//   const [order, setOrder] = useState("desc");
//   const [filter, setFilter] = useState("newest");
//   const [profileModalOpen, setProfileModalOpen] = useState(false);
//   const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
//   const [isFundsModalOpen, setFundsModalOpen] = useState(false);
//   const [broadcastData, setBroadcastData] = useState([]); // Store API data here
//   const [loading, setLoading] = useState(true); // Loading state
//   const [selectedUsername, setSelectedUsername] = useState(""); // For passing client_username
//   const [userProfileData, setUserProfileData] = useState({
//     firstName: "",
//     lastName: "",
//     clientMobileNo: "",
//     clientEmail: "",
//     user_type: "",
//     country: "",
//   });

//   const navigate = useNavigate();

//   const fetchBroadcasts = async () => {
//     try {
//       const response = await clients({
//         action: "read", // Payload to send
//         username: user, // Assuming username is 'user' as per your example
//       });

//       const broadcast = response.data.data;
//       console.log("broadcast", broadcast);

//       if (response.data && Array.isArray(response.data.data)) {
//         setBroadcastData(response.data.data); // Store the fetched data
//       } else {
//         toast.error("Failed to fetch broadcast data");
//       }
//     } catch (error) {
//       toast.error("Error fetching broadcast data");
//       console.error("API error:", error);
//     } finally {
//       setLoading(false);
//     }

//   };

//   // const LoginClick = async (id) => {
//   //   try {
//   //     const response = await impersonate({
//   //       user_id: id, // Ensure id is being passed here
//   //     });

//   //     if (response.status === 200) {
//   //       toast.success(`Login successful for user ${id}`);
//   //     } else {
//   //       toast.error("Failed to login");
//   //     }
//   //   } catch (error) {
//   //     toast.error("Error occurred while logging in");
//   //     console.error("API error:", error);
//   //   }
//   // };\\

//   const LoginClick = async (id) => {
//     try {
//       const adminToken = localStorage.getItem('authToken'); // Store admin token
//       const response = await impersonate({ user_id: id });

//       if (response.status === 200 && response.data.token) {
//         const newToken = response.data.token;
//         localStorage.setItem('adminToken', adminToken);
//         localStorage.setItem('authToken', newToken);

//         toast.success(`Login successful for user ${id}`);
//         console.log("Navigate call happening now!"); // Debugging log
//         navigate("/dashboard"); // Programmatically navigate to the dashboard
//       } else {
//         toast.error("Failed to login");
//       }
//     } catch (error) {
//       toast.error("Error occurred while logging in");
//       console.error("API error:", error);
//     }
//   };

//   const handleOpenTransactionModal = (username) => {
//     console.log("Opening transaction modal for client:", username); // Debugging to check correct username
//     setSelectedUsername(username); // Set the username to be sent to the modal
//     setTransactionModalOpen(true); // Open the transaction modal
//   };

//   const handleOpenFundsModal = (username) => {
//     console.log("Opening funds modal for client:", username); // Debugging to check correct username
//     setSelectedUsername(username); // Set the username to be sent to the funds modal
//     setFundsModalOpen(true); // Open the funds modal
//   };

//   const handleOpenUserProfileModal = (
//     firstName,
//     lastName,
//     clientMobileNo,
//     clientEmail,
//     user_type,
//     client_username,
//     country
//   ) => {
//     setUserProfileData({
//       firstName,
//       lastName,
//       clientMobileNo,
//       clientEmail,
//       user_type,
//       client_username,
//       country,
//     });
//     setProfileModalOpen(true);
//   };

//   const handleStatusToggle = async (userId, currentStatus, client_username) => {
//     console.log("broadcast data client", broadcastData);
//     console.log("clientusername", broadcastData?.client_username);
//     const newStatus = currentStatus === "enabled" ? "false" : "true"; // Toggle between true and false
//     try {
//       const response = await clients({
//         action: "changeStatus", // Your action here
//         c_username: client_username, // Pass client username
//         status: newStatus, // Send the new status value
//       });

//       if (response.data && response.data.success) {
//         // Update the local state to reflect the change

//         setBroadcastData((prevData) =>
//           prevData.map((broadcast) =>
//             broadcast.id === userId
//               ? {
//                   ...broadcast,
//                   status: newStatus === "true" ? "enabled" : "disabled",
//                 }
//               : broadcast
//           )
//         );
//         toast.success(
//           `Status changed to ${newStatus === "true" ? "enabled" : "disabled"}`
//         );
//       } else {
//         toast.error("Failed to change status");
//       }
//     } catch (error) {
//       toast.error("Error occurred while changing status");
//       console.error("API error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBroadcasts();
//   }, [user]);

//   const handleChangeUserType = async (userId, currentUserType) => {
//     const newUserType = currentUserType === "client" ? "reseller" : "client";

//     try {
//       const response = await clients({
//         action: "usertype",
//         client_id: userId,
//         user_type: newUserType,
//       });

//       if (response.data.data) {
//         setBroadcastData((prevData) =>
//           prevData.map((broadcast) =>
//             broadcast.id === userId
//               ? { ...broadcast, user_type: newUserType }
//               : broadcast
//           )
//         );
//         fetchBroadcasts();
//         toast.success(`User type changed to ${newUserType}`);
//       } else {
//         console.error("Failed to update user type");
//         toast.error("Failed to update user type");
//       }
//     } catch (error) {
//       console.error("Error updating user type:", error);
//       toast.error("Error updating user type");
//     }
//   };

//   const filteredAndSortedBroadcasts = useMemo(() => {
//     // console.log("broadcastData in useMemo:", broadcastData);

//     let filtered = broadcastData.filter((broadcast) =>
//       Object.values(broadcast).some(
//         (value) =>
//           value &&
//           value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );

//     if (filter === "newest") {
//       filtered = filtered.sort(
//         (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
//       );
//     } else {
//       filtered = filtered.sort(
//         (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
//       );
//     }

//     return filtered;
//   }, [broadcastData, searchTerm, filter]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleOpenUserProfile = () => {
//     setProfileModalOpen(true);
//   };

//   const handleLoginClick = (id) => {
//     console.log(`Logging in user: ${id}`);
//     LoginClick(id); // Pass the id here to LoginClick
//   };

//   // const handleStatusToggle = async (userId) => {
//   //     const updatedBroadcastData = broadcastData.map((broadcast) =>
//   //         broadcast.id === userId
//   //             ? {
//   //                   ...broadcast,
//   //                   status:
//   //                       broadcast.status === "enabled"
//   //                           ? "disabled"
//   //                           : "enabled",
//   //               }
//   //             : broadcast
//   //     );
//   //     setBroadcastData(updatedBroadcastData);

//   // };

//   const handleDownloadCSV = () => {
//     const headers = [
//       "Action",
//       "User Name",
//       "Email",
//       "User Type",
//       "Name",
//       "Mobile No.",
//       "Login",
//       "Status",
//       "Created Date",
//       "WhatsApp Credits",
//       "Promotional Credits",
//       "Transactional Credits",
//       "Voice Credits",
//       "Global Credits",
//       "GSM SMS",
//       "Business WhatsApp Credits",
//     ];
//     const csvContent = [
//       headers.join(","),
//       ...filteredAndSortedBroadcasts.map((broadcast) =>
//         [
//           "Settings, Transactions, Funds",
//           broadcast.username,
//           broadcast.email,
//           broadcast.usertype,
//           broadcast.name,
//           broadcast.mobile,
//           broadcast.login,
//           broadcast.status,
//           broadcast.createdDate,
//           broadcast.whatsappCredits,
//           broadcast.promotionalCredits,
//           broadcast.transactionalCredits,
//           broadcast.voiceCredits,
//           broadcast.globalCredits,
//           broadcast.gsmSMS,
//           broadcast.businessWhatsappCredits,
//         ].join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], {
//       type: "text/csv;charset=utf-8;",
//     });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", `broadcast_list_${Date.now()}.csv`);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="p-4 bg-white rounded-xl shadow-lg mb-12 mt-12"
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-black">User List</h1>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
//         <input
//           type="text"
//           className="w-full p-2 border rounded"
//           placeholder="Search users"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="newest">Newest</option>
//           <option value="oldest">Oldest</option>
//         </select>
//         <button
//           className="w-full p-2 border rounded bg-blue-500 text-white"
//           onClick={handleDownloadCSV}
//         >
//           Download CSV
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center py-12">Loading data...</div>
//       ) : filteredAndSortedBroadcasts.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead className="bg-blue-500 text-white">
//               <tr>
//                 <th style={{ width: "200px" }} className="p-2 cursor-pointer">
//                   Action
//                 </th>
//                 {[
//                   "User Name",
//                   "Email",
//                   "User Type",
//                   "Name",
//                   "Mobile No.",
//                   "Login",
//                   "Status",
//                   "Created Date",
//                   "WhatsApp Credits",
//                   "Promotional Credits",
//                   "Transactional Credits",
//                   "Voice Credits",
//                   "Global Credits",
//                   "GSM SMS",
//                   "Business WhatsApp Credits",
//                 ].map((headCell) => (
//                   <th
//                     key={headCell}
//                     className="p-2 cursor-pointer"
//                     onClick={() => handleRequestSort(headCell.toLowerCase())}
//                   >
//                     {headCell}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               <AnimatePresence>
//                 {filteredAndSortedBroadcasts
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((broadcast) => (
//                     <motion.tr
//                       key={broadcast.id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="bg-gray-100 odd:bg-gray-200"
//                     >
//                       <td className="p-2" style={{ width: "200px" }}>
//                         <div className="flex flex-col">
//                           <button
//                             className="text-blue-500"
//                             onClick={() =>
//                               handleOpenUserProfileModal(
//                                 broadcast.first_name,
//                                 broadcast.last_name,
//                                 broadcast.client_mobile_no,
//                                 broadcast.client_email,
//                                 broadcast.user_type,
//                                 broadcast.client_username,
//                                 broadcast.country
//                               )
//                             }
//                           >
//                             ⚙️ Settings
//                           </button>

//                           <td className="p-2">
//                             <button
//                               onClick={() =>
//                                 handleOpenTransactionModal(
//                                   broadcast.client_username
//                                 )
//                               }
//                             >
//                               💳 Transactions
//                             </button>
//                           </td>

//                           <button
//                             onClick={() =>
//                               handleOpenFundsModal(broadcast.client_username)
//                             }
//                           >
//                             💼 Funds
//                           </button>
//                         </div>
//                       </td>
//                       <td className="p-2">{broadcast.username}</td>
//                       <td className="p-2">{broadcast.client_email}</td>

//                       <td className="p-2">
//                         <div>{broadcast.user_type}</div>{" "}
//                         <button
//                           className="mt-2 p-2 rounded bg-blue-500 text-white"
//                           onClick={() =>
//                             handleChangeUserType(
//                               broadcast.id,
//                               broadcast.user_type
//                             )
//                           }
//                         >
//                           Change User Type
//                         </button>
//                       </td>

//                       <td className="p-2">{broadcast.first_name}</td>
//                       <td className="p-2">{broadcast.client_mobile_no}</td>
//                       <td className="p-2">
//                         <button
//                           className="bg-blue-500 text-white p-2 rounded"
//                           onClick={() => handleLoginClick(broadcast.id)}
//                         >
//                           Login
//                         </button>
//                       </td>
//                       <td className="p-2">
//                         <button
//                           className={`p-2 rounded ${
//                             broadcast.status === "enabled"
//                               ? "bg-green-500"
//                               : "bg-red-500"
//                           } text-white`}
//                           onClick={() =>
//                             handleStatusToggle(
//                               broadcastData.id,
//                               broadcastData.client_username
//                             )
//                           }
//                         >
//                           {broadcast.status === "enabled"
//                             ? "Enabled"
//                             : "Disabled"}
//                         </button>
//                       </td>
//                       <td className="p-2">{broadcast.created_at}</td>
//                       <td className="p-2">
//                         {broadcast.credit.whatsapp_credits}
//                       </td>
//                       <td className="p-2">{broadcast.promotionalCredits}</td>
//                       <td className="p-2">{broadcast.transactionalCredits}</td>
//                       <td className="p-2">{broadcast.credit.voice_credits}</td>
//                       <td className="p-2">{broadcast.globalCredits}</td>
//                       <td className="p-2">{broadcast.gsmSMS}</td>
//                       <td className="p-2">
//                         {broadcast.businessWhatsappCredits}
//                       </td>
//                     </motion.tr>
//                   ))}
//               </AnimatePresence>
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="text-center py-12"
//         >
//           No users found.
//         </motion.div>
//       )}

//       <UserProfileModal
//         open={profileModalOpen}
//         handleClose={() => setProfileModalOpen(false)}
//         {...userProfileData} // Pass the stored user profile data as props
//       />

//       <UserTransactionModal
//         open={isTransactionModalOpen}
//         handleClose={() => setTransactionModalOpen(false)}
//         clientUsername={selectedUsername} // Pass the selected username from the state
//       />

//       {filteredAndSortedBroadcasts.length > 0 && (
//         <div className="flex justify-between items-center py-2">
//           <button
//             onClick={(e) => handleChangePage(e, Math.max(page - 1, 0))}
//             className="p-2 border rounded bg-gray-200"
//           >
//             Previous
//           </button>
//           <button
//             onClick={(e) => handleChangePage(e, page + 1)}
//             className="p-2 border rounded bg-gray-200"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {isFundsModalOpen && (
//         <Modal
//           isModalOpen={isFundsModalOpen}
//           closeModal={() => setFundsModalOpen(false)}
//         >
//           <FundsManagementModal
//             open={isFundsModalOpen}
//             handleClose={() => setFundsModalOpen(false)}
//             user={user}
//             clientUsername={selectedUsername} // Pass selected username here as well
//             services={[]}
//           />
//         </Modal>
//       )}

//       <ToastContainer position="top-right" autoClose={4000} />
//     </motion.div>
//   );
// };

// export default ClientsBoard;

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfileModal from "./UserProfileModal";
import UserTransactionModal from "./UserTransactionModal";
import FundsManagementModal from "./FundsManagementModal";
import { clients, impersonate } from "../../services/api";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const ClientsBoard = ({
  user,
  setUser,
  broadcastData,
  setBroadcastData,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("createdDate");
  const [order, setOrder] = useState("desc");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isFundsModalOpen, setFundsModalOpen] = useState(false);


  // Loading state
  const [selectedUsername, setSelectedUsername] = useState(""); // For passing client_username
  const [userProfileData, setUserProfileData] = useState({
    firstName: "",
    lastName: "",
    clientMobileNo: "",
    clientEmail: "",
    user_type: "",
    country: "",
  });

  
  const fetchBroadcasts = async () => {
            try {
                const response = await clients({
                    action: "read", // Payload to send
                    username: user, // Assuming username is 'user' as per your example
                });
    
       
    
                if (response.data && Array.isArray(response.data.data)) {
                    setBroadcastData(response.data.data); // Store the fetched data
                } else {
                    toast.error("Failed to fetch broadcast data");
                }
            } catch (error) {
                toast.error("Error fetching broadcast data");
                toast.error("API error:", error);
            } finally {
                setLoading(false);
            }
        };

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  
  const LoginClick = async (id) => {
    try {
      const adminToken = localStorage.getItem("authToken"); // Store the current admin token
      console.log("Attempting to impersonate user with ID:", id); // Debug log

      const response = await impersonate({ user_id: id });
      console.log("Full API response:", response); // Log the full API response

      // Access token and impersonated user directly under response.data
      const token = response.data.token; // Directly access token
      const impersonatedUser = response.data.imoersonated_user; // Directly access impersonated user

      if (token && impersonatedUser) {
        // Store the admin token temporarily and set the new impersonation token
        localStorage.setItem("adminToken", adminToken); // Save the admin token
        localStorage.setItem("authToken", token); // Save the impersonation token

        // Update the user state with the impersonated user's details
        setUser(impersonatedUser); // Ensure setUser is properly defined

        // Display a success message
        toast.success(
          `Login successful for user ${impersonatedUser.firstname} ${impersonatedUser.lastname}`
        );

        // Navigate to the dashboard
        navigate("/dashboard");
      } else {
        console.error("Token or user data missing in response:", response.data); // Log if data is missing
        toast.error("Failed to login. User details not found in response.");
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error); // Log the error
      toast.error("Error occurred while logging in");
    }
  };

  const handleOpenTransactionModal = (username) => {
    console.log("Opening transaction modal for client:", username); // Debugging to check correct username
    setSelectedUsername(username); // Set the username to be sent to the modal
    setTransactionModalOpen(true); // Open the transaction modal
  };

  const handleOpenFundsModal = (username) => {
    console.log("Opening funds modal for client:", username); // Debugging to check correct username
    setSelectedUsername(username); // Set the username to be sent to the funds modal
    setFundsModalOpen(true); // Open the funds modal
  };

  const handleOpenUserProfileModal = (
    firstName,
    lastName,
    clientMobileNo,
    clientEmail,
    user_type,
    client_username,
    country,
    id
  ) => {
    setUserProfileData({
      firstName,
      lastName,
      clientMobileNo,
      clientEmail,
      user_type,
      client_username,
      country,
      id,
    });
    setProfileModalOpen(true);
  };

  console.log("setBroadcastData in ClientsBoard:", setBroadcastData);

  // const handleStatusToggle = async (userId, currentStatus, client_username) => {
  //   // Calculate the new status
  //   const newStatus =
  //     currentStatus === "true" || currentStatus === true ? "false" : "true";

  //   try {
  //     // Optimistically update the state first
  //     setBroadcastData((prevData) =>
  //       prevData.map((broadcast) =>
  //         broadcast.id === userId
  //           ? { ...broadcast, status: newStatus } // Immediately toggle the status
  //           : broadcast
  //       )
  //     );

  //     // Send API request to change status
  //     const response = await clients({
  //       action: "changeStatus",
  //       c_username: client_username,
  //       status: newStatus,
  //     });

  //     // Check API response for success
  //     if (response.data && response.data.status === 1) {
  //       // Success: Toast message based on new status
  //       const statusMessage = newStatus === "true" ? "Enabled" : "Disabled";
  //       toast.success(`Status changed to ${statusMessage}`);
  //     } else {
  //       // If API fails, revert the status back and show error toast
  //       setBroadcastData((prevData) =>
  //         prevData.map((broadcast) =>
  //           broadcast.id === userId
  //             ? { ...broadcast, status: currentStatus } // Revert to the original status
  //             : broadcast
  //         )
  //       );
  //       toast.error("Failed to change status");
  //     }
  //   } catch (error) {
  //     // Handle API or network errors, revert the state, and show error toast
  //     setBroadcastData((prevData) =>
  //       prevData.map((broadcast) =>
  //         broadcast.id === userId
  //           ? { ...broadcast, status: currentStatus } // Revert to the original status
  //           : broadcast
  //       )
  //     );
  //     console.error("Error:", error);
  //     toast.error("Error occurred while changing status");
  //   }
  // };


  const handleStatusToggle = async (userId, currentStatus, client_username) => {
    const newStatus = currentStatus === "true" ? "false" : "true"; // Toggle logic
  
    // Show a toast message for the status change
    toast.info(`Updating status to ${newStatus === "true" ? "Enabled" : "Disabled"}...`);
  
    try {
      // Send the API request to change status
      const response = await clients({
        action: "changeStatus",
        c_username: client_username,
        status: newStatus,
      });
  
      if (response?.data?.status === 1) {
        toast.success(`Status updated to ${newStatus === "true" ? "Enabled" : "Disabled"}`);
  
        // Update the specific broadcast's status in the state
        setBroadcastData((prevData) =>
          prevData.map((broadcast) =>
            broadcast.id === userId
              ? { ...broadcast, status: newStatus } // Update the status locally
              : broadcast
          )
        );
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error while updating status:", error);
      toast.error("An error occurred while updating status.");
    }
  };
  

  const handleChangeUserType = async (userId, currentUserType) => {
    const newUserType = currentUserType === "client" ? "reseller" : "client";

    try {
      const response = await clients({
        action: "usertype",
        client_id: userId,
        user_type: newUserType,
      });

      console.log("API Response:", response);

      if (response.data.data && response.data.status === 1) {
        setBroadcastData((prevData) =>
          prevData.map((broadcast) =>
            broadcast.id === userId
              ? { ...broadcast, user_type: newUserType }
              : broadcast
          )
        );

        toast.success(`User type changed to ${newUserType}`);
      } else {
        console.error("Unexpected response format:", response.data);
        toast.error("Failed to update user type");
      }
    } catch (error) {
      console.error("Error occurred during user type update:", error);
      toast.error("Error updating user type");
    }
  };


  const filteredAndSortedBroadcasts = useMemo(() => {
    // Ensure broadcastData is an array
    if (!Array.isArray(broadcastData)) {
      return [];
    }

    // Filter broadcasts based on the searchTerm
    const filtered = broadcastData.filter((broadcast) =>
      Object.values(broadcast).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Sort broadcasts by `createdDate` (newest first)
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);
      return dateB - dateA; // Newest first
    });

    // Reverse the sorted array
    return sorted.reverse();
  }, [broadcastData, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleOpenUserProfile = () => {
    setProfileModalOpen(true);
  };

  const handleLoginClick = (id) => {
    console.log(`Logging in user: ${id}`);
    LoginClick(id); // Pass the id here to LoginClick
  };

  // const handleDownloadCSV = () => {
  //   const headers = [
    
  //     "User Name",
  //     "Email",
  //     "User Type",
  //     "Name",
  //     "Mobile No.",
  //     "Status",
  //     "Created Date",
  //     "WhatsApp Credits",
  //     "Voice Credits",
  //     "GSM SMS",
  //   ];
  //   const csvContent = [
  //     headers.join(","),
  //     ...filteredAndSortedBroadcasts.map((broadcast) =>
  //       [
  //         "Settings, Transactions, Funds",
  //        broadcast.client_username,
  //        broadcast.client_email,
  //        broadcast.user_type,
  //        broadcast.client_mobile_no,
  //        broadcast.status,
  //        broadcast.created_at,
  //        broadcast.whatsapp_credits,
  //        broadcast.voice_credits,
  //        broadcast.sms_credits,
  //        broadcast.rcs_credits,
  //        broadcast.ai_video_credits,
  //        broadcast.email_credits
  //       ].join(",")
  //     ),
  //   ].join("\n");

  //   const blob = new Blob([csvContent], {
  //     type: "text/csv;charset=utf-8;",
  //   });
  //   const link = document.createElement("a");
  //   if (link.download !== undefined) {
  //     const url = URL.createObjectURL(blob);
  //     link.setAttribute("href", url);
  //     link.setAttribute("download", `broadcast_list_${Date.now()}.csv`);
  //     link.style.visibility = "hidden";
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };


  const handleDownloadCSV = () => {
    if (!broadcastData || broadcastData.length === 0) {
      toast.error("No data available to download.");
      return;
    }
  
    const headers = [
      "User Name",
      "Email",
      "User Type",
      "Name",
      "Mobile No.",
      "Status",
      "Created Date",
      "WhatsApp Credits",
      "Voice Credits",
      "GSM SMS",
      "RCS Credits",
      "Email Credits",
      "AI Video Credits"
    ];
  
    const csvContent = [
      headers.join(","), // Add headers as the first row
      ...broadcastData.map((broadcast) =>
        [
          broadcast.client_username || "",
          broadcast.client_email || "",
          broadcast.user_type || "",
          broadcast.first_name || "",
          broadcast.client_mobile_no || "",
          broadcast.status === "true" ? "Enabled" : "Disabled", // Map true/false to Enabled/Disabled
          formatDate(broadcast.created_at) || "",
          broadcast.credit?.whatsapp_credits || 0, // Use optional chaining for nested data
          broadcast.credit?.voice_credits || 0,
          broadcast.credit?.gsm_sms || 0,
          broadcast.credit?.rcs_credits || 0,
          broadcast.credit?.email_credits || 0,
          broadcast.credit?.ai_video_credits || 0,
        ].join(",") // Convert each broadcast's data to a CSV row
      ),
    ].join("\n"); // Join all rows with newline characters
  
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `broadcast_list_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-white rounded-xl shadow-lg mb-12 mt-12"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <h1 className="text-2xl font-bold text-black">User List</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select> */}
        <button
          className="w-full p-2 border rounded bg-blue-500 text-white"
          onClick={handleDownloadCSV}
        >
          Download CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading data...</div>
      ) : filteredAndSortedBroadcasts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th style={{ width: "200px" }} className="p-2 cursor-pointer">
                  Action
                </th>
                {[
                  "User Name",
                  "Email",
                  "User Type",
                  "Name",
                  "Mobile No.",
                  "Login",
                  "Status",
                  "Created Date",
                  "WhatsApp Credits",
                  "RCS Credits",
                  "Transactional Credits",
                  "Voice Credits",
                  "Global Credits",
                  "GSM SMS",
                  "Business WhatsApp Credits",
                ].map((headCell) => (
                  <th
                    key={headCell}
                    className="p-2 cursor-pointer"
                    onClick={() => handleRequestSort(headCell.toLowerCase())}
                  >
                    {headCell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAndSortedBroadcasts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((broadcast) => (
                    <motion.tr
                      key={broadcast.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-100 odd:bg-gray-200"
                    >
                      <td className="p-2" style={{ width: "200px" }}>
                        <div className="flex flex-col">
                          <button
                            className="text-blue-500"
                            onClick={() =>
                              handleOpenUserProfileModal(
                                broadcast.first_name,
                                broadcast.last_name,
                                broadcast.client_mobile_no,
                                broadcast.client_email,
                                broadcast.user_type,
                                broadcast.client_username,
                                broadcast.country,
                                broadcast.id
                              )
                            }
                          >
                            ⚙️ Settings
                          </button>

                          <td className="p-2">
                            <button
                              onClick={() =>
                                handleOpenTransactionModal(
                                  broadcast.client_username
                                )
                              }
                            >
                              💳 Transactions
                            </button>
                          </td>

                          <button
                            onClick={() =>
                              handleOpenFundsModal(broadcast.client_username)
                            }
                          >
                            💼 Funds
                          </button>
                        </div>
                      </td>
                      <td className="p-2">{broadcast.client_username}</td>
                      <td className="p-2">{broadcast.client_email}</td>

                      <td className="p-2">
                        <div>{broadcast.user_type}</div>{" "}
                        <button
                          className="mt-2 p-2 rounded bg-blue-500 text-white"
                          onClick={() =>
                            handleChangeUserType(
                              broadcast.id,
                              broadcast.user_type
                            )
                          }
                        >
                          Change User Type
                        </button>
                      </td>

                      <td className="p-2">{broadcast.first_name}</td>
                      <td className="p-2">{broadcast.client_mobile_no}</td>
                      <td className="p-2">
                        <button
                          className="bg-blue-500 text-white p-2 rounded"
                          onClick={() => handleLoginClick(broadcast.id)}
                        >
                          Login
                        </button>
                      </td>

                      <td className style={{ width: "200px" }}>
                        <button
                          className={`p-2 rounded ${
                            broadcast.status === "true"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } text-white`}
                          onClick={() =>
                            handleStatusToggle(
                              broadcast.id,
                              broadcast.status,
                              broadcast.client_username
                            )
                          }
                          
                        >
                          {broadcast.status === "true" ? "Enabled" : "Disabled"}
                          
                        </button>
                      </td>
                      <td className="p-2">
                        {formatDate(broadcast.created_at)}
                      </td>

                      <td className="p-2">
                        {broadcast.credit.whatsapp_credits}
                      </td>
                      <td className="p-2">{broadcast.promotionalCredits}</td>
                      <td className="p-2">{broadcast.transactionalCredits}</td>
                      <td className="p-2">{broadcast.credit.voice_credits}</td>
                      <td className="p-2">{broadcast.globalCredits}</td>
                      <td className="p-2">{broadcast.gsmSMS}</td>
                      <td className="p-2">
                        {broadcast.businessWhatsappCredits}
                      </td>
                    </motion.tr>
                  ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          No users found.
        </motion.div>
      )}

      <UserProfileModal
        open={profileModalOpen}
        handleClose={() => setProfileModalOpen(false)}
        {...userProfileData} // Pass the stored user profile data as props
      />

      <UserTransactionModal
        open={isTransactionModalOpen}
        handleClose={() => setTransactionModalOpen(false)}
        clientUsername={selectedUsername} // Pass the selected username from the state
      />

      {filteredAndSortedBroadcasts.length > 0 && (
        <div className="flex justify-between items-center py-2">
          <button
            onClick={(e) => handleChangePage(e, Math.max(page - 1, 0))}
            className="p-2 border rounded bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={(e) => handleChangePage(e, page + 1)}
            className="p-2 border rounded bg-gray-200"
          >
            Next
          </button>
        </div>
      )}

      {isFundsModalOpen && (
        <Modal
          isModalOpen={isFundsModalOpen}
          closeModal={() => setFundsModalOpen(false)}
        >
          <FundsManagementModal
            open={isFundsModalOpen}
            handleClose={() => setFundsModalOpen(false)}
            user={user}
            clientUsername={selectedUsername} // Pass selected username here as well
            services={[]}
          />
        </Modal>
      )}

      <ToastContainer position="top-right" autoClose={4000} />
    </motion.div>
  );
};

export default ClientsBoard;
