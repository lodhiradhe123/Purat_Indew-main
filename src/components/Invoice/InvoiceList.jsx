

import React, { useState, useEffect } from "react";
import { invoicefull } from "../../services/api"; // Import the API function
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import InvoiceModal from "./InvoiceModal"; // Import the modal
import { useLocation } from "react-router-dom"; // Import useLocation
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const InvoiceList = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the state passed during navigation
  const [invoices, setInvoices] = useState([]); // Stores the list of invoices
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Stores the currently selected invoice data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
  const [loading, setLoading] = useState(false); // Loading state for the modal

  // Fetch all invoices for the user on component load
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true); // Start the loading state
      try {
        // Only fetch all invoices using "read" action, not "readSpecific"

        const response = await invoicefull({ action: "read", username: user });
        console.log("user", user);

        // Ensure response is an array
        setInvoices(
          Array.isArray(response?.data?.data) ? response.data.data : []
        );
        console.log("setinvoices", setinvoices);
      } catch (error) {
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    fetchInvoices(); // Only call fetchInvoices (read) on component load
  }, [user]); // Re-run when user changes

  // Handle the eye icon click to fetch and display the full invoice details (readSpecific)
  const handleView = async (invoiceId) => {
    try {
      setLoading(true); // Start the loading state
      const response = await invoicefull({
        action: "readSpecific",
        invoice_id: invoiceId,
      }); // Fetch specific invoice
      console.log("Fetched Invoice Data:", response.data); // Log the full invoice data here
      setSelectedInvoice(response?.data); // Set the selected invoice data for the modal
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching full invoice details:", error);
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  // Close the modal and clear the selected invoice state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null); // Clear selected invoice data
  };

  const backlogic = () => {
    navigate("/Invoice");
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex w-full">
        <div className="bg-white p-6 shadow-md mb-5 rounded-xl w-full">
          <div className="flex items-center">
            {/* Back Button */}
            <button
              onClick={backlogic}
              className="bg-white text-indigo-600 py-2 px-2 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
              aria-label="Go back"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back
            </button>

            {/* This div will take up the available space and center the heading */}
            <div className="flex-grow text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-800">
                Invoice List
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="text-center mb-4">Loading...</div>}

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Invoice #</th>
            <th className="py-2 px-4 border-b text-left">Client</th>
            <th className="py-2 px-4 border-b text-left">Amount</th>
            <th className="py-2 px-4 border-b text-left">Due Date</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Ensure invoices is an array before calling .map() */}
          {Array.isArray(invoices) &&
            invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="py-2 px-4 border-b">{invoice.invoice_no}</td>
                <td className="py-2 px-4 border-b">{invoice.user?.customer}</td>
                <td className="py-2 px-4 border-b">
                  {invoice.products.length > 0
                    ? invoice.products[0].price
                    : "N/A"}
                </td>
                <td className="py-2 px-4 border-b">{invoice.due_date}</td>
                <td className="py-2 px-4 border-b">{invoice.payment_status}</td>
                <td className="py-2 px-4 border-b">
                  {/* Eye icon to open modal */}
                  <button
                    onClick={() => handleView(invoice.id)} // Pass invoice ID to fetch full data
                    className="focus:outline-none"
                  >
                    <FontAwesomeIcon icon={faEye} className="text-blue-500" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Render InvoiceModal if isModalOpen is true */}
      {isModalOpen && selectedInvoice && (
        <InvoiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          invoiceData={selectedInvoice} // Pass the full invoice details to the modal
        />
      )}
    </div>
  );
};

export default InvoiceList;
















// import React, { useState, useEffect } from "react";
// import { invoicefull } from "../../services/api";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye } from "@fortawesome/free-solid-svg-icons";
// import InvoiceModal from "./InvoiceModal"; // Import your modal component

// const InvoiceList = ({ user }) => {
//   const [invoices, setInvoices] = useState([]); // Stores the list of invoices
//   const [selectedInvoice, setSelectedInvoice] = useState(null); // Stores the currently selected invoice data
//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         const response = await invoicefull({ action: "read", username: user });
//         setInvoices(response?.data?.data || []);
//       } catch (error) {
//         console.error("Error fetching invoices:", error);
//       }
//     };

//     fetchInvoices();
//   }, [user]);

//   // Handle viewing an invoice and opening the modal
//   const handleView = async (invoiceId) => {
//     try {
//       const response = await invoicefull({ action: "readSpecific", invoice_id: invoiceId });
//       setSelectedInvoice(response?.data); // Store the selected invoice data
//       setIsModalOpen(true); // Open the modal
//     } catch (error) {
//       console.error("Error fetching full invoice details:", error);
//     }
//   };

//   // Close modal and clear selected invoice
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedInvoice(null);
//   };

