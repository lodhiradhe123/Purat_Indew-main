// import React from 'react';
// import Modal from "../Modal/index";
// import PropTypes from 'prop-types';
// import { works } from "../../services/api";
// import  { useEffect, useState } from "react";

// const UserProfileModal = ({ open, handleClose, client_username, firstName, lastName, clientMobileNo, clientEmail, user_type, country }) => {

// const [services, setServices] = useState([]);
// const [sendservices, setsendServices] = useState([]);

//   useEffect(() => {
//         const fetchServices = async () => {
//           try {
//           const response = await works({
//           action: "readAllService",
//           });
//           setServices(response.data.columns || []);
//           }
//           catch (error) {
//           toast.error("failed to fetch services", error);
//           }
//         };

//         if (open) {
//           fetchServices();
//         }
//   }, [open]);

//   const Payload = {
//     client_username = clientUsername;
//     action = UpdateServiceColumns;

//   };

//   try {
//     const response = await works(payload);
//   }

//   if(!open) return null;

//   return (
//     <Modal isModalOpen={open} closeModal={handleClose}>

//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">User Profile</h2>
//         </div>

//         {/* Main content */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Left Column */}
//           <div>
//             {/* Profile Image */}
//             <div className="border mb-4">
//               <div className="w-full h-64 flex items-center justify-center bg-gray-200">
//                 No Image Available
//               </div>
//             </div>

//             {/* User Info */}
//             <div className="border p-4 mb-4">
//               <p><strong>#ID:</strong></p>
//               <p><strong>Login:</strong></p>
//               <p><strong>Password:</strong> **********</p>
//               <button className="bg-red-500 text-white py-2 px-4 rounded">
//                 Change Password
//               </button>
//             </div>

//             {/* Quick Info */}
//             <div className="border p-4">
//               <h4 className="font-bold mb-2">Quick Info</h4>
//               <p><strong>Last Visit:</strong></p>
//               <p><strong>Registration:</strong></p>
//               <p><strong>Last IP Address:</strong></p>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div>
//             {/* Profile Settings */}
//             <div className="border p-4 mb-4">
//               <h4 className="font-bold mb-2">Profile</h4>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label>First Name</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={firstName || ''}
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Last Name</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={lastName || ''}
//                     readOnly
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <label>Location</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={country || ''}
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>User Type</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={user_type || ''}
//                     readOnly
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <label>Email ID</label>
//                   <input
//                     type="email"
//                     className="border p-2 w-full"
//                     value={clientEmail || ''}
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Phone</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={clientMobileNo || ''}
//                     readOnly
//                   />
//                 </div>
//               </div>
//               <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
//                 Save
//               </button>
//             </div>

//             {/* Settings */}
//             <div className="border p-4">
//               <h4 className="font-bold mb-2">Settings</h4>
//               <p>Active/Deactivate Services</p>
//               <div className="flex flex-col space-y-2">
//                 {services.length > 0 ? (
//                   services.map((service, idx) => (
//                     <label key={idx}>
//                       <input type="checkbox" /> {service}
//                     </label>
//                   ))

//                 ) : (
//                   <p>No services available</p>
//                 )}

//               </div>
//               <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end mt-4">
//           <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={handleClose}>
//             Close
//           </button>
//         </div>

//     </Modal>
//   );
// };

// UserProfileModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   firstName: PropTypes.string,
//   lastName: PropTypes.string,
//   clientMobileNo: PropTypes.string,
//   clientEmail: PropTypes.string,
//   user_type: PropTypes.string,
//   country: PropTypes.string,
// };

// export default UserProfileModal;

// import React, { useEffect, useState } from 'react';
// import Modal from "../Modal/index";
// import PropTypes from 'prop-types';
// import { works } from "../../services/api"; // Import the API function

// const UserProfileModal = ({ open, handleClose, firstName, lastName, clientMobileNo, clientEmail, user_type, country }) => {
//   const [services, setServices] = useState([]); // State to store services

//   // Fetch services when modal opens
//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await works({
//           action: "readAllService", // Action to fetch services from backend
//         });
//         setServices(response.data.services || []); // Update the state with services
//       } catch (error) {
//         console.error("Failed to fetch services", error);
//       }
//     };

