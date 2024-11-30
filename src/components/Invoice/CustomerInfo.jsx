import { useState, useEffect } from "react";
import { invoicecustomer } from "../../services/api"; // Assuming this is the correct API for customer-related operations
import { invoice, INVOICE } from "../../services/api";
import "react-toastify/dist/ReactToastify.css";

const CustomerInfo = ({ user, errors, setSelectedCustomer, prefillData }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerLocal, setSelectedCustomerLocal] = useState({
    customer: "",
    company_name: "", // Separate field for company name
    address: "",
    gstin: "",
    phone: "",
    email: "",
  });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  // Fetch customers (who are also companies)
  const fetchCustomers = async () => {
    try {
      const response = await invoicecustomer({
        action: "read",
        username: user,
      });

      if (response.status === 200) {
        const customerArray = response.data.data || [];
        setCustomers(Array.isArray(customerArray) ? customerArray : []);
      } else {
        toast.error("Failed to fetch customers:", response.data.error);
      }
    } catch (error) {
      toast.error(
        "Error fetching customers:",
        error.response?.data || error.message
      );
    }
  };

  // Fetch customers on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user]);

  useEffect(() => {
    if (prefillData) {
      setSelectedCustomerLocal(prefillData); // Set initial values for form
      setSelectedCustomer(prefillData); // Set values in parent state
    }
  }, [prefillData, setSelectedCustomer]);

  // Handle customer dropdown selection
  const handleCustomerChange = async (e) => {
    const customerId = parseInt(e.target.value, 10);

    try {
      const response = await invoicecustomer({
        action: "readSpecific",
        user_id: customerId,
      });

      if (response.status === 200 && response.data) {
        const customerDetails = response.data.data[0];
        // console.log("Fetched Customer Details:", customerDetails); // Debugging log

        // Ensure customerDetails has the correct fields
        setSelectedCustomer(customerDetails || {});
        setSelectedCustomerLocal({
          ...customerDetails,
          address: customerDetails?.address || "No address",
          phone: customerDetails?.phone || "No phone",
          customer: customerDetails?.customer || "No customer name", // Fallback for null values
          company_name: customerDetails?.company_name || "No company name", // Fallback for null
        });
      } else {
        toast.error(
          "Failed to fetch specific customer details:",
          response.data.error
        );
      }
    } catch (error) {
      toast.error(
        "Error fetching specific customer details:",
        error.response?.data || error.message
      );
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomerLocal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setSelectedCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add new customer (with separate fields for company name)
  const handleAddCustomer = async () => {
    if (
      !selectedCustomerLocal.customer ||
      !selectedCustomerLocal.address ||
      !selectedCustomerLocal.gstin ||
      !selectedCustomerLocal.company_name ||
      !selectedCustomerLocal.phone
    ) {
      toast.error("Please provide complete customer details.");
      return;
    }

    const customerData = {
      action: "create",
      username: user || "defaultUsername", // Include username in create action
      customer: selectedCustomerLocal.customer,
      company_name: selectedCustomerLocal.company_name, // Separate company name field
      address: selectedCustomerLocal.address,
      gstin: selectedCustomerLocal.gstin,
      phone: selectedCustomerLocal.phone || "",
      email: selectedCustomerLocal.email || "",
    };
    // console.log("Sending Customer Data:", customerData); // Debugging log

    try {
      const response = await invoicecustomer(customerData);
      if (response.status === 200 || response.data.status === 1) {
        // console.log("Customer created successfully:", response);
        fetchCustomers(); // Fetch the updated list of customers
        setIsAddingCustomer(false);
      } else {
        toast.error(
          "Failed to create customer:",
          response.data.error || "Unknown error"
        );
      }
    } catch (error) {
      toast.error(
        "Error creating customer:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="add-invoice-page p-4 w-1/2 bg-white rounded-lg shadow-md mr-48">
      <h3 className="text-xl font-medium mb-4">Customer Information</h3>
      <div className="grid grid-cols-2 gap-6 mb-4">
        {/* Customer Dropdown (existing customers who are companies) */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">
            Customer
          </label>
          {!isAddingCustomer ? (
            <select
            value={selectedCustomerLocal?.id || ""}
            onChange={handleCustomerChange}
            className="p-2 mt-2 block w-full border rounded-lg text-lg"
          >
            <option value="" disabled>Select a Customer</option>
            {customers.map((customer) => {
              // console.log('Customer:', customer);  // Debugging log
              return (
                <option key={customer.id} value={customer.id}>
                  {customer.customer}
                </option>
              );
            })}
          </select>
          
          ) : (
            <input
              type="text"
              name="customer"
              value={selectedCustomerLocal.customer || ""}
              onChange={handleInputChange}
              className="p-2 mt-1 block w-full border rounded-lg text-lg"
              placeholder="Enter Customer Name"
            />
          )}
          {errors?.customerName && (
            <span className="text-red-500 text-sm">{errors.customerName}</span>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">
            Company Name
          </label>
          <input
            type="text"
            name="company_name"
            value={selectedCustomerLocal.company_name || ""} // Separate company name field
            onChange={handleInputChange}
            className="p-2 mt-1 block w-full border rounded-lg text-lg"
            placeholder="Enter Company Name"
            readOnly={!isAddingCustomer}
          />
          {errors?.companyName && (
            <span className="text-red-500 text-sm">{errors.companyName}</span>
          )}
        </div>

        {/* Customer Address */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={selectedCustomerLocal.address || ""}
            onChange={handleInputChange}
            readOnly={!isAddingCustomer}
            placeholder="Enter Address"
            className={`p-2 mt-1 block w-full border rounded-lg text-lg ${
              !isAddingCustomer ? "bg-gray-100" : ""
            }`}
          />
          {errors?.customerAddress && (
            <span className="text-red-500 text-sm">
              {errors.customerAddress}
            </span>
          )}
        </div>

        {/* GSTIN */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">GSTIN</label>
          <input
            type="text"
            name="gstin"
            placeholder="Enter GSTIN"
            value={selectedCustomerLocal.gstin || ""}
            onChange={handleInputChange}
            readOnly={!isAddingCustomer}
            className={`p-2 mt-1 block w-full border rounded-lg text-lg ${
              !isAddingCustomer ? "bg-gray-100" : ""
            }`}
          />
          {errors?.customerGSTIN && (
            <span className="text-red-500 text-sm">{errors.customerGSTIN}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">Email</label>
          <input
            type="email"
            name="email"
            value={selectedCustomerLocal.email || ""}
            onChange={handleInputChange}
            readOnly={!isAddingCustomer}
            placeholder="Enter Email"
            className={`p-2 mt-1 block w-full border rounded-lg text-lg ${
              !isAddingCustomer ? "bg-gray-100" : ""
            }`}
          />
          {errors?.customerEmail && (
            <span className="text-red-500 text-sm">{errors.customerEmail}</span>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">Phone</label>
          <input
            type="text"
            name="phone"
            value={selectedCustomerLocal.phone || ""}
            onChange={handleInputChange}
            readOnly={!isAddingCustomer}
            placeholder="Enter Phone Number"
            className={`p-2 mt-1 block w-full border rounded-lg text-lg ${
              !isAddingCustomer ? "bg-gray-100" : ""
            }`}
          />
          {errors?.customerPhone && (
            <span className="text-red-500 text-sm">{errors.customerPhone}</span>
          )}
        </div>
      </div>

      {/* Button to toggle between adding and selecting customer */}
      <div className="col-span-2 flex space-x-6">
        {/* <div className="flex justify-between items-center mt-4 "> */}

        {isAddingCustomer && (
          <button
            onClick={handleAddCustomer}
            className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg mr-6"
          >
            Save Customer
          </button>
        )}
        <button
          onClick={() => setIsAddingCustomer((prev) => !prev)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg"
        >
          {isAddingCustomer ? "Cancel" : "Add New Customer"}
        </button>
      </div>
    </div>
  );
};

export default CustomerInfo;

// import { useState, useEffect } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';  // Import CSS
// import { invoicecustomer } from '../../services/api';  // Assuming this is the correct API for customer-related operations

// const CustomerInfo = ({ user, errors, setSelectedCustomer, prefillData }) => {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomerLocal, setSelectedCustomerLocal] = useState({
//     customer: '',
//     company_name: '',
//     address: '',
//     gstin: '',
//     phone: '',
//     email: '',
//   });
//   const [isAddingCustomer, setIsAddingCustomer] = useState(false);

//   // Fetch customers (who are also companies)
//   const fetchCustomers = async () => {
//     try {
//       const response = await invoicecustomer({
//         action: 'read',
//         username: user,
//       });

//       if (response.status === 200) {
//         const customerArray = response.data.data || [];
//         setCustomers(Array.isArray(customerArray) ? customerArray : []);
//       } else {
//         toast.error('Failed to fetch customers:', response.data.error);
//       }
//     } catch (error) {
//       console.error('Error fetching customers:', error.response?.data || error.message);
//     }
//   };

//   // Fetch customers on component mount and when user changes
//   useEffect(() => {
//     if (user) {
//       fetchCustomers();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (prefillData) {
//       setSelectedCustomerLocal(prefillData);  // Set initial values for form
//       setSelectedCustomer(prefillData);       // Set values in parent state
//     }
//   }, [prefillData, setSelectedCustomer]);

//   // Handle customer dropdown selection
//   const handleCustomerChange = async (e) => {
//     const customerId = parseInt(e.target.value, 10);

//     try {
//       const response = await invoicecustomer({
//         action: 'readSpecific',
//         user_id: customerId,
//       });

//       if (response.status === 200 && response.data) {
//         const customerDetails = response.data.data[0];
//         setSelectedCustomer(customerDetails || {});  // Send to parent component
//         setSelectedCustomerLocal({
//           ...customerDetails,
//           address: customerDetails.address || '',
//           phone: customerDetails.phone || '',
//         });  // Local state
//       } else {
//         console.error('Failed to fetch specific customer details:', response.data.error);
//       }
//     } catch (error) {
//       console.error('Error fetching specific customer details:', error.response?.data || error.message);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedCustomerLocal((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//     setSelectedCustomer((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Add new customer (with separate fields for company name)
//   const handleAddCustomer = async () => {
//     if (!selectedCustomerLocal.customer || !selectedCustomerLocal.address || !selectedCustomerLocal.gstin || !selectedCustomerLocal.company_name || !selectedCustomerLocal.phone) {
//       console.error('Please provide complete customer details.');
//       return;
//     }

//     const customerData = {
//       action: 'create',
//       username: user || 'defaultUsername',  // Include username in create action
//       customer: selectedCustomerLocal.customer,
//       company_name: selectedCustomerLocal.company_name,  // Separate company name field
//       address: selectedCustomerLocal.address,
//       gstin: selectedCustomerLocal.gstin,
//       phone: selectedCustomerLocal.phone || '',
//       email: selectedCustomerLocal.email || '',
//     };

//     try {
//       const response = await invoicecustomer(customerData);
//       if (response.status === 200 || response.data.status === 1) {
//         // Display success message via toast
//         toast.success('Customer created successfully!');

//         fetchCustomers();  // Fetch the updated list of customers
//         setIsAddingCustomer(false);
//       } else {
//         console.error('Failed to create customer:', response.data.error || 'Unknown error');
//       }
//     } catch (error) {
//       console.error('Error creating customer:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="add-invoice-page p-6 w-1/2 bg-white rounded-lg shadow-md mr-48">
//       <ToastContainer /> {/* Add the ToastContainer component here */}
//       <h3 className="text-xl font-medium mb-4">Customer Information</h3>
//       <div className="grid grid-cols-2 gap-6 mb-6">
//         {/* Customer Dropdown (existing customers who are companies) */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Customer</label>
//           {!isAddingCustomer ? (
//             <select
//               value={selectedCustomerLocal?.id || ""}
//               onChange={handleCustomerChange}
//               className="p-2 mt-2 block w-full border rounded-lg text-lg"
//             >
//               <option value="" disabled>Select a Customer</option>
//               {customers.map((customer) => (
//                 <option key={customer.id} value={customer.id}>
//                   {customer.customer} {/* Show customer_name */}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <input
//               type="text"
//               name="customer"
//               value={selectedCustomerLocal.customer || ''}
//               onChange={handleInputChange}
//               className="p-2 mt-2 block w-full border rounded-lg text-lg"
//               placeholder="Enter Customer Name"
//             />
//           )}
//           {errors?.customerName && <span className="text-red-500 text-sm">{errors.customerName}</span>}
//         </div>

//         {/* Company Name */}

//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Company Name</label>
//           <input
//             type="text"
//             name="company_name"
//             value={selectedCustomerLocal.company_name || ''}  // Separate company name field
//             onChange={handleInputChange}
//             className="p-2 mt-2 block w-full border rounded-lg text-lg"
//             placeholder="Enter Company Name"
//             readOnly={!isAddingCustomer}
//           />
//           {errors?.companyName && <span className="text-red-500 text-sm">{errors.companyName}</span>}
//         </div>

//         {/* Customer Address */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Address</label>
//           <input
//             type="text"
//             name="address"
//             value={selectedCustomerLocal.address || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCustomer}
//             placeholder="Enter Address"
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCustomer ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.customerAddress && <span className="text-red-500 text-sm">{errors.customerAddress}</span>}
//         </div>

//         {/* GSTIN */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">GSTIN</label>
//           <input
//             type="text"
//             name="gstin"
//             placeholder="Enter GSTIN"
//             value={selectedCustomerLocal.gstin || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCustomer}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCustomer ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.customerGSTIN && <span className="text-red-500 text-sm">{errors.customerGSTIN}</span>}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={selectedCustomerLocal.email || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCustomer}
//             placeholder="Enter Email"
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCustomer ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.customerEmail && <span className="text-red-500 text-sm">{errors.customerEmail}</span>}
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Phone</label>
//           <input
//             type="text"
//             name="phone"
//             value={selectedCustomerLocal.phone || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCustomer}
//             placeholder="Enter Phone Number"
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCustomer ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.customerPhone && <span className="text-red-500 text-sm">{errors.customerPhone}</span>}
//         </div>
//       </div>

//       {/* Button to toggle between adding and selecting customer */}
//       <div className="col-span-2 flex space-x-2">
//         {isAddingCustomer && (
//           <button
//             onClick={handleAddCustomer}
//             className="bg-white text-indigo-600 py-4 px-10 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
//           >
//             Save Customer
//           </button>
//         )}

//         <button
//           onClick={() => setIsAddingCustomer((prev) => !prev)}
//           className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg"
//         >
//           {isAddingCustomer ? 'Cancel' : 'Add New Customer'}
//         </button>

//       </div>
//     </div>
//   );
// };

// export default CustomerInfo;
