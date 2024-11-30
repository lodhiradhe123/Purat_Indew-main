


// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import Modal from "../Modal/index"; // Assuming Modal is in the same folder
// import { transaction } from "../../services/api"; // Importing the transaction API function

// const UserTransactionModal = ({ open, handleClose, clientUsername }) => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true); // Loading state for the API

//   // Fetch transactions from API when the modal is opened

  
//   useEffect(() => {
//     if (open) {
//       // API call to fetch transaction data
//       const fetchTransactions = async () => {
//         try {
//           setLoading(true); // Start loading
//           const response = await transaction({
//             action: "read",
//             client_username: clientUsername, // Use the correct prop
//           });

//           // Set transactions from API response
//           setTransactions(response?.data?.data|| []); // Adjust based on the actual response format
//           setLoading(false); // Stop loading after data is fetched
//         } catch (error) {
//           // toast.error("Failed to fetch transactions:", error);
//           setLoading(false); // Stop loading even if there is an error
//         }
//       };

//       fetchTransactions(); // Call the function to fetch data
//     }
//   }, [open, clientUsername]); // Dependency on `open` and `clientUsername`

//   return (
//     <Modal isModalOpen={open} closeModal={handleClose}>
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">User Transaction</h2>
//       </div>

//       {/* Show loading indicator while fetching */}
//       {loading ? (
//         <div className="text-center py-4">Loading...</div>
//       ) : (
//         <>
//           {/* Transactions Table */}
//           <div className="border p-4 rounded">
//             <h3 className="font-bold mb-2">Transactions</h3>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border border-gray-300">
//                 <thead className="bg-gray-200">
//                   <tr>
//                     {[
//                       "Time",
//                       "Transaction ID",
//                       "Transaction",
//                       "Reseller",
//                       "User",
//                       "Credits",
//                       "Price",
//                       "Amount",
//                       "Description",
//                     ].map((headCell) => (
//                       <th key={headCell} className="p-2">
//                         {headCell}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transactions.length > 0 ? (
//                     transactions.map((transaction, index) => (
//                       <tr key={index} className="odd:bg-gray-100">
//                         <td className="p-2">{transaction.created_at}</td>
//                         <td className="p-2">{transaction.id}</td>
//                         <td className="p-2">{transaction.cd}</td>
//                         <td className="p-2">{transaction.reseller}</td>
//                         <td className="p-2">{transaction.name}</td>
//                         <td className="p-2">{transaction.sms}</td>
//                         <td className="p-2">{transaction.pps}</td>
//                         <td className="p-2">{transaction.amt}</td>
//                         <td className="p-2">{transaction.descrip}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
                     
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}

//       <div className="flex justify-end mt-4">
//         <button
//           className="bg-blue-500 text-white py-2 px-4 rounded"
//           onClick={handleClose}
//         >
//           Close
//         </button>
//       </div>
//     </Modal>
//   );
// };

// UserTransactionModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   clientUsername: PropTypes.string.isRequired, // Ensure this is a required prop
// };




// export default UserTransactionModal;




import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../Modal/index"; // Assuming Modal is in the same folder
import { transaction } from "../../services/api"; // Importing the transaction API function
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserTransactionModal = ({ open, handleClose, clientUsername }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for the API




  useEffect(() => {
    if (open) {
      setTransactions([]); // Clear previous transactions when modal is opened
      setLoading(true); // Reset loading state
      
      const fetchTransactions = async () => {
        try {
          console.log("Fetching transactions for:", clientUsername); // Debugging to verify correct username
          const response = await transaction({
            action: "read",
            client_username: clientUsername, // Pass the correct clientUsername for each user
          });
  
          // Set the transactions data from API response
          setTransactions(response?.data?.data || []);
          setLoading(false);
        } catch (error) {
          // console.error("Failed to fetch transactions:", error);
          toast.error("There is no transactions performed so empty");
          setLoading(false);
        }
      };
  
      fetchTransactions(); // Fetch transactions for the selected client
    }
  }, [open, clientUsername]); // Trigger fetch when modal opens or clientUsername changes
  

  return (
    <Modal isModalOpen={open} closeModal={handleClose}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Transaction</h2>
      </div>

      {/* Show loading indicator while fetching */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <>
          {/* Transactions Table */}
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Transactions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "Time",
                      "Transaction ID",
                      "Transaction",
                      "Reseller",
                      "User",
                      "Credits",
                      "Price",
                      "Amount",
                      "Description",
                    ].map((headCell) => (
                      <th key={headCell} className="p-2">
                        {headCell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={index} className="odd:bg-gray-100">
                        <td className="p-2">{transaction.created_at}</td>
                        <td className="p-2">{transaction.id}</td>
                        <td className="p-2">{transaction.cd}</td>
                        <td className="p-2">{transaction.reseller}</td>
                        <td className="p-2">{transaction.name}</td>
                        <td className="p-2">{transaction.sms}</td>
                        <td className="p-2">{transaction.pps}</td>
                        <td className="p-2">{transaction.amt}</td>
                        <td className="p-2">{transaction.decrip}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center p-2">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

UserTransactionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  clientUsername: PropTypes.string.isRequired, // Ensure this is a required prop
};

export default UserTransactionModal;