//     if (open) {
//       fetchServices(); // Only fetch services if the modal is open
//     }
//   }, [open]);

//   if (!open) return null;

//   return (
//     <Modal isModalOpen={open} closeModal={handleClose}>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">User Profile</h2>
//       </div>

//       {/* Main content */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Left Column */}
//         <div>
//           {/* Profile Image */}
//           <div className="border mb-4">
//             <div className="w-full h-64 flex items-center justify-center bg-gray-200">
//               No Image Available
//             </div>
//           </div>

//           {/* User Info */}
//           <div className="border p-4 mb-4">
//             <p><strong>#ID:</strong></p>
//             <p><strong>Login:</strong></p>
//             <p><strong>Password:</strong> **********</p>
//             <button className="bg-red-500 text-white py-2 px-4 rounded">
//               Change Password
//             </button>
//           </div>

//           {/* Quick Info */}
//           <div className="border p-4">
//             <h4 className="font-bold mb-2">Quick Info</h4>
//             <p><strong>Last Visit:</strong></p>
//             <p><strong>Registration:</strong></p>
//             <p><strong>Last IP Address:</strong></p>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div>
//           {/* Profile Settings */}
//           <div className="border p-4 mb-4">
//             <h4 className="font-bold mb-2">Profile</h4>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label>First Name</label>
//                 <input
//                   type="text"
//                   className="border p-2 w-full"
//                   value={firstName || ''}
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label>Last Name</label>
//                 <input
//                   type="text"
//                   className="border p-2 w-full"
//                   value={lastName || ''}
//                   readOnly
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div>
//                 <label>Location</label>
//                 <input
//                   type="text"
//                   className="border p-2 w-full"
//                   value={country || ''}
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label>User Type</label>
//                 <input
//                   type="text"
//                   className="border p-2 w-full"
//                   value={user_type || ''}
//                   readOnly
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <div>
//                 <label>Email ID</label>
//                 <input
//                   type="email"
//                   className="border p-2 w-full"
//                   value={clientEmail || ''}
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label>Phone</label>
//                 <input
//                   type="text"
//                   className="border p-2 w-full"
//                   value={clientMobileNo || ''}
//                   readOnly
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Settings */}
//           <div className="border p-4">
//             <h4 className="font-bold mb-2">Settings</h4>
//             <p>Active/Deactivate Services</p>
//             <div className="flex flex-col space-y-2">
//               {/* Dynamically Render Services */}
//               {services.length > 0 ? (
//                 services.map((service, idx) => (
//                   <label key={idx}>
//                     <input type="checkbox" /> {service.name}
//                   </label>
//                 ))
//               ) : (
//                 <p>No services available</p>
//               )}
//             </div>
//             <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
//               Save
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-end mt-4">
//         <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={handleClose}>
//           Close
//         </button>
//       </div>
//     </Modal>
//   );
// };

// UserProfileModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   firstName: PropTypes.string,
//   lastName: PropTypes.string,
//   clientMobileNo: PropTypes.string,
//   clientEmail: PropTypes.string,
//   user_type: PropTypes.string,
//   country: PropTypes.string,
// };

// export default UserProfileModal;

// import React, { useState, useEffect } from "react";
// import Modal from "../Modal/index";
// import PropTypes from "prop-types";
// import { works, profile } from "../../services/api";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";

// const UserProfileModal = ({
//   open,
//   handleClose,
//   client_username,
//   firstName,
//   lastName,
//   clientMobileNo,
//   clientEmail,
//   user_type,
//   country,
// }) => {
//   const [services, setServices] = useState([]);
//   const [sendServices, setSendServices] = useState({});
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//   const [password, setPassword] = useState(""); // Password state
//   const [passwordConfirmation, setPasswordConfirmation] = useState("");

//   const handlePasswordUpdate = async () => {
//     // Validation for empty fields and matching passwords
//     if (!password || !passwordConfirmation) {
//       toast.error("Both fields are required.");
//       return;
//     }