//   return (
//     <div>
//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
//           <tr>
//             <th className="py-2 px-4 border-b">Invoice #</th>
//             <th className="py-2 px-4 border-b">Client</th>
//             <th className="py-2 px-4 border-b">Amount</th>
//             <th className="py-2 px-4 border-b">Due Date</th>
//             <th className="py-2 px-4 border-b">Status</th>
//             <th className="py-2 px-4 border-b">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoices.map((invoice) => (
//             <tr key={invoice.id}>
//               <td className="py-2 px-4 border-b">{invoice.invoice_no}</td>
//               <td className="py-2 px-4 border-b">{invoice.user?.customer}</td>
//               <td className="py-2 px-4 border-b">
//                 {invoice.products.length > 0 ? invoice.products[0].price : "N/A"}
//               </td>
//               <td className="py-2 px-4 border-b">{invoice.due_date}</td>
//               <td className="py-2 px-4 border-b">{invoice.payment_status}</td>
//               <td className="py-2 px-4 border-b">
//                 <button onClick={() => handleView(invoice.id)}>
//                   <FontAwesomeIcon icon={faEye} className="text-blue-500" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Render InvoiceModal if isModalOpen is true and pass the selected invoice */}
//       {isModalOpen && (
//         <InvoiceModal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           invoiceData={selectedInvoice} // Pass the selected invoice data
//         />
//       )}
//     </div>
//   );
// };

// export default InvoiceList;









































// import React, { useState, useEffect } from "react";
// import { invoicefull } from "../../services/api"; // Import the API function
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye } from '@fortawesome/free-solid-svg-icons';

// import { useLocation } from 'react-router-dom'; // Import useLocation

// const InvoiceList = ({ user }) => {
//     const location = useLocation(); // Get the state passed during navigation
//     const [invoices, setInvoices] = useState([]); // Stores the list of invoices
//     const [selectedInvoice, setSelectedInvoice] = useState(null); // Stores the currently selected invoice data
//     const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
//     const [loading, setLoading] = useState(false); // Loading state for the modal

//     // Check if user is passed correctly
//     useEffect(() => {
//         console.log("User in InvoiceList:", user);  // Log the username to ensure it's being passed correctly
//     }, [user]);

//     // Fetch all invoices for the user on component load
//     useEffect(() => {
//         const fetchInvoices = async () => {
//             if (!user) return; // Ensure user is available before making the API call
//             setLoading(true); // Start the loading state
//             try {
//                 // Only fetch all invoices using "read" action
//                 const response = await invoicefull({ action: "read", username: user }); // Pass the username here

//                 // Ensure response is an array
//                 setInvoices(Array.isArray(response?.data?.data) ? response.data.data : []);
//             } catch (error) {
//                 console.error("Error fetching invoices:", error);
//             } finally {
//                 setLoading(false); // Stop the loading state
//             }
//         };

//         fetchInvoices(); // Only call fetchInvoices (read) on component load
//     }, [user]); // Re-run when user changes

//     // Handle the eye icon click to fetch and display the full invoice details (readSpecific)
//     const handleView = async (invoiceId) => {
//         if (!user) return; // Ensure user is available before making the API call
//         try {
//             setLoading(true); // Start the loading state
//             const response = await invoicefull({ action: "readSpecific", invoice_id: invoiceId, username: user }); // Pass the username here
//             console.log("Fetched Invoice Data:", response.data); // Log the full invoice data here
//             setSelectedInvoice(response.data); // Set the selected invoice data for the modal
//             setIsModalOpen(true); // Open the modal
//         } catch (error) {
//             console.error("Error fetching full invoice details:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Close the modal and clear the selected invoice state
//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setSelectedInvoice(null); // Clear selected invoice data
//     };

//     return (
//         <div className="container mx-auto p-4 bg-black">
//             <h2 className="text-2xl font-semibold mb-4">Invoice List</h2>

//             {/* Loading State */}
//             {loading && <div className="text-center mb-4">Loading...</div>}

//             <table className="min-w-full bg-white border border-gray-300">
//                 <thead>
//                     <tr>
//                         <th className="py-2 px-4 border-b text-left">Invoice #</th>
//                         <th className="py-2 px-4 border-b text-left">Client</th>
//                         <th className="py-2 px-4 border-b text-left">Amount</th>
//                         <th className="py-2 px-4 border-b text-left">Due Date</th>
//                         <th className="py-2 px-4 border-b text-left">Status</th>
//                         <th className="py-2 px-4 border-b text-left">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {/* Ensure invoices is an array before calling .map() */}
//                     {Array.isArray(invoices) && invoices.map((invoice) => (
//                         <tr key={invoice.id}>
//                             <td className="py-2 px-4 border-b">{invoice.invoice_no}</td>
//                             <td className="py-2 px-4 border-b">{invoice.user?.customer}</td>
//                             <td className="py-2 px-4 border-b">{invoice.products.length > 0 ? invoice.products[0].price : "N/A"}</td>
//                             <td className="py-2 px-4 border-b">{invoice.due_date}</td>
//                             <td className="py-2 px-4 border-b">{invoice.payment_status}</td>
//                             <td className="py-2 px-4 border-b">
//                                 {/* Eye icon to open modal */}
//                                 <button
//                                     onClick={() => handleView(invoice.id)} // Pass invoice ID to fetch full data
//                                     className="focus:outline-none">
//                                     <FontAwesomeIcon icon={faEye} className="text-blue-500" />
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Render InvoiceModal if isModalOpen is true */}
//             {isModalOpen && selectedInvoice && (
//                 <InvoiceModal
//                     isOpen={isModalOpen}
//                     onClose={handleCloseModal}
//                     invoiceData={selectedInvoice} // Pass the full invoice details to the modal
//                 />
//             )}
//         </div>
//     );
// };

// export default InvoiceList;
