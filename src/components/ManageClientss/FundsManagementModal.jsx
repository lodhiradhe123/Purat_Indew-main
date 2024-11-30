// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { works, funds } from "../../services/api"; // Import the API functions
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const FundsManagementModal = ({ user, clientUsername, handleClose }) => {
//   const [selectedService, setSelectedService] = useState(""); // Selected service
//   const [credits, setCredits] = useState("");
//   const [pricePerCredit, setPricePerCredit] = useState("");
//   const [actionType, setActionType] = useState("Deduct");
//   const [description, setDescription] = useState("");
//   const [services, setServices] = useState([]); // For storing user-specific services

//   // Fetch user-specific services from backend when the modal opens
//   useEffect(() => {
//     const fetchUserServices = async () => {
//       try {
//         const payload = {
//           action: "readActiveService", // API action for fetching services
//           username: clientUsername, // Fetch services for the specific client (clientUsername)
//         };

//         const response = await works(payload); // Call the API with the client-specific action
//         console.log("Fetched services:", response.data); // Debugging the response
//         setServices(response.data.active_services || []); // Update the services based on the response
//       } catch (error) {
//         toast.error("Error fetching user-specific services:", error.response ? error.response.data : error);
//       }
//     };

//     if (clientUsername) {
//       fetchUserServices(); // Call the function to fetch services for the selected client
//     }
//   }, [clientUsername]); // Ensure this updates when the clientUsername changes

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!selectedService) {
//       alert("Please select a service");
//       return;
//     }

//     const payload = {
//       username: user, // Admin username
//       client_username: clientUsername, // Client username passed from BroadcastList
//       service: selectedService, // The selected service from dropdown
//       credits, // The 'credits' value from the input
//       amount: pricePerCredit, // 'pricePerCredit' as the amount
//       description, // Description from the input field
//       operation: actionType === "Add" ? "credit" : "debit", // Use "credit" for addFunds and "debit" for deductFunds
//     };

//     try {
//       const response = await funds(payload); // Call the API
//       console.log("Funds operation response:", response);
//       handleClose(); // Close the modal on successful submission
//     } catch (error) {
//       console.error("Error performing funds operation:", error.response ? error.response.data : error);
//     }
//   };

//   return (
//     <div className="w-full mx-auto min-h-[900px]">
//       {/* Title Section */}
//       <div className="text-center mb-12">
//         <h2 className="text-4xl font-bold mb-8">Funds Management</h2>
//       </div>

//       <div className="mb-10">
//         <h3 className="text-4xl font-semibold">{clientUsername}</h3> {/* Display the client's username */}
//         <p className="text-lg mt-2">Service can be activated/Deactivated from the setting option</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//         {/* Form Section */}
//         <div>
//           <label className="block mb-3 text-lg font-medium">
//             Select Service/Route and add or deduct funds
//           </label>
//           <select
//             value={selectedService} // Ensure selectedService is bound to the dropdown
//             onChange={(e) => setSelectedService(e.target.value)} // Update selected service
//             className="w-full p-3 border text-lg rounded mb-5"
//           >
//             {services.length > 0 ? (
//               services.map((service, idx) => (
//                 <option key={idx} value={service}>
//                   {service} {/* Populate the dropdown with the fetched services */}
//                 </option>
//               ))
//             ) : (
//               <option value="">No services available</option>
//             )}
//           </select>

//           <input
//             type="text"
//             placeholder="Credits"
//             value={credits}
//             onChange={(e) => setCredits(e.target.value)}
//             className="w-full p-3 border text-lg rounded mb-5"
//           />

//           <input
//             type="text"
//             placeholder="Price per Credit"
//             value={pricePerCredit}
//             onChange={(e) => setPricePerCredit(e.target.value)}
//             className="w-full p-3 border text-lg rounded mb-5"
//           />

//           <div className="flex items-center space-x-6 mb-5">
//             <label className="text-lg font-medium">
//               <input
//                 type="radio"
//                 value="Deduct"
//                 checked={actionType === "Deduct"}
//                 onChange={(e) => setActionType(e.target.value)}
//                 className="mr-2"
//               />
//               Deduct
//             </label>
//             <label className="text-lg font-medium">
//               <input
//                 type="radio"
//                 value="Add"
//                 checked={actionType === "Add"}
//                 onChange={(e) => setActionType(e.target.value)}
//                 className="mr-2"
//               />
//               Add
//             </label>
//           </div>

//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-3 border text-lg rounded mb-5"
//             rows="3"
//           />
//         </div>

//         {/* Services Section */}
//         <div>
//           {services.map((service, idx) => (
//             <div key={idx} className="flex justify-between items-center mb-5">
//               <span className="flex items-center text-lg">
//                 <span className="mr-2">✉️</span> {service}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-end mt-20">
//         <button className="bg-green-500 text-white text-lg py-2 px-6 rounded" onClick={handleSubmit}>
//           Submit
//         </button>
//         <button className="ml-4 py-2 px-6 text-lg text-gray-600" onClick={handleClose}>
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// FundsManagementModal.propTypes = {
//   handleClose: PropTypes.func.isRequired,
//   user: PropTypes.string.isRequired, // Admin username
//   clientUsername: PropTypes.string.isRequired, // Client username
// };

// export default FundsManagementModal;

// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { works, funds } from "../../services/api"; // Import the API functions
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const FundsManagementModal = ({ user, clientUsername, handleClose }) => {
//   const [selectedService, setSelectedService] = useState(""); // Selected service
//   const [credits, setCredits] = useState("");
//   const [pricePerCredit, setPricePerCredit] = useState("");
//   const [actionType, setActionType] = useState("Deduct");
//   const [description, setDescription] = useState("");
//   const [services, setServices] = useState([]); // For storing user-specific services

//   // Fetch user-specific services from backend when the modal opens
//   useEffect(() => {
//     const fetchUserServices = async () => {
//       try {
//         const payload = {
//           action: "readActiveService", // API action for fetching services
//           username: clientUsername, // Fetch services for the specific client (clientUsername)
//         };

//         const response = await works(payload); // Call the API with the client-specific action
//         console.log("Fetched services:", response.data); // Debugging the response
//         // toast.success("Funds operation successful");
//         setServices(response.data.active_services || []); // Update the services based on the response
//       } catch (error) {
//         if (error.response && error.response.data) {
//           let errorMessage = "";
      
//           // Check if the error is in `error.response.data.error`
//           if (error.response.data.error) {
//             const errors = error.response.data.error;
//             errorMessage = Array.isArray(errors)
//               ? errors.join(', ') // Join multiple error messages if it's an array
//               : errors; // Use the error message directly if it's not an array
//           } 
//           // Otherwise, check if the error is in `error.response.data.message`
//           else if (error.response.data.message) {
//             errorMessage = error.response.data.message;
//           }
      
//           // Display the error message in the toast
//           if (errorMessage) {
//             console.error("Backend error:", errorMessage);
//             toast.error(errorMessage);
//           }
//         } else {
//           console.error("Unexpected error occurred:", error); // Log unexpected errors
//           // Do not show any toast for unexpected errors
//         }
//       }
      
//     };

//     if (clientUsername) {
//       fetchUserServices(); // Call the function to fetch services for the selected client
//     }
//   }, [clientUsername]); // Ensure this updates when the clientUsername changes

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!selectedService) {
//       toast.error("Please select a service");
//       return;
//     }

//     const payload = {
//       username: user, // Admin username
//       client_username: clientUsername, // Client username passed from BroadcastList
//       service: selectedService, // The selected service from dropdown
//       credits, // The 'credits' value from the input
//       amount: pricePerCredit, // 'pricePerCredit' as the amount
//       description, // Description from the input field
//       operation: actionType === "Add" ? "credit" : "debit", // Use "credit" for addFunds and "debit" for deductFunds
//     };

//     try {
//       const response = await funds(payload); // Call the API
//       console.log("Funds operation response:", response);
//       toast.success("Funds operation successful");
//       handleClose(); // Close the modal on successful submission
//     } catch (error) {
//       if (error.response && error.response.data) {
//         let errorMessage = "";
    
//         if (error.response.data.error) {
//           const errors = error.response.data.error;
//           errorMessage = Array.isArray(errors)
//             ? errors.join(', ')
//             : errors;
//         } else if (error.response.data.message) {
//           errorMessage = error.response.data.message;
//         }
    
//         if (errorMessage) {
//           console.error("Backend error:", errorMessage);
//           toast.error(errorMessage);
//         }
//       } else {
//         console.error("Unexpected error occurred:", error);
//       }
//     }
    
//   };

//   return (
//     <div className="w-full mx-auto min-h-[900px]">
//       <ToastContainer position="top-right" autoClose={3000} />
//       {/* Title Section */}
//       <div className="text-center mb-12">
//         <h2 className="text-4xl font-bold mb-8">Funds Management</h2>
//       </div>

//       <div className="mb-10">
//         <h3 className="text-4xl font-semibold">{clientUsername}</h3>{" "}
//         {/* Display the client's username */}
//         <p className="text-lg mt-2">
//           Service can be activated/Deactivated from the setting option
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
//         {/* Form Section */}
//         <div>
//           <label className="block mb-3 text-lg font-medium">
//             Select Service/Route and add or deduct funds
//           </label>
//           <select
//             value={selectedService} // Ensure selectedService is bound to the dropdown
//             onChange={(e) => setSelectedService(e.target.value)} // Update selected service
//             className="w-full p-3 border text-lg rounded mb-5"
//           >
//             {services.length > 0 ? (
//               services.map((service, idx) => (
//                 <option key={idx} value={service}>
//                   {service}{" "}
//                   {/* Populate the dropdown with the fetched services */}
//                 </option>
//               ))
//             ) : (
//               <option value="">No services available</option>
//             )}
//           </select>

//           <input
//             type="text"
//             placeholder="Credits"
//             value={credits}
//             onChange={(e) => setCredits(e.target.value)}
//             className="w-full p-3 border text-lg rounded mb-5"
//           />

//           <input
//             type="text"
//             placeholder="Price per Credit"
//             value={pricePerCredit}
//             onChange={(e) => setPricePerCredit(e.target.value)}
//             className="w-full p-3 border text-lg rounded mb-5"
//           />

//           <div className="flex items-center space-x-6 mb-5">
//             <label className="text-lg font-medium">
//               <input
//                 type="radio"
//                 value="Deduct"
//                 checked={actionType === "Deduct"}
//                 onChange={(e) => setActionType(e.target.value)}
//                 className="mr-2"
//               />
//               Deduct
//             </label>
//             <label className="text-lg font-medium">
//               <input
//                 type="radio"
//                 value="Add"
//                 checked={actionType === "Add"}
//                 onChange={(e) => setActionType(e.target.value)}
//                 className="mr-2"
//               />
//               Add
//             </label>
//           </div>

//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-3 border text-lg rounded mb-5"
//             rows="3"
//           />
//         </div>

//         {/* Services Section */}
//         <div>
//           {services.map((service, idx) => (
//             <div key={idx} className="flex justify-between items-center mb-5">
//               <span className="flex items-center text-lg">
//                 <span className="mr-2">✉️</span> {service}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-end mt-20">
//         <button
//           className="bg-green-500 text-white text-lg py-2 px-6 rounded"
//           onClick={handleSubmit}
//         >
//           Submit
//         </button>
//         <button
//           className="ml-4 py-2 px-6 text-lg text-gray-600"
//           onClick={handleClose}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// FundsManagementModal.propTypes = {
//   handleClose: PropTypes.func.isRequired,
//   user: PropTypes.string.isRequired, // Admin username
//   clientUsername: PropTypes.string.isRequired, // Client username
// };

// export default FundsManagementModal;

















import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { works, funds } from "../../services/api"; // Import the API functions
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FundsManagementModal = ({ user, clientUsername, handleClose }) => {
  const [selectedService, setSelectedService] = useState(""); // Selected service
  const [credits, setCredits] = useState("");
  const [pricePerCredit, setPricePerCredit] = useState("");
  const [actionType, setActionType] = useState("Deduct");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]); // For storing user-specific services
  const [mappedServices, setMappedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const serviceNameMapping = {
    email_credits: "Email Credits",
    sms_credits: "GSM-SMS Credits",
    voice_credits: "Voice Credits",
    whatsapp_credits: "WhatsApp Credits",
    rcs_credits: "RCS Credits",
    ai_videos_credits: "AI Video Credits",
    can_access_repost: "CAN Access Report",
  };

  // Fetch user-specific services from backend when the modal opens
  useEffect(() => {
    const fetchUserServices = async () => {
      try {
        const payload = {
          action: "readActiveService", // API action for fetching services
          username: clientUsername, // Fetch services for the specific client (clientUsername)
        };

        const response = await works(payload); // Call the API with the client-specific action
        console.log("Fetched services:", response.data); // Debugging the response
        // toast.success("Funds operation successful");
        const activeServices = response.data.active_services || [];
        // setServices(response.data.active_services || []); // Update the services based on the response

        const mapped = activeServices.map((service) => ({
          value: service,
          label: serviceNameMapping[service] || service, // Fallback to original name if not mapped
        }));

        setServices(activeServices);
        setMappedServices(mapped);
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          if (data.errors) {
            for (const key in data.errors) {
              toast.error(`${key}: ${data.errors[key].join(", ")}`);

            }
          } else {
            toast.error(data.message || "An error occurred.");
          }
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    };

    if (clientUsername) {
      fetchUserServices(); // Call the function to fetch services for the selected client
    }
  }, [clientUsername]); // Ensure this updates when the clientUsername changes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }
    setLoading(true);

    const payload = {
      username: user, // Admin username
      client_username: clientUsername, // Client username passed from BroadcastList
      service: selectedService, // The selected service from dropdown
      credits, // The 'credits' value from the input
      amount: pricePerCredit, // 'pricePerCredit' as the amount
      description, // Description from the input field
      operation: actionType === "Add" ? "credit" : "debit", // Use "credit" for addFunds and "debit" for deductFunds
    };

    try {
      const response = await funds(payload); // Call the API
      console.log("Funds operation response:", response);
      toast.success("Funds operation successful");
      toast.success(`${selectedService} assigned with ${credits} credits successfully.`);
      handleClose(); // Close the modal on successful submission
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          for (const key in data.errors) {
            toast.error(`${key}: ${data.errors[key].join(", ")}`);
          }
        } else {
          toast.error(data.message || "An error occurred.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="w-full mx-auto min-h-[900px]">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Title Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-8">Funds Management</h2>
      </div>

      <div className="mb-10">
        <h3 className="text-4xl font-semibold">{clientUsername}</h3>{" "}
        {/* Display the client's username */}
        <p className="text-lg mt-2">
          Service can be activated/Deactivated from the setting option
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <label className="block mb-3 text-lg font-medium">
            Select Service/Route and add or deduct funds
          </label>
          <select
            value={selectedService} // Ensure selectedService is bound to the dropdown
            onChange={(e) => setSelectedService(e.target.value)} // Update selected service
            className="w-full p-3 border text-lg rounded mb-5"
          >
            <option value="">Select a service</option>
            {mappedServices.length > 0 ? (
              mappedServices.map((service, idx) => (
                <option key={idx} value={service.value}>
                  {service.label}
                  {/* Populate the dropdown with the fetched services */}
                </option>
              ))
            ) : (
              <option value="">No services available</option>
            )}
          </select>

          <input
            type="text"
            placeholder="Credits"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="w-full p-3 border text-lg rounded mb-5"
          />

          <input
            type="text"
            placeholder="Price per Credit"
            value={pricePerCredit}
            onChange={(e) => setPricePerCredit(e.target.value)}
            className="w-full p-3 border text-lg rounded mb-5"
          />

          <div className="flex items-center space-x-6 mb-5">
            <label className="text-lg font-medium">
              <input
                type="radio"
                value="Deduct"
                checked={actionType === "Deduct"}
                onChange={(e) => setActionType(e.target.value)}
                className="mr-2"
              />
              Deduct
            </label>
            <label className="text-lg font-medium">
              <input
                type="radio"
                value="Add"
                checked={actionType === "Add"}
                onChange={(e) => setActionType(e.target.value)}
                className="mr-2"
              />
              Add
            </label>
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border text-lg rounded mb-5"
            rows="3"
          />
        </div>

        {/* Services Section */}
        <div>
          {mappedServices.map((service, idx) => (
            <div key={idx} className="flex justify-between items-center mb-5">
              <span className="flex items-center text-lg">
                <span className="mr-2">✉</span> {service.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-20">
        {/* <button
          className="bg-green-500 text-white text-lg py-2 px-6 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button> */}

        <button
          type="submit"
          className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        <button
          className="ml-4 py-2 px-6 text-lg text-gray-600"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

FundsManagementModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired, // Admin username
  clientUsername: PropTypes.string.isRequired, // Client username
};

export default FundsManagementModal;