//     if (password !== passwordConfirmation) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     const payload = {
//       action: "update",
//       username: client_username, // Include the username in the payload
//       password: password,
//       password_confirmation: passwordConfirmation,
//     };

//     try {
//       const response = await profile(payload);

//       if (response?.data?.status === 1) {
//         toast.success("Password updated successfully.");
//         setIsPasswordModalOpen(false); // Close the password modal
//       } else {
//         toast.error("Failed to update password. Please try again.");
//       }
//     } catch (error) {
//       toast.error("An error occurred while updating the password.");
//     }
//   };

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await works({
//           action: "readAllService",
//         });
//         setServices(response.data.columns || []); // Fetch available services from columns
//       } catch (error) {
//         toast.error("Failed to fetch services", error);
//       }
//     };

//     if (open) {
//       fetchServices(); // Fetch services when modal is opened
//     }
//   }, [open]);

//   // Handle checkbox changes
//   const handleServiceChange = (service) => {
//     setSendServices((prev) => {
//       const isSelected = !prev[service]; // Toggle between 1 (checked) and 0 (unchecked)

//       // Show toast message for selection or deselection
//       if (isSelected) {
//         toast.success(`${service} has been selected.`);
//       } else {
//         toast.info(`${service} has been deselected.`);
//       }

//       return {
//         ...prev,
//         [service]: isSelected ? 1 : 0,
//       };
//     });
//   };

//   // Handle form submit
//   const handleSave = async () => {
//     const payload = {
//       username: client_username, // Only the client username (as per your requirement)
//       action: "updateServiceColumns", // Your action
//       ...sendServices,
//     };

//     //   try {
//     //     const response = await works(payload);
//     //     console.log("Services updated successfully", response);
//     //     handleClose(); // Close the modal after saving
//     //   } catch (error) {
//     //   toast.error("Failed to update services", error);
//     //   }
//     // };

//     try {
//       const response = await works(payload);

//       if (response && response.data && response.data.status === 1) {
//         toast.success("Services updated successfully!");
//       } else {
//         toast.error("Failed to update services. Please try again.");
//       }

//       handleClose(); // Close the modal after saving
//     } catch (error) {
//       toast.error("Failed to update services. Something went wrong.");
//     }
//   };

//   if (!open) return null;

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />

//       <Modal isModalOpen={open} closeModal={handleClose}>
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">User Profile</h2>
//         </div>

//         {/* Main content */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Left Column */}
//           <div>
//             {/* Profile Image */}
//             <div className="border mb-4">
//               <div className="w-full h-64 flex items-center justify-center bg-gray-200">
//                 No Image Available
//               </div>
//             </div>

//             <div className="border p-4 mb-4">
//               <button
//                 className="bg-red-500 text-white py-2 px-4 rounded"
//                 onClick={() => setIsPasswordModalOpen(true)} // Open Password Modal
//               >
//                 Change Password
//               </button>
//             </div>

//             {/* Quick Info */}
//             <div className="border p-4">
//               <h4 className="font-bold mb-2">Quick Info</h4>
//               <p>
//                 <strong>Last Visit:</strong>
//               </p>
//               <p>
//                 <strong>Registration:</strong>
//               </p>
//               <p>
//                 <strong>Last IP Address:</strong>
//               </p>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div>
//             {/* Profile Settings */}
//             <div className="border p-4 mb-4">
//               <h4 className="font-bold mb-2">Profile</h4>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label>First Name</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={firstName || ""}
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Last Name</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={lastName || ""}
//                     readOnly
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <label>Location</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={country || ""}
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>User Type</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={user_type || ""}
//                     readOnly
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <label>Email ID</label>
//                   <input
//                     type="email"
//                     className="border p-2 w-full"
//                     value={clientEmail || ""}
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Phone</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={clientMobileNo || ""}
//                     readOnly
//                   />
//                 </div>
//               </div>
//               <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
//                 Save
//               </button>
//             </div>

//             {/* Settings */}
//             <div className="border p-4">
//               <h4 className="font-bold mb-2">Settings</h4>
//               <p>Active/Deactivate Services</p>
//               <div className="flex flex-col space-y-2">
//                 {services.length > 0 ? (
//                   services.map((service, idx) => (
//                     <label key={idx}>
//                       <input
//                         type="checkbox"
//                         checked={sendServices[service] === 1} // Check if service is active
//                         onChange={() => handleServiceChange(service)} // Toggle the service
//                       />{" "}
//                       {service}
//                     </label>
//                   ))
//                 ) : (
//                   <p>No services available</p>
//                 )}
//               </div>
//               <button
//                 className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
//                 onClick={handleSave} // Only send username and action
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end mt-4">
//           <button
//             className="bg-gray-500 text-white py-2 px-4 rounded"
//             onClick={handleClose}
//           >
//             Close
//           </button>
//         </div>
//       </Modal>

//       {isPasswordModalOpen && (
//         <Modal isModalOpen={isPasswordModalOpen} closeModal={() => setIsPasswordModalOpen(false)}>
//           <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Change Password</h2>
//             <div className="mb-4">
//               <label className="block text-lg mb-2">New Password</label>
//               <input
//                 type="password"
//                 className="border p-2 w-full"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-lg mb-2">Confirm Password</label>
//               <input
//                 type="password"
//                 className="border p-2 w-full"
//                 value={passwordConfirmation}
//                 onChange={(e) => setPasswordConfirmation(e.target.value)}
//               />
//             </div>
//             <div className="flex justify-end">
//               <button className="bg-blue-500 text-white py-2 px-4 rounded mr-2" onClick={handlePasswordUpdate}>
//                 Save
//               </button>
//               <button
//                 className="bg-gray-500 text-white py-2 px-4 rounded"
//                 onClick={() => setIsPasswordModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </>
//   );
// };

// UserProfileModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   firstName: PropTypes.string,
//   lastName: PropTypes.string,
//   clientMobileNo: PropTypes.string,
//   clientEmail: PropTypes.string,
//   user_type: PropTypes.string,
//   country: PropTypes.string,
//   client_username: PropTypes.string.isRequired, // Pass client_username for service update
// };

// export default UserProfileModal;

import React, { useState, useEffect } from "react";
import Modal from "../Modal/index";
import PropTypes from "prop-types";
import { works, profile, clients } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserProfileModal = ({
  open,
  handleClose,
  client_username,
  firstName: initialFirstName,
  lastName: initialLastName,
  clientEmail: initialClientEmail,
  clientMobileNo,
  user_type,
  country,
  id,
}) => {
  const [firstName, setFirstName] = useState(initialFirstName || "");
  const [lastName, setLastName] = useState(initialLastName || "");
  const [email, setEmail] = useState(initialClientEmail || "");
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false); // For profile save
  const [loadingServices, setLoadingServices] = useState(false);
  const [services, setServices] = useState([]);
  const [sendServices, setSendServices] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [quickInfoList, setQuickInfoList] = useState([]);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [quickInfo, setQuickInfo] = useState({
    lastVisit: "Loading...",
    registration: "Loading...",
    lastIpAddress: "Loading...",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle null or undefined values
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A"; // Handle invalid date strings
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };
  
  useEffect(() => {
    if (open) {
      fetchQuickInfo(); // Fetch quick info when the modal is opened
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setFirstName(initialFirstName || "");
      setLastName(initialLastName || "");
      setEmail(initialClientEmail || "");
      fetchQuickInfo();
    }
  }, [open, initialFirstName, initialLastName, initialClientEmail]);

  useEffect(() => {
    if (id) {
      // Use the id (client_id) to fetch data or perform actions
      console.log("Client ID:", id);
    }
  }, [id]);

  const fetchQuickInfo = async () => {
    try {
      const payload = {
        action: "readSpecific",
        client_id: id, // Pass the client_id from props
      };

      const response = await clients(payload);

      if (response?.data?.status === 1) {
        const data = response.data.data; // Extract the data
        console.log("Quick Info Data:", data);

        // Update the quickInfo state
        setQuickInfo({
          lastVisit: data.verify_loggedin_users?.last_login_at || "N/A",
          registration: data.created_at || "N/A",
          lastIpAddress: data.verify_loggedin_users?.ip_address || "N/A",
        });
      } else {
        console.error("Error fetching quick info:", response?.data?.message);
        toast.error("Failed to fetch quick info");
      }
    } catch (error) {
      console.error("Error fetching quick info:", error);
      toast.error("Error fetching quick info");
    }
  };

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleSaveProfile = async () => {
    if (
      firstName === initialFirstName &&
      lastName === initialLastName &&
      email === initialClientEmail
    ) {
      toast.info("No changes to save.");
      return;
    }

    setLoadingProfile(true);
    const payload = {
      action: "update",
      username: client_username,
      firstName,
      lastName,
      email,
    };
    try {
      const response = await profile(payload);
      if (response?.data?.status === 1) {
        toast.success("Profile updated successfully!");
        handleClose();
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!password || !passwordConfirmation) {
      toast.error("Both fields are required.");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const payload = {
      action: "update",
      username: client_username,
      password,
      password_confirmation: passwordConfirmation,
    };

    try {
      const response = await profile(payload);
      if (response?.data?.status === 1) {
        toast.success("Password updated successfully.");
        setIsPasswordModalOpen(false);
      } else {
        toast.error(response?.data?.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the password.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await works({ action: "readAllService" });
        const fetchedServices = response?.data?.columns || [];
        console.log("Fetched Services:", fetchedServices);
        setServices(fetchedServices);

        // const initialSendServices = {};
        // fetchedServices.forEach((service) => {
        //   initialSendServices[service] = 0; // Default state, update as per API response
        // });
        // setSendServices(initialSendServices);
      } catch (error) {
        toast.error("Failed to fetch services.");
      }
    };

    if (open) {
      fetchServices();
    }
  }, [open]);

  useEffect(() => {
    if (services.length > 0) {
      const initialSendServices = {};
      services.forEach((service) => {
        initialSendServices[service] = 0; // Default state
      });
      setSendServices(initialSendServices);
    }
  }, [services]);
  

  const handleServiceChange = (service) => {
    setSendServices((prev) => {
      const isSelected = !prev[service];

      if (isSelected) {
        toast.success(`${service} has been selected.`);
      } else {
        toast.info(`${service} has been deselected.`);
      }

      return {
        ...prev,
        [service]: isSelected ? 1 : 0,
      };
    });
  };

  const handleSaveServices = async () => {
    setLoadingServices(true);
    const payload = {
      username: client_username,
      action: "updateServiceColumns",
      ...sendServices,
    };

    try {
      const response = await works(payload);
      if (response?.data?.status === 1) {
        // Extract service names being saved
        const selectedServices = Object.keys(sendServices)
          .filter((service) => sendServices[service] === 1) // Only selected services
          .join(", "); // Join service names with commas

        // Show toast with the list of services
        toast.success(
          `Services updated successfully: ${selectedServices || "None"}`
        );

        handleClose(); // Close the modal
      } else {
        toast.error(
          response?.data?.message ||
            "Failed to update services. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to update services. Something went wrong.");
    } finally {
      setLoadingServices(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Modal isModalOpen={open} closeModal={handleClose}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="border mb-4">
              <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                No Image Available
              </div>
            </div>
            <div className="border p-4 mb-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </button>
            </div>
            <div className="border p-4">
              <h3 className="text-xl font-semibold mb-2">Quick Info</h3>
              <p>
                <strong>Last Visit:</strong>{formatDate(quickInfo.lastVisit)}
              </p>
              <p>
                <strong>Registration Date:</strong> {formatDate(quickInfo.registration)}
              </p>
              <p>
                <strong>Last IP Address:</strong> {quickInfo.lastIpAddress}
              </p>
            </div>
          </div>

          <div>
            <div className="border p-4 mb-4">
              <h4 className="font-bold mb-2">Profile</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>First Name</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={firstName}
                    onChange={handleInputChange(setFirstName)}
                    disabled={loadingProfile} 
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={lastName}
                    onChange={handleInputChange(setLastName)}
                    disabled={loadingProfile} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label>Location</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={country || ""}
                    readOnly
                  />
                </div>
                <div>
                  <label>User Type</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={user_type || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label>Email ID</label>
                  <input
                    type="email"
                    className="border p-2 w-full"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    disabled={loadingProfile} 
                  />
                </div>
                <div>
                  <label>Phone</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={clientMobileNo || ""}
                    readOnly
                  />
                </div>
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                onClick={handleSaveProfile}
                disabled={loadingProfile}
              >
                {loadingProfile ? "Saving Profile..." : "Save Profile"}
              </button>
            </div>

            <div className="border p-4">
              <h4 className="font-bold mb-2">Settings</h4>
              <p>Active/Deactivate Services</p>
              <div className="flex flex-col space-y-2">
                {services.length > 0 ? (
                  services.map((service, idx) => (
                    <label key={idx}>
                      <input
                        type="checkbox"
                        checked={sendServices[service] === 1}
                        onChange={() => handleServiceChange(service)}
                        disabled={loadingServices}
                      />{" "}
                      {service}
                    </label>
                  ))
                ) : (
                  <p>No services available</p>
                )}
              </div>
              <button
                className={`bg-blue-500 text-white py-2 px-4 rounded mr-2 ${
                  loadingServices ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSaveServices}
                disabled={loadingServices} // Use only `loadingServices`
              >
                {loadingServices ? "Saving Services..." : "Save Services"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </Modal>

      {isPasswordModalOpen && (
        <Modal
          isModalOpen={isPasswordModalOpen}
          closeModal={() => setIsPasswordModalOpen(false)}
        >
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <div className="mb-4">
              <label className="block text-lg mb-2">New Password</label>
              <div className="flex items-center border rounded">
                <input
                  type={showPassword ? "text" : "password"}
                  className="p-2 w-full border-none focus:ring-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="p-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-lg mb-2">Confirm Password</label>
              <div className="flex items-center border rounded">
                <input
                  type={showPasswordConfirmation ? "text" : "password"}
                  className="p-2 w-full border-none focus:ring-0"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
                <button
                  type="button"
                  className="p-2"
                  onClick={() =>
                    setShowPasswordConfirmation(!showPasswordConfirmation)
                  }
                >
                  {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                onClick={handlePasswordUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

UserProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  clientMobileNo: PropTypes.string,
  clientEmail: PropTypes.string,
  user_type: PropTypes.string,
  country: PropTypes.string,
  client_username: PropTypes.string.isRequired,
};

export default UserProfileModal;

// import React, { useState, useEffect } from "react";
// import Modal from "../Modal/index";
// import PropTypes from "prop-types";
// import { works, profile } from "../../services/api";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const UserProfileModal = ({
//   open,
//   handleClose,
//   client_username,
//   firstName,
//   lastName,
//   clientMobileNo,
//   clientEmail,
//   user_type,
//   country,
// }) => {
//   const [services, setServices] = useState([]);
//   const [sendServices, setSendServices] = useState({});
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//   const [password, setPassword] = useState(""); // Password state
//   const [passwordConfirmation, setPasswordConfirmation] = useState(""); // Password confirmation state

//   // Handle password update API call
//   const handlePasswordUpdate = async () => {
//     // Validation for empty fields and matching passwords
//     if (!password || !passwordConfirmation) {
//       toast.error("Both fields are required.");
//       return;
//     }

//     if (password !== passwordConfirmation) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     const payload = {
//       action: "update",
//       username: client_username, // Include the username in the payload
//       password: password,
//       password_confirmation: passwordConfirmation,
//     };

//     try {
//       const response = await profile(payload);

//       if (response?.data?.status === 1) {
//         toast.success("Password updated successfully.");
//         setIsPasswordModalOpen(false); // Close the password modal
//       } else {
//         toast.error("Failed to update password. Please try again.");
//       }
//     } catch (error) {
//       toast.error("An error occurred while updating the password.");
//     }
//   };

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await works({
//           action: "readAllService",
//         });
//         setServices(response.data.columns || []); // Fetch available services
//       } catch (error) {
//         toast.error("Failed to fetch services.");
//       }
//     };

//     if (open) {
//       fetchServices(); // Fetch services when the modal is opened
//     }
//   }, [open]);

//   // Handle service checkbox changes
//   const handleServiceChange = (service) => {
//     setSendServices((prev) => {
//       const isSelected = !prev[service]; // Toggle between 1 (checked) and 0 (unchecked)

//       if (isSelected) {
//         toast.success(`${service} has been selected.`);
//       } else {
//         toast.info(`${service} has been deselected.`);
//       }

//       return {
//         ...prev,
//         [service]: isSelected ? 1 : 0,
//       };
//     });
//   };

//   // Handle services save
//   const handleSave = async () => {
//     const payload = {
//       username: client_username, // Include username for the API
//       action: "updateServiceColumns", // Your action for updating services
//       ...sendServices,
//     };

//     try {
//       const response = await works(payload);

//       if (response?.data?.status === 1) {
//         toast.success("Services updated successfully!");
//       } else {
//         toast.error("Failed to update services. Please try again.");
//       }

//       handleClose(); // Close the modal after saving
//     } catch (error) {
//       toast.error("An error occurred while updating services.");
//     }
//   };

//   if (!open) return null;

//   return (
//     <>
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Main Profile Modal */}
//       <Modal isModalOpen={open} closeModal={handleClose}>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">User Profile</h2>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Left Column */}
//           <div>
//             <div className="border mb-4">
//               <div className="w-full h-64 flex items-center justify-center bg-gray-200">
//                 No Image Available
//               </div>
//             </div>

//             <div className="border p-4 mb-4">
//               <button
//                 className="bg-red-500 text-white py-2 px-4 rounded"
//                 onClick={() => setIsPasswordModalOpen(true)} // Open Password Modal
//               >
//                 Change Password
//               </button>
//             </div>

//             <div className="border p-4">
//               <h4 className="font-bold mb-2">Quick Info</h4>
//               <p>
//                 <strong>Last Visit:</strong>
//               </p>
//               <p>
//                 <strong>Registration:</strong>
//               </p>
//               <p>
//                 <strong>Last IP Address:</strong>
//               </p>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div>
//             <div className="border p-4 mb-4">
//               <h4 className="font-bold mb-2">Profile</h4>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label>First Name</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={firstName || ""}
//                     readOnly
//                   />
//                 </div>
//                 <div>
//                   <label>Last Name</label>
//                   <input
//                     type="text"
//                     className="border p-2 w-full"
//                     value={lastName || ""}
//                     readOnly
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end mt-4">
//           <button className="bg-gray-500 text-white py-2 px-4 rounded" onClick={handleClose}>
//             Close
//           </button>
//         </div>
//       </Modal>

//       {/* Change Password Modal */}
//       {isPasswordModalOpen && (
//         <Modal isModalOpen={isPasswordModalOpen} closeModal={() => setIsPasswordModalOpen(false)}>
//           <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Change Password</h2>
//             <div className="mb-4">
//               <label className="block text-lg mb-2">New Password</label>
//               <input
//                 type="password"
//                 className="border p-2 w-full"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-lg mb-2">Confirm Password</label>
//               <input
//                 type="password"
//                 className="border p-2 w-full"
//                 value={passwordConfirmation}
//                 onChange={(e) => setPasswordConfirmation(e.target.value)}
//               />
//             </div>
//             <div className="flex justify-end">
//               <button className="bg-blue-500 text-white py-2 px-4 rounded mr-2" onClick={handlePasswordUpdate}>
//                 Save
//               </button>
//               <button
//                 className="bg-gray-500 text-white py-2 px-4 rounded"
//                 onClick={() => setIsPasswordModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </>
//   );
// };

// UserProfileModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   firstName: PropTypes.string,
//   lastName: PropTypes.string,
//   clientMobileNo: PropTypes.string,
//   clientEmail: PropTypes.string,
//   user_type: PropTypes.string,
//   country: PropTypes.string,
//   client_username: PropTypes.string.isRequired, // Pass client_username for service update
// };

// export default UserProfileModal;
