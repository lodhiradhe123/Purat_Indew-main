// import React, { useEffect } from 'react';
// import { invoice } from '../../services/api'; // Import the invoice API

// const CompanyInfo = ({
//   selectedCompany,
//   companies,
//   setSelectedCompany,
//   isAddingCompany,
//   handleInputChange,
//   handleAddCompany,
//   errors,
//   setIsAddingCompany,
//   handleLogoUpload,
//   handleRemoveLogo,
//   companyLogo,
//   user
// }) => {
//   // Fetch the companies when the component loads
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await invoice({
//           action: 'read',
//           username: user
//         });
//         if (response.status === 200) {
//           console.log("Fetched companies:", response.data);
//           const companyArray = response.data.data || [];
//           setSelectedCompany(Array.isArray(companyArray) ? companyArray : []);
//         } else {
//           console.error("Failed to fetch companies:", response.data.error);
//         }
//       } catch (error) {
//         console.error("Error fetching companies:", error.response?.data || error.message);
//       }
//     };

//     if (user) {
//       fetchCompanies();
//     }
//   }, [user, setSelectedCompany]);

//   // Handle company selection change
//   const handleCompanyChange = async (e) => {
//     const companyId = parseInt(e.target.value, 10);

//     try {
//       const response = await invoice({
//         action: 'readSpecific',
//         company_id: companyId
//       });

//       if (response.status === 200 && response.data) {
//         const companyDetails = response.data.data[0]; // Assuming the first element is the desired company
//         setSelectedCompany(companyDetails); // Store selected company details
//       } else {
//         console.error("Failed to fetch specific company details:", response.data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching specific company details:", error.response?.data || error.message);
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-lg font-medium mb-3">Company Information</h3>

//       {/* Upload Company Logo */}
//       <label className="block text-gray-600 text-sm">Upload Company Logo</label>
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleLogoUpload}
//         className="p-1 mt-1 block w-full border rounded text-sm"
//       />
//       {companyLogo && (
//         <div className="relative mt-2">
//           <img
//             src={companyLogo}
//             alt="Company Logo Preview"
//             className="w-15 h-20 object-cover border border-gray-300 rounded"
//           />
//           <button
//             onClick={handleRemoveLogo}
//             className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
//           >
//             &#x2715;
//           </button>
//         </div>
//       )}

//       {/* Company Name */}
//       <div>
//         <label className="block text-gray-600 text-sm">Company Name</label>
//         {isAddingCompany ? (
//           <input
//             type="text"
//             name="name"
//             value={selectedCompany?.name || ""}
//             onChange={(e) => handleInputChange(e, setSelectedCompany)}
//             className="p-1 mt-1 block w-full border rounded text-sm"
//           />
//         ) : (
//           <select
//             value={selectedCompany?.id || ""}
//             onChange={handleCompanyChange}
//             className="p-1 mt-1 block w-full border rounded text-sm"
//           >
//             <option value="" disabled>Select a Company</option>
//             {companies.map((company) => (
//               <option key={company.id} value={company.id}>
//                 {company.company_name}
//               </option>
//             ))}
//           </select>
//         )}
//         {errors.companyName && <span className="text-red-500 text-sm">{errors.companyName}</span>}
//       </div>

//       {/* Company Address */}
//       <div>
//         <label className="block text-gray-600 text-sm">Address</label>
//         <input
//           type="text"
//           name="address"
//           value={selectedCompany?.company_address || ""}
//           onChange={(e) => handleInputChange(e, setSelectedCompany)}
//           readOnly={!isAddingCompany}
//           className={`p-1 mt-1 block w-full border rounded text-sm ${!isAddingCompany ? "bg-gray-100" : ""}`}
//         />
//         {errors.companyAddress && <span className="text-red-500 text-sm">{errors.companyAddress}</span>}
//       </div>

//       {/* GSTIN */}
//       <div>
//         <label className="block text-gray-600 text-sm">GSTIN</label>
//         <input
//           type="text"
//           name="gstin"
//           value={selectedCompany?.gstin || ""}
//           onChange={(e) => handleInputChange(e, setSelectedCompany)}
//           readOnly={!isAddingCompany}
//           className={`p-1 mt-1 block w-full border rounded text-sm ${!isAddingCompany ? "bg-gray-100" : ""}`}
//         />
//         {errors.companyGSTIN && <span className="text-red-500 text-sm">{errors.companyGSTIN}</span>}
//       </div>

//       {/* Email */}
//       <div>
//         <label className="block text-gray-600 text-sm">Email</label>
//         <input
//           type="email"
//           name="email"
//           value={selectedCompany?.email || ""}
//           onChange={(e) => handleInputChange(e, setSelectedCompany)}
//           readOnly={!isAddingCompany}
//           className={`p-1 mt-1 block w-full border rounded text-sm ${!isAddingCompany ? "bg-gray-100" : ""}`}
//         />
//       </div>

//       {/* Phone Number */}
//       <div>
//         <label className="block text-gray-600 text-sm">Phone Number</label>
//         <input
//           type="text"
//           name="phone_number"
//           value={selectedCompany?.phone_number || ""}
//           onChange={(e) => handleInputChange(e, setSelectedCompany)}
//           readOnly={!isAddingCompany}
//           className={`p-1 mt-1 block w-full border rounded text-sm ${!isAddingCompany ? "bg-gray-100" : ""}`}
//         />
//       </div>

//       {/* Save Company Button */}
//       {isAddingCompany && (
//         <div>
//           <button
//             onClick={handleAddCompany}
//             className="bg-green-500 text-white py-1 px-2 rounded text-sm mt-2"
//           >
//             Save Company
//           </button>
//         </div>
//       )}

//       {/* Toggle Add Company */}
//       <div>
//         <button
//           onClick={() => setIsAddingCompany(!isAddingCompany)}
//           className="bg-blue-500 text-white py-1 px-2 rounded text-sm mt-2"
//         >
//           {isAddingCompany ? "Cancel" : "Add Company"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CompanyInfo;

// import { useState, useEffect } from 'react';
// import { invoice } from '../../services/api';

// const CompanyInfo = ({ user, errors, setSelectedCompany }) => {
//   const [companyLogo, setCompanyLogo] = useState(null);
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompanyLocal, setSelectedCompanyLocal] = useState({
//     company_name: '',
//     company_address: '',
//     gstin: '',
//     phone_number: '',
//     email: '',
//   });
//   const [isAddingCompany, setIsAddingCompany] = useState(false);

//   // Fetch companies
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await invoice({
//           action: 'read',
//           username: user,
//         });

//         if (response.status === 200) {
//           const companyArray = response.data.data || [];
//           setCompanies(Array.isArray(companyArray) ? companyArray : []);
//         } else {
//           console.error('Failed to fetch companies:', response.data.error);
//         }
//       } catch (error) {
//         console.error('Error fetching companies:', error.response?.data || error.message);
//       }
//     };

//     if (user) {
//       fetchCompanies();
//     }
//   }, [user]);

//   // Handle company dropdown selection
//   const handleCompanyChange = async (e) => {
//     const companyId = parseInt(e.target.value, 10);

//     try {
//       const response = await invoice({
//         action: 'readSpecific',
//         company_id: companyId,
//       });

//       if (response.status === 200 && response.data) {
//         const companyDetails = response.data.data[0];
//         setSelectedCompany(companyDetails || {}); // Send to parent component
//         setSelectedCompanyLocal(companyDetails || {}); // Local state
//       } else {
//         console.error('Failed to fetch specific company details:', response.data.error);
//       }
//     } catch (error) {
//       console.error('Error fetching specific company details:', error.response?.data || error.message);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedCompanyLocal((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//     setSelectedCompany((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle company logo upload
//   const handleLogoUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setCompanyLogo(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Remove company logo
//   const handleRemoveLogo = () => {
//     setCompanyLogo(null);
//   };

//   // Add new company
//   const handleAddCompany = async () => {
//     if (!selectedCompanyLocal.company_name || !selectedCompanyLocal.company_address || !selectedCompanyLocal.gstin) {
//       console.error('Please provide complete company details.');
//       return;
//     }

//     const companyData = {
//       action: 'create',
//       username: user || 'defaultUsername',
//       company_name: selectedCompanyLocal.company_name,
//       company_address: selectedCompanyLocal.company_address,
//       gstin: selectedCompanyLocal.gstin,
//       phone_number: selectedCompanyLocal.phone_number || '',
//       email: selectedCompanyLocal.email || '',
//     };

//     try {
//       const response = await invoice(companyData);
//       if (response.status === 200 || response.data.status === 1) {
//         console.log('Company created successfully:', response);
//         setCompanies([...companies, { ...selectedCompanyLocal, id: response.data.company_id }]);
//         setIsAddingCompany(false);
//       } else {
//         console.error('Failed to create company:', response.data.error || 'Unknown error');
//       }
//     } catch (error) {
//       console.error('Error creating company:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg ">
//       <h3 className="text-lg font-medium mb-3">Company Information</h3>
//       <div className="grid grid-cols-2 gap-4 mb-0">
//         {/* Upload Company Logo */}
//         <div>
//           <label className="block text-gray-600 text-sm font-bold">Upload Company Logo</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleLogoUpload}
//             className="p-1 mt-1 block w-full border rounded text-sm"
//           />
//           {companyLogo && (
//             <div className="relative mt-2">
//               <img
//                 src={companyLogo}
//                 alt="Company Logo Preview"
//                 className="w-15 h-20 object-cover border border-gray-300 rounded"
//               />
//               <button
//                 onClick={handleRemoveLogo}
//                 className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
//               >
//                 &#x2715;
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Company Name */}
//         <div>
//           <label className="block text-gray-600 text-sm font-bold">Company Name</label>
//           {isAddingCompany ? (
//             <input
//               type="text"
//               name="company_name"
//               value={selectedCompanyLocal.company_name || ''}
//               onChange={handleInputChange}
//               className="p-1 mt-1 block w-full border rounded text-sm"
//             />
//           ) : (
//             <select
//               value={selectedCompanyLocal?.id || ''}
//               onChange={handleCompanyChange}
//               className="p-1 mt-1 block w-full border rounded text-sm"
//             >
//               <option value="" disabled>
//                 Select a Company
//               </option>
//               {companies.map((company) => (
//                 <option key={company.id} value={company.id}>
//                   {company.company_name}
//                 </option>
//               ))}
//             </select>
//           )}
//           {errors?.companyName && <span className="text-red-500 text-sm">{errors.companyName}</span>}
//         </div>

//         {/* Company Address */}
//         <div>
//           <label className="block text-gray-600 text-sm font-bold">Address</label>
//           <input
//             type="text"
//             name="company_address"
//             value={selectedCompanyLocal.company_address || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-1 mt-1 block w-full border rounded text-sm ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.companyAddress && <span className="text-red-500 text-sm">{errors.companyAddress}</span>}
//         </div>

//         {/* GSTIN */}
//         <div>
//           <label className="block text-gray-600 text-sm font-bold">GSTIN</label>
//           <input
//             type="text"
//             name="gstin"
//             value={selectedCompanyLocal.gstin || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-1 mt-1 block w-full border rounded text-sm ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.companyGSTIN && <span className="text-red-500 text-sm">{errors.companyGSTIN}</span>}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-gray-600 text-sm font-bold">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={selectedCompanyLocal.email || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-1 mt-1 block w-full border rounded text-sm ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//         </div>

//         {/* Phone Number */}
//         <div>
//           <label className="block text-gray-600 text-sm font-bold">Mobile No</label>
//           <input
//             type="text"
//             name="phone_number"
//             value={selectedCompanyLocal.phone_number || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-1 mt-1 block w-full border rounded text-sm ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//         </div>

//         {/* Add and Cancel Buttons */}
//         <div>
//           {isAddingCompany && (
//             <button onClick={handleAddCompany} className="bg-green-500 text-white py-1 px-2 rounded text-sm mt-2 mr-4">
//               Save Company
//             </button>
//           )}
//           <button
//             onClick={() => setIsAddingCompany(!isAddingCompany)}
//             className="bg-blue-500 text-white py-1 px-2 rounded text-sm mt-2 mr-2"
//           >
//             {isAddingCompany ? 'Cancel' : 'Add Company'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyInfo;

// import { useState, useEffect } from "react";
// import { invoice, INVOICE } from "../../services/api";
// import "react-toastify/dist/ReactToastify.css"; // Import CSS

// const CompanyInfo = ({ user, errors, setSelectedCompany, prefillData }) => {
//   const [companyLogo, setCompanyLogo] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompanyLocal, setSelectedCompanyLocal] = useState({
//     company_name: "",
//     company_address: "",
//     gstin: "",
//     phone_number: "",
//     company_email: "", // Keep 'email' for frontend
//   });

//   const [isAddingCompany, setIsAddingCompany] = useState(false);

//   // Fetch companies
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await invoice({
//           action: "read",
//           username: user,
//         });

//         if (response.status === 200) {
//           const companyArray = response.data.data || [];
//           setCompanies(Array.isArray(companyArray) ? companyArray : []);
//         } else {
//           console.error("Failed to fetch companies:", response.data.error);
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching companies:",
//           error.response?.data || error.message
//         );
//       }
//     };

//     if (user) {
//       fetchCompanies();
//     }
//   }, [user]);

//   useEffect(() => {
//     if (prefillData) {
//       setSelectedCompanyLocal(prefillData); // Set initial values for form
//       setSelectedCompany(prefillData); // Set values in parent state
//     }
//   }, [prefillData, setSelectedCompany]);

//   // const handleCompanyChange = async (e) => {
//   //       const companyId = parseInt(e.target.value, 10);

//   //       try {
//   //         const response = await invoice({
//   //           action: 'readSpecific',
//   //           company_id: companyId
//   //         });

//   //         if (response.status === 200 && response.data) {
//   //           const companyDetails = response.data.data[0]; // Assuming the first element is the desired company
//   //           setSelectedCompany(companyDetails); // Store selected company details
//   //         } else {
//   //           console.error("Failed to fetch specific company details:", response.data.error);
//   //         }
//   //       } catch (error) {
//   //         console.error("Error fetching specific company details:", error.response?.data || error.message);
//   //       }
//   //     };

//   // Handle company dropdown selection
//   const handleCompanyChange = async (e) => {
//     const companyId = parseInt(e.target.value, 10);

//     try {
//       const response = await invoice({
//         action: "readSpecific",
//         company_id: companyId,
//       });

//       if (response.status === 200 && response.data) {
//         const companyDetails = response.data.data[0];
//         console.log("Selected Company Details:", companyDetails);
//         setSelectedCompany(companyDetails || {}); // Send to parent component
//         setSelectedCompanyLocal(companyDetails || {}); // Local state
//         setLogoPreview(companyDetails?.company_image || null);
//       } else {
//         console.error(
//           "Failed to fetch specific company details:",
//           response.data.error
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching specific company details:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   console.log("img", logoPreview);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedCompanyLocal((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//     setSelectedCompany((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle company logo upload
//   // const handleLogoUpload = (event) => {
//   //   const file = event.target.files[0];
//   //   const reader = new FileReader();
//   //   reader.onloadend = () => {
//   //     setCompanyLogo(reader.result);
//   //   };
//   //   reader.readAsDataURL(file);
//   // };

//   const handleLogoUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setCompanyLogo(file);
//       setLogoPreview(URL.createObjectURL(file)); // Preview the image
//     }
//   };

//   // Remove company logo
//   const handleRemoveLogo = () => {
//     setCompanyLogo(null);
//   };

//   // Add new company
//   const handleAddCompany = async () => {
//     if (
//       !selectedCompanyLocal.company_name ||
//       !selectedCompanyLocal.company_address ||
//       !selectedCompanyLocal.gstin ||
//       !selectedCompanyLocal.company_email
//     ) {
//       console.error("Please provide complete company details.");
//       return;
//     }

//     // Create FormData and append fields and file (image)
//     const formData = new FormData();
//     formData.append("action", "create");
//     formData.append("username", user || "defaultUsername");
//     formData.append("company_name", selectedCompanyLocal.company_name);
//     formData.append("company_address", selectedCompanyLocal.company_address);
//     formData.append("gstin", selectedCompanyLocal.gstin);
//     formData.append("phone_number", selectedCompanyLocal.phone_number || "");
//     formData.append("company_email", selectedCompanyLocal.company_email || ""); // Map 'email' to 'company_email'

//     // Append the company logo if it's available
//     // if (companyLogo) {
//     //   const fileInput = document.querySelector('input[type="file"]');
//     //   if (fileInput.files.length > 0) {
//     //     formData.append('company_image', fileInput.files[0]); // Append file
//     //   }
//     // }

//     if (companyLogo) {
//       formData.append("company_image", companyLogo); // Append the image file directly
//     }

//     try {
//       const response = await invoice(formData); // Pass FormData directly to invoice API
//       if (response.status === 200 || response.data.status === 1) {
//         console.log("Company created successfully:", response);
//         setCompanies([
//           ...companies,
//           { ...selectedCompanyLocal, id: response.data.company_id },
//         ]);
//         setIsAddingCompany(false);
//         setCompanyLogo(null); // Reset logo after save
//         setLogoPreview(null);
//       } else {
//         console.error(
//           "Failed to create company:",
//           response.data.error || "Unknown error"
//         );
//       }
//     } catch (error) {
//       console.error(
//         "Error creating company:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md w-1/2 ml-10 ">
//       <h3 className="text-xl font-medium mb-4">Company Information</h3>
//       <div className="grid grid-cols-2 gap-6 mb-6">
//         {/* Upload Company Logo */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">
//             Upload Company Logo
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleLogoUpload}
//             className="p-2 mt-2 block w-full border rounded-lg text-lg"
//           />
//           {logoPreview && (
//             <div className="relative mt-3">
//               <img
//                 src={logoPreview}
//                 alt="Company Logo Preview"
//                 className="w-20 h-20 object-cover border border-gray-300 rounded-lg"
//               />
//               <button
//                 onClick={handleRemoveLogo}
//                 className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
//               >
//                 &#x2715;
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Company Name */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">
//             Company Name
//           </label>
//           {isAddingCompany ? (
//             <input
//               type="text"
//               name="company_name"
//               placeholder="Enter Company Name"
//               value={selectedCompanyLocal.company_name || ""}
//               onChange={handleInputChange}
//               className="p-2 mt-2 block w-full border rounded-lg text-lg"
//             />
//           ) : (
//             <select
//               value={selectedCompanyLocal?.id || " "}
//               onChange={handleCompanyChange}
//               className="p-2 mt-2 block w-full border rounded-lg text-lg"
//             >
//               <option value="" disabled>
//                 Select a Company
//               </option>
//               {companies.map((company) => (
//                 <option key={company.id} value={company.id}>
//                   {company.company_name}
//                 </option>
//               ))}
//             </select>
//           )}
//           {errors?.companyName && (
//             <span className="text-red-500 text-sm">{errors.companyName}</span>
//           )}
//         </div>

//         {/* Company Address */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">
//             Address
//           </label>
//           <input
//             type="text"
//             name="company_address"
//             placeholder="Enter Address"
//             value={selectedCompanyLocal.company_address || ""}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${
//               !isAddingCompany ? "bg-gray-100" : ""
//             }`}
//           />
//           {errors?.companyAddress && (
//             <span className="text-red-500 text-sm">
//               {errors.companyAddress}
//             </span>
//           )}
//         </div>

//         {/* GSTIN */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">GSTIN</label>
//           <input
//             type="text"
//             name="gstin"
//             placeholder="Enter GSTIN"
//             value={selectedCompanyLocal.gstin || ""}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${
//               !isAddingCompany ? "bg-gray-100" : ""
//             }`}
//           />
//           {errors?.companyGSTIN && (
//             <span className="text-red-500 text-sm">{errors.companyGSTIN}</span>
//           )}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Email</label>
//           <input
//             type="text"
//             name="company_email"
//             placeholder="Enter Email"
//             value={selectedCompanyLocal.company_email || ""}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${
//               !isAddingCompany ? "bg-gray-100" : ""
//             }`}
//           />
//         </div>

//         {/* Phone Number */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">
//             Mobile No
//           </label>
//           <input
//             type="text"
//             name="phone_number"
//             placeholder="Enter mobile"
//             value={selectedCompanyLocal.phone_number || ""}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${
//               !isAddingCompany ? "bg-gray-100" : ""
//             }`}
//           />
//         </div>

//         {/* Add and Cancel Buttons */}
//         <div className="col-span-2 flex space-x-2">
//           {isAddingCompany && (
//             <button
//               onClick={handleAddCompany}
//               className="bg-white text-indigo-600 py-4 px-10 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
//             >
//               Save Company
//             </button>
//           )}
//           <button
//             onClick={() => setIsAddingCompany(!isAddingCompany)}
//             className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg"
//           >
//             {isAddingCompany ? "Cancel" : "Add Company"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default CompanyInfo;



import { useState, useEffect } from "react";
import { invoice, INVOICE } from "../../services/api";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const CompanyInfo = ({
  user,
  errors,
  setSelectedCompany,
  prefillData,
  logoPreview,
  setLogoPreview,
}) => {
  const [companyLogo, setCompanyLogo] = useState(null);
  // const [logoPreview, setLogoPreview] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyLocal, setSelectedCompanyLocal] = useState({
    company_name: "",
    company_address: "",
    gstin: "",
    phone_number: "",
    company_email: "", // Keep 'email' for frontend
  });

  const [isAddingCompany, setIsAddingCompany] = useState(false);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await invoice({
          action: "read",
          username: user,
        });

        if (response.status === 200) {
          const companyArray = response.data.data || [];
          setCompanies(Array.isArray(companyArray) ? companyArray : []);
        } else {
          toast.error("Failed to fetch companies:", response.data.error);
        }
      } catch (error) {
        toast.error(
          "Error fetching companies:",
          error.response?.data || error.message
        );
      }
    };

    if (user) {
      fetchCompanies();
    }
  }, [user]);

  useEffect(() => {
    if (prefillData) {
      setSelectedCompanyLocal(prefillData); // Set initial values for form
      setSelectedCompany(prefillData); // Set values in parent state
    }
  }, [prefillData, setSelectedCompany]);

  // Handle company dropdown selection
  const handleCompanyChange = async (e) => {
    const companyId = parseInt(e.target.value, 10);

    try {
      const response = await invoice({
        action: "readSpecific",
        company_id: companyId,
      });

      if (response.status === 200 && response.data) {
        const companyDetails = response.data.data[0];
        console.log("Selected Company Details:", companyDetails);
        setSelectedCompany(companyDetails || {}); // Send to parent component
        setSelectedCompanyLocal(companyDetails || {}); // Local state
        setLogoPreview(companyDetails?.company_image || null);
      } else {
        toast.error(
          "Failed to fetch specific company details:",
          response.data.error
        );
      }
    } catch (error) {
      toast.error(
        "Error fetching specific company details:",
        error.response?.data || error.message
      );
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCompanyLocal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setSelectedCompany((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle company logo upload
  // const handleLogoUpload = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setCompanyLogo(reader.result);
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCompanyLogo(file);
      const previewUrl = URL.createObjectURL(file);
      // Preview the image
      setLogoPreview(previewUrl);
    }
  };

  // Remove company logo
  const handleRemoveLogo = () => {
    setCompanyLogo(null);
    setLogoPreview(null); 
  };

  // Add new company
  const handleAddCompany = async () => {
    if (
      !selectedCompanyLocal.company_name ||
      !selectedCompanyLocal.company_address ||
      !selectedCompanyLocal.gstin ||
      !selectedCompanyLocal.company_email
    ) {
      toast.error("Please provide complete company details.");
      return;
    }

    // Create FormData and append fields and file (image)
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("username", user || "defaultUsername");
    formData.append("company_name", selectedCompanyLocal.company_name);
    formData.append("company_address", selectedCompanyLocal.company_address);
    formData.append("gstin", selectedCompanyLocal.gstin);
    formData.append("phone_number", selectedCompanyLocal.phone_number || "");
    formData.append("company_email", selectedCompanyLocal.company_email || ""); // Map 'email' to 'company_email'

    if (companyLogo) {
      formData.append("company_image", companyLogo); // Append the image file directly
    }

    try {
      const response = await invoice(formData); // Pass FormData directly to invoice API
      if (response.status === 200 || response.data.status === 1) {
        console.log("Company created successfully:", response);
        setCompanies([
          ...companies,
          { ...selectedCompanyLocal, id: response.data.company_id },
        ]);
        setIsAddingCompany(false);
        setCompanyLogo(null); // Reset logo after save
        setLogoPreview(null);
      } else {
        toast.error(
          "Failed to create company:",
          response.data.error || "Unknown error"
        );
      }
    } catch (error) {
      toast.error(
        "Error creating company:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-1/2 ml-10 ">
      <h3 className="text-xl font-medium mb-4">Company Information</h3>
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Upload Company Logo */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">
            Upload Company Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="p-2 mt-2 block w-full border rounded-lg text-lg"
          />
          {logoPreview && (
            <div className="relative mt-3">
              <img
                src={logoPreview}
                alt="Company Logo Preview"
                className="w-20 h-20 object-cover border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleRemoveLogo}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
              >
                &#x2715;
              </button>
            </div>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">
            Company Name
          </label>
          {isAddingCompany ? (
            <input
              type="text"
              name="company_name"
              placeholder="Enter Company Name"
              value={selectedCompanyLocal.company_name || ""}
              onChange={handleInputChange}
              className="p-2 mt-2 block w-full border rounded-lg text-lg"
            />
          ) : (
            <select
              value={selectedCompanyLocal?.id || " "}
              onChange={handleCompanyChange}
              className="p-2 mt-2 block w-full border rounded-lg text-lg"
            >
              <option value="" disabled>
                Select a Company
              </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company_name}
                </option>
              ))}
            </select>
          )}
          {errors?.companyName && (
            <span className="text-red-500 text-sm">{errors.companyName}</span>
          )}
        </div>

        {/* Company Address */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">
            Address
          </label>
          <input
            type="text"
            name="company_address"
            placeholder="Enter Address"
            value={selectedCompanyLocal.company_address || ""}
            onChange={handleInputChange}
            readOnly={!isAddingCompany}
            className={`p-2 mt-2 block w-full border rounded-lg text-lg ${
              !isAddingCompany ? "bg-gray-100" : ""
            }`}
          />
          {errors?.companyAddress && (
            <span className="text-red-500 text-sm">
              {errors.companyAddress}
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
            value={selectedCompanyLocal.gstin || ""}
            onChange={handleInputChange}
            readOnly={!isAddingCompany}
            className={`p-2 mt-2 block w-full border rounded-lg text-lg ${
              !isAddingCompany ? "bg-gray-100" : ""
            }`}
          />
          {errors?.companyGSTIN && (
            <span className="text-red-500 text-sm">{errors.companyGSTIN}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">Email</label>
          <input
            type="text"
            name="company_email"
            placeholder="Enter Email"
            value={selectedCompanyLocal.company_email || ""}
            onChange={handleInputChange}
            readOnly={!isAddingCompany}
            className={`p-2 mt-2 block w-full border rounded-lg text-lg ${
              !isAddingCompany ? "bg-gray-100" : ""
            }`}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-gray-600 text-lg font-bold">
            Mobile No
          </label>
          <input
            type="text"
            name="phone_number"
            placeholder="Enter mobile"
            value={selectedCompanyLocal.phone_number || ""}
            onChange={handleInputChange}
            readOnly={!isAddingCompany}
            className={`p-2 mt-2 block w-full border rounded-lg text-lg ${
              !isAddingCompany ? "bg-gray-100" : ""
            }`}
          />
        </div>

        {/* Add and Cancel Buttons */}
        <div className="col-span-2 flex space-x-2">
          {isAddingCompany && (
            <button
              onClick={handleAddCompany}
              className="bg-white text-indigo-600 py-4 px-10 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
            >
              Save Company
            </button>
          )}
          <button
            onClick={() => setIsAddingCompany(!isAddingCompany)}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg"
          >
            {isAddingCompany ? "Cancel" : "Add Company"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CompanyInfo;

// import { invoice } from '../../services/api';

// const CompanyInfo = ({ user, errors, setSelectedCompany }) => {
//   const [companyLogo, setCompanyLogo] = useState(null);
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompanyLocal, setSelectedCompanyLocal] = useState({
//     company_name: '',
//     company_address: '',
//     gstin: '',
//     phone_number: '',
//     email: '',
//   });
//   const [isAddingCompany, setIsAddingCompany] = useState(false);

//   // Fetch companies
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await invoice({
//           action: 'read',
//           username: user,
//         });

//         if (response.status === 200) {
//           const companyArray = response.data.data || [];
//           setCompanies(Array.isArray(companyArray) ? companyArray : []);
//         } else {
//           console.error('Failed to fetch companies:', response.data.error);
//         }
//       } catch (error) {
//         console.error('Error fetching companies:', error.response?.data || error.message);
//       }
//     };

//     if (user) {
//       fetchCompanies();
//     }
//   }, [user]);

//   // Handle company dropdown selection
//   const handleCompanyChange = async (e) => {
//     const companyId = parseInt(e.target.value, 10);

//     try {
//       const response = await invoice({
//         action: 'readSpecific',
//         company_id: companyId,
//       });

//       if (response.status === 200 && response.data) {
//         const companyDetails = response.data.data[0];
//         setSelectedCompany(companyDetails || {}); // Send to parent component
//         setSelectedCompanyLocal(companyDetails || {}); // Local state
//       } else {
//         console.error('Failed to fetch specific company details:', response.data.error);
//       }
//     } catch (error) {
//       console.error('Error fetching specific company details:', error.response?.data || error.message);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedCompanyLocal((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//     setSelectedCompany((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle company logo upload
//   const handleLogoUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setCompanyLogo(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Remove company logo
//   const handleRemoveLogo = () => {
//     setCompanyLogo(null);
//   };

//   // Add new company
//   const handleAddCompany = async () => {
//     if (!selectedCompanyLocal.company_name || !selectedCompanyLocal.company_address || !selectedCompanyLocal.gstin || !selectedCompanyLocal.company_email) {
//       console.error('Please provide complete company details.');
//       return;
//     }

//     const companyData = {
//       action: 'create',
//       username: user || 'defaultUsername',
//       company_name: selectedCompanyLocal.company_name,
//       company_address: selectedCompanyLocal.company_address,
//       gstin: selectedCompanyLocal.gstin,
//       phone_number: selectedCompanyLocal.phone_number || '',
//       email: selectedCompanyLocal.email || '',
//     };

//     try {
//       const response = await invoice(companyData);
//       if (response.status === 200 || response.data.status === 1) {
//         console.log('Company created successfully:', response);
//         setCompanies([...companies, { ...selectedCompanyLocal, id: response.data.company_id }]);
//         setIsAddingCompany(false);
//       } else {
//         console.error('Failed to create company:', response.data.error || 'Unknown error');
//       }
//     } catch (error) {
//       console.error('Error creating company:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md w-1/2 ml-10 ">
//       <h3 className="text-xl font-medium mb-4">Company Information</h3>
//       <div className="grid grid-cols-2 gap-6 mb-6">
//         {/* Upload Company Logo */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Upload Company Logo</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleLogoUpload}
//             className="p-2 mt-2 block w-full border rounded-lg text-lg"
//           />
//           {companyLogo && (
//             <div className="relative mt-3">
//               <img
//                 src={companyLogo}
//                 alt="Company Logo Preview"
//                 className="w-20 h-20 object-cover border border-gray-300 rounded-lg"
//               />
//               <button
//                 onClick={handleRemoveLogo}
//                 className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
//               >
//                 &#x2715;
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Company Name */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Company Name</label>
//           {isAddingCompany ? (
//             <input
//               type="text"
//               name="company_name"
//               placeholder="Enter Company Name"
//               value={selectedCompanyLocal.company_name || ''}
//               onChange={handleInputChange}
//               className="p-2 mt-2 block w-full border rounded-lg text-lg"
//             />
//           ) : (
//             <select
//               value={selectedCompanyLocal?.id || ''}
//               onChange={handleCompanyChange}
//               className="p-2 mt-2 block w-full border rounded-lg text-lg"
//             >
//               <option value="" disabled>
//                 Select a Company
//               </option>
//               {companies.map((company) => (
//                 <option key={company.id} value={company.id}>
//                   {company.company_name}
//                 </option>
//               ))}
//             </select>
//           )}
//           {errors?.companyName && <span className="text-red-500 text-sm">{errors.companyName}</span>}
//         </div>

//         {/* Company Address */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Address</label>
//           <input
//             type="text"
//             name="company_address"
//             placeholder="Enter Address"
//             value={selectedCompanyLocal.company_address || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.companyAddress && <span className="text-red-500 text-sm">{errors.companyAddress}</span>}
//         </div>

//         {/* GSTIN */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">GSTIN</label>
//           <input
//             type="text"
//             name="gstin"
//             placeholder="Enter GSTIN"
//             value={selectedCompanyLocal.gstin || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.companyGSTIN && <span className="text-red-500 text-sm">{errors.companyGSTIN}</span>}
//         </div>

//         {/* Email */}
//          {/* Email */}
//          <div>
//           <label className="block text-gray-600 text-lg font-bold">Email</label>
//           <input
//             type="text"
//             name="company_email"
//             placeholder="Enter Email"
//             value={selectedCompanyLocal.company_email || ''}
//            onChange={handleInputChange}
//            readOnly={!isAddingCompany}
//            className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//         </div>

//         {/* Phone Number */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Mobile No</label>
//           <input
//             type="text"
//             name="phone_number"
//             placeholder="Enter mobile"
//             value={selectedCompanyLocal.phone_number || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//         </div>

//         {/* Add and Cancel Buttons */}
//         <div className="col-span-2 flex space-x-2">
//           {isAddingCompany && (
//             <button onClick={handleAddCompany} className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg mr-6">
//               Save Company
//             </button>
//           )}
//           <button
//             onClick={() => setIsAddingCompany(!isAddingCompany)}
//             className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg"
//           >
//             {isAddingCompany ? 'Cancel' : 'Add Company'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyInfo;

// import { useState, useEffect } from 'react';
// import { invoice } from '../../services/api';

// const CompanyInfo = ({ user, errors, setSelectedCompany }) => {
//   const [companyLogo, setCompanyLogo] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null); // For image preview
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompanyLocal, setSelectedCompanyLocal] = useState({
//     company_name: '',
//     company_address: '',
//     gstin: '',
//     phone_number: '',
//     email: '',
//   });
//   const [isAddingCompany, setIsAddingCompany] = useState(false);

//   // Fetch companies
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await invoice({
//           action: 'read',
//           username: user,
//         });

//         if (response.status === 200) {
//           const companyArray = response.data.data || [];
//           setCompanies(Array.isArray(companyArray) ? companyArray : []);
//         } else {
//           console.error('Failed to fetch companies:', response.data.error);
//         }
//       } catch (error) {
//         console.error('Error fetching companies:', error.response?.data || error.message);
//       }
//     };

//     if (user) {
//       fetchCompanies();
//     }
//   }, [user]);

//   // Handle company dropdown selection
//   const handleCompanyChange = async (e) => {
//     const companyId = parseInt(e.target.value, 10);

//     try {
//       const response = await invoice({
//         action: 'readSpecific',
//         company_id: companyId,
//       });

//       if (response.status === 200 && response.data) {
//         const companyDetails = response.data.data[0];
//         setSelectedCompany(companyDetails || {}); // Send to parent component
//         setSelectedCompanyLocal(companyDetails || {}); // Local state
//         setLogoPreview(companyDetails?.company_image_url || null); // Load image preview if available
//       } else {
//         console.error('Failed to fetch specific company details:', response.data.error);
//       }
//     } catch (error) {
//       console.error('Error fetching specific company details:', error.response?.data || error.message);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedCompanyLocal((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//     setSelectedCompany((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle company logo upload
//   const handleLogoUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setCompanyLogo(file);
//       setLogoPreview(URL.createObjectURL(file)); // Preview the image
//     }
//   };

//   // Remove company logo
//   const handleRemoveLogo = () => {
//     setCompanyLogo(null);
//     setLogoPreview(null);
//   };

//   // Add new company
//   const handleAddCompany = async () => {
//     if (!selectedCompanyLocal.company_name || !selectedCompanyLocal.company_address || !selectedCompanyLocal.gstin || !selectedCompanyLocal.email) {
//       console.error("Please provide complete company details.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("action", "create");
//     formData.append("username", user || "defaultUsername");
//     formData.append("company_name", selectedCompanyLocal.company_name);
//     formData.append("company_address", selectedCompanyLocal.company_address);
//     formData.append("gstin", selectedCompanyLocal.gstin);
//     formData.append("phone_number", selectedCompanyLocal.phone_number || "");
//     formData.append("email", selectedCompanyLocal.email || "");

//     if (companyLogo) {
//       formData.append("company_image", companyLogo); // Append the image file directly
//     }

//     try {
//       const response = await invoice(formData);
//       if (response.status === 200 || response.data.status === 1) {
//         console.log("Company created successfully:", response);
//         setCompanies([...companies, { ...selectedCompanyLocal, id: response.data.company_id }]);
//         setIsAddingCompany(false);
//         setCompanyLogo(null); // Reset logo after save
//         setLogoPreview(null);
//       } else {
//         console.error("Failed to create company:", response.data.error || "Unknown error");
//       }
//     } catch (error) {
//       console.error("Error creating company:", error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md w-1/2 ml-10 ">
//       <h3 className="text-xl font-medium mb-4">Company Information</h3>
//       <div className="grid grid-cols-2 gap-6 mb-6">
//         {/* Upload Company Logo */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Upload Company Logo</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleLogoUpload}
//             className="p-2 mt-2 block w-full border rounded-lg text-lg"
//           />
//           {logoPreview && (
//             <div className="relative mt-3">
//               <img
//                 src={logoPreview}
//                 alt="Company Logo Preview"
//                 className="w-20 h-20 object-cover border border-gray-300 rounded-lg"
//               />
//               <button
//                 onClick={handleRemoveLogo}
//                 className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
//               >
//                 &#x2715;
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Company Name */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Company Name</label>
//           {isAddingCompany ? (
//             <input
//               type="text"
//               name="company_name"
//               placeholder="Enter Company Name"
//               value={selectedCompanyLocal.company_name || ''}
//               onChange={handleInputChange}
//               className="p-2 mt-2 block w-full border rounded-lg text-lg"
//             />
//           ) : (
//             <select
//               value={selectedCompanyLocal?.id || ''}
//               onChange={handleCompanyChange}
//               className="p-2 mt-2 block w-full border rounded-lg text-lg"
//             >
//               <option value="" disabled>
//                 Select a Company
//               </option>
//               {companies.map((company) => (
//                 <option key={company.id} value={company.id}>
//                   {company.company_name}
//                 </option>
//               ))}
//             </select>
//           )}
//           {errors?.companyName && <span className="text-red-500 text-sm">{errors.companyName}</span>}
//         </div>

//         {/* Company Address */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Address</label>
//           <input
//             type="text"
//             name="company_address"
//             placeholder="Enter Address"
//             value={selectedCompanyLocal.company_address || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.companyAddress && <span className="text-red-500 text-sm">{errors.companyAddress}</span>}
//         </div>

//         {/* GSTIN */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">GSTIN</label>
//           <input
//             type="text"
//             name="gstin"
//             placeholder="Enter GSTIN"
//             value={selectedCompanyLocal.gstin || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//           {errors?.companyGSTIN && <span className="text-red-500 text-sm">{errors.companyGSTIN}</span>}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Email</label>
//           <input
//             type="text"
//             name="email"
//             placeholder="Enter Email"
//             value={selectedCompanyLocal.email || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//         </div>

//         {/* Phone Number */}
//         <div>
//           <label className="block text-gray-600 text-lg font-bold">Mobile No</label>
//           <input
//             type="text"
//             name="phone_number"
//             placeholder="Enter mobile"
//             value={selectedCompanyLocal.phone_number || ''}
//             onChange={handleInputChange}
//             readOnly={!isAddingCompany}
//             className={`p-2 mt-2 block w-full border rounded-lg text-lg ${!isAddingCompany ? 'bg-gray-100' : ''}`}
//           />
//         </div>

//         {/* Add and Cancel Buttons */}
//         <div className="col-span-2 flex space-x-2">
//           {isAddingCompany && (
//             <button onClick={handleAddCompany} className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg mr-6">
//               Save Company
//             </button>
//           )}
//           <button
//             onClick={() => setIsAddingCompany(!isAddingCompany)}
//             className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg"
//           >
//             {isAddingCompany ? 'Cancel' : 'Add Company'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyInfo;
