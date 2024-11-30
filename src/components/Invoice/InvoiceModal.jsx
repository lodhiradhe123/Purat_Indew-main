
// import React from "react";
// import Modal from "react-modal"; // Import Modal from react-modal
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Import required icons


// const InvoiceModal = ({ isOpen, onClose }) => {
//     return (
//         <Modal
//             isOpen={isOpen}
//             onRequestClose={onClose}
//             contentLabel="Invoice Modal"
//             style={{
//                 overlay: {
//                     backgroundColor: 'rgba(0, 0, 0, 0.75)',
//                 },
//                 content: {
//                     width: '80%',
//                     margin: 'auto',
//                     padding: '20px',
//                 },
//             }}
//         >
//             <div>
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
//                 >
//                     Close
//                 </button>

//                 {/* Top Buttons: Edit, Download, and Email with Icons */}
//                 <div className="flex justify-end gap-4 mt-4">
//                     <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center">
//                         <FontAwesomeIcon icon={faEdit} className="mr-2" />
//                         Edit
//                     </button>
//                     <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
//                         <FontAwesomeIcon icon={faDownload} className="mr-2" />
//                         Download
//                     </button>
//                     <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
//                         <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
//                         Email
//                     </button>
//                 </div>

//                 {/* Invoice Structure */}
//                 <div className="mt-5">
//                     {/* Company Information and Customer Information */}
//                     <div className="flex ">
//                         {/* Customer Information (Left) */}
//                         {/* Company Information (Right) */}
//                         <div className="text-right ml-auto">
//                             <h4 className="font-bold">Company Name</h4>
//                             <p>Company Address</p>
//                             <p>GSTIN: Not provided</p>
//                         </div>
//                     </div>

//                     {/* Title: Invoice */}
//                     <div className="relative text-center my-8">
//                         <hr className="absolute left-0 top-1/2 w-2/5" />
//                         <h2 className="inline-block mx-4 text-2xl font-semibold">INVOICE</h2>
//                         <hr className="absolute right-0 top-1/2 w-2/5" />
//                     </div>

//                     {/* Invoice Details Table */}
//                     <div className="flex justify-between items-start gap-6">
//                         {/* Customer Information (Left) */}
//                         <div className="w-1/2">
//                             <h4 className="font-bold">Customer Name</h4>
//                             <p>Customer Address</p>
//                             <p>GSTIN: Not provided</p>
//                         </div>

//                         {/* Field and Value Table (Right) */}
//                         <table className="w-1/2 mt-2 border-collapse border border-gray-300">
//                             <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//                                 <tr>
//                                     <th className="py-2 px-4 border">Field</th>
//                                     <th className="py-2 px-4 border">Value</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <td className="py-2 px-4 border">Invoice ID</td>
//                                     <td className="py-2 px-4 border">IND/24-25/00148</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="py-2 px-4 border">Invoice Date</td>
//                                     <td className="py-2 px-4 border">N/A</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="py-2 px-4 border">Due Date</td>
//                                     <td className="py-2 px-4 border">N/A</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Products/Services Table */}
//                     <h4 className="mt-8 font-bold">Products/Services</h4>
//                     <table className="w-full border-collapse border border-gray-300 mt-2">
//                         <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//                             <tr>
//                                 <th className="py-2 px-4 border">Product</th>
//                                 <th className="py-2 px-4 border">Quantity</th>
//                                 <th className="py-2 px-4 border">Price</th>
//                                 <th className="py-2 px-4 border">Tax (%)</th>
//                                 <th className="py-2 px-4 border">Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td className="py-2 px-4 border">Product 1</td>
//                                 <td className="py-2 px-4 border">1</td>
//                                 <td className="py-2 px-4 border">0.00</td>
//                                 <td className="py-2 px-4 border">0</td>
//                                 <td className="py-2 px-4 border">0.00</td>
//                             </tr>
//                         </tbody>
//                     </table>

//                     {/* Totals Section */}
//                     <div className="text-right mt-5">
//                         <p>Subtotal: 0.00</p>
//                         <p>Tax: 0.00</p>
//                         <p>Discount: 0.00</p>
//                         <p className="font-bold">Total: 0.00</p>
//                     </div>

//                     {/* Client Notes */}
//                     <div className="mt-8">
//                         <h4 className="font-bold">Client Notes:</h4>
//                         <p>Thank you for your business.</p>
//                     </div>

//                     {/* Bottom Buttons: Edit, Download, and Email with Icons */}
//                     <div className="flex justify-end gap-4 mt-8">
//                         <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center">
//                             <FontAwesomeIcon icon={faEdit} className="mr-2" />
//                             Edit
//                         </button>
//                         <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
//                             <FontAwesomeIcon icon={faDownload} className="mr-2" />
//                             Download
//                         </button>
//                         <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
//                             <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
//                             Email
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </Modal>
//     );
// };

// export default InvoiceModal;



















// import React from "react";
// import Modal from "react-modal";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
//   const data = invoiceData?.data || {}; // Direct access to data fields

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Invoice Modal"
//       style={{
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.75)',
//         },
//         content: {
//           width: '80%',
//           margin: 'auto',
//           padding: '20px',
//         },
//       }}
//     >
//       <div>
//         <button
//           onClick={onClose}
//           className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
//         >
//           Close
//         </button>

//         <div className="flex justify-end gap-4 mt-4">
//           <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center">
//             <FontAwesomeIcon icon={faEdit} className="mr-2" />
//             Edit
//           </button>
//           <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
//             <FontAwesomeIcon icon={faDownload} className="mr-2" />
//             Download
//           </button>
//           <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
//             <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
//             Email
//           </button>
//         </div>

//         <div className="mt-5">
//           <div className="flex justify-between">
//             <div>
//               <h4 className="font-bold">Company Name: {data.company_name || "N/A"}</h4>
//               <p>Address: {data.company_address || "N/A"}</p>
//               <p>GSTIN: {data.gstin || "N/A"}</p>
//             </div>

//             <div className="text-right">
//               <h4 className="font-bold">Customer Name: {data.customer || "N/A"}</h4>
//               <p>Address: {data.user?.address || "N/A"}</p>
//               <p>GSTIN: {data.user?.gstin || "N/A"}</p>
//             </div>
//           </div>

//           <div className="relative text-center my-8">
//             <hr className="absolute left-0 top-1/2 w-2/5" />
//             <h2 className="inline-block mx-4 text-2xl font-semibold">INVOICE</h2>
//             <hr className="absolute right-0 top-1/2 w-2/5" />
//           </div>

        

//           <h4 className="mt-8 font-bold">Products/Services</h4>
//           <table className="w-full border-collapse border border-gray-300 mt-2">
//           <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//               <tr>
//                 <th className="py-2 px-4 border">Product</th>
//                 <th className="py-2 px-4 border">Quantity</th>
//                 <th className="py-2 px-4 border">Price</th>
//                 <th className="py-2 px-4 border">Tax (%)</th>
//                 <th className="py-2 px-4 border">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.products?.length > 0 ? (
//                 data.products.map((product, index) => (
//                   <tr key={index}>
//                     <td className="py-2 px-4 border">{product.products || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.quantity || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.price || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.tax || "N/A"}</td>
//                     <td className="py-2 px-4 border">
//                       {(product.price * product.quantity).toFixed(2) || "N/A"}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="py-2 px-4 border" colSpan="5">
//                     No Products Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           <div className="text-right mt-5">
//             <p>Subtotal: {data.sub_total || "0.00"}</p>
//             <p>Total Discount: {data.total_discount || "0.00"}</p>
//             <p className="font-bold">Payment Status: {data.payment_status || "N/A"}</p>
//           </div>

//           <div className="mt-8">
//             <h4 className="font-bold">Client Notes:</h4>
//             <p>{data.client_note || "N/A"}</p>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default InvoiceModal;






























// import React from "react";
// import Modal from "react-modal";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
//   const data = invoiceData?.data || {}; // Direct access to data fields

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Invoice Modal"
//       style={{
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.75)',
//         },
//         content: {
//           width: '80%',
//           margin: 'auto',
//           padding: '20px',
//         },
//       }}
//     >
//       <div>
//         <button
//           onClick={onClose}
//           className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
//         >
//           Close
//         </button>

//         {/* Top Buttons: Edit, Download, and Email with Icons */}
//         <div className="flex justify-end gap-4 mt-4">
//           <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center">
//             <FontAwesomeIcon icon={faEdit} className="mr-2" />
//             Edit
//           </button>
//           <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
//             <FontAwesomeIcon icon={faDownload} className="mr-2" />
//             Download
//           </button>
//           <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
//             <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
//             Email
//           </button>
//         </div>

//         <div className="mt-5">
//           <div>
//             {/* Company Information */}
//             <div>
//               <h4 className="font-bold text-right ml-auto">Company Name: {data.company?.company_name || "N/A"}</h4>
//               <p>Address: {data.company?.company_address || "N/A"}</p>
//               <p>GSTIN: {data.company?.gstin || "N/A"}</p>
//             </div>
//           </div>

//           {/* Invoice Title */}
//           <div className="relative text-center my-8">
//             <hr className="absolute left-0 top-1/2 w-2/5" />
//             <h2 className="inline-block mx-4 text-2xl font-semibold">INVOICE</h2>
//             <hr className="absolute right-0 top-1/2 w-2/5" />
//           </div>

//           {/* Customer and Invoice Details Side by Side */}
//           <div className="flex justify-between items-start gap-6">
//             {/* Customer Information */}
//             <div className="w-1/2">
//               <h4 className="font-bold">Customer Name: {data.user?.customer || "N/A"}</h4>
//               <p>Address: {data.user?.address || "N/A"}</p>
//               <p>GSTIN: {data.user?.gstin || "N/A"}</p>
//             </div>

//             {/* Invoice Details Table */}
//             <table className="w-1/2 mt-2 border-collapse border border-gray-300">
//               <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//                 <tr>
//                   <th className="py-2 px-4 border">Field</th>
//                   <th className="py-2 px-4 border">Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="py-2 px-4 border">Invoice ID</td>
//                   <td className="py-2 px-4 border">{data.id || "N/A"}</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2 px-4 border">Billing Date</td>
//                   <td className="py-2 px-4 border">{data.billing_date || "N/A"}</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2 px-4 border">Due Date</td>
//                   <td className="py-2 px-4 border">{data.due_date || "N/A"}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Products/Services Table */}
//           <h4 className="mt-8 font-bold">Products/Services</h4>
//           <table className="w-full border-collapse border border-gray-300 mt-2">
//             <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//               <tr>
//                 <th className="py-2 px-4 border">Product</th>
//                 <th className="py-2 px-4 border">Quantity</th>
//                 <th className="py-2 px-4 border">Price</th>
//                 <th className="py-2 px-4 border">Tax (%)</th>
//                 <th className="py-2 px-4 border">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.products?.length > 0 ? (
//                 data.products.map((product, index) => (
//                   <tr key={index}>
//                     <td className="py-2 px-4 border">{product.products || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.quantity || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.price || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.tax || "N/A"}</td>
//                     <td className="py-2 px-4 border">
//                       {(product.price * product.quantity).toFixed(2) || "N/A"}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="py-2 px-4 border" colSpan="5">
//                     No Products Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Invoice Summary */}
//           <div className="text-right mt-5">
//             <p>Subtotal: {data.sub_total || "0.00"}</p>
//             <p>Total Discount: {data.total_discount || "0.00"}</p>
//             <p className="font-bold">Payment Status: {data.payment_status || "N/A"}</p>
//           </div>

//           {/* Client Notes */}
//           <div className="mt-8">
//             <h4 className="font-bold">Client Notes:</h4>
//             <p>{data.client_note || "N/A"}</p>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default InvoiceModal;







// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';


// const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
//     const navigate = useNavigate();
//   const data = invoiceData?.data || {}; // Direct access to data fields
//   const handleEdit = () => {
//     // navigate("/addinvoice", { state: { invoiceData: data } }); // Navigate to AddInvoice with the invoice data
//     navigate(`/addinvoice/${invoiceData?.data?.id}`);
//   };
//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Invoice Modal"
//       style={{
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.75)',
//         },
//         content: {
//           width: '80%',
//           margin: 'auto',
//           padding: '20px',
//         },
//       }}
//     >
//       <div>
//         <button
//           onClick={onClose}
//           className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
//         >
//           Close
//         </button>

//         {/* Top Buttons: Edit, Download, and Email with Icons */}
//         <div className="flex justify-end gap-4 mt-4">
//           <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center" onClick={handleEdit}>
//             <FontAwesomeIcon icon={faEdit} className="mr-2" />
//             Edit
//           </button>
//           <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
//             <FontAwesomeIcon icon={faDownload} className="mr-2" />
//             Download
//           </button>
//           <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
//             <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
//             Email
//           </button>
//         </div>

//         <div className="mt-5">
//           <div className="flex justify-between">
//             {/* Customer Information (Left) */}
         

//             {/* Company Information (Right) */}
//             <div className="text-right ml-auto">
//               <h4 className="font-bold">Company Name: {data.company?.company_name || "N/A"}</h4>
//               <p>Address: {data.company?.company_address || "N/A"}</p>
//               <p>GSTIN: {data.company?.gstin || "N/A"}</p>
//             </div>
//           </div>

//           {/* Invoice Title */}
//           <div className="relative text-center my-8">
//             <hr className="absolute left-0 top-1/2 w-2/5" />
//             <h2 className="inline-block mx- text-2xl font-bold">INVOICE</h2>

//             <hr className="absolute right-0 top-1/2 w-2/5" />
//           </div>

//           {/* Customer and Invoice Details Side by Side */}
//           <div className="flex justify-between items-start gap-6">
//             {/* Customer Information */}
//             <div className="w-1/2">
//               <h4 className="font-bold">Customer Name: {data.user?.customer || "N/A"}</h4>
//               <p>Address: {data.user?.address || "N/A"}</p>
//               <p>GSTIN: {data.user?.gstin || "N/A"}</p>
//             </div>

//             {/* Invoice Details Table */}
//             <table className="w-1/2 mt-2 border-collapse border border-gray-300">
//               <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//                 <tr>
//                   <th className="py-2 px-4 border">Field</th>
//                   <th className="py-2 px-4 border">Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="py-2 px-4 border">Invoice ID</td>
//                   <td className="py-2 px-4 border">{data.id || "N/A"}</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2 px-4 border">Billing Date</td>
//                   <td className="py-2 px-4 border">{data.billing_date || "N/A"}</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2 px-4 border">Due Date</td>
//                   <td className="py-2 px-4 border">{data.due_date || "N/A"}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Products/Services Table */}
//           <h4 className="mt-8 font-bold">Products/Services</h4>
//           <table className="w-full border-collapse border border-gray-300 mt-2">
//             <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//               <tr>
//                 <th className="py-2 px-4 border">Product</th>
//                 <th className="py-2 px-4 border">Quantity</th>
//                 <th className="py-2 px-4 border">Price</th>
//                 <th className="py-2 px-4 border">Tax (%)</th>
//                 <th className="py-2 px-4 border">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.products?.length > 0 ? (
//                 data.products.map((product, index) => (
//                   <tr key={index}>
//                     <td className="py-2 px-4 border">{product.products || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.quantity || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.price || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.tax || "N/A"}</td>
//                     <td className="py-2 px-4 border">
//                       {(product.price * product.quantity).toFixed(2) || "N/A"}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="py-2 px-4 border" colSpan="5">
//                     No Products Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Invoice Summary */}
//           <div className="text-right mt-5">
//             <p>Subtotal: {data.sub_total || "0.00"}</p>
//             <p>Total Discount: {data.total_discount || "0.00"}</p>
//             <p className="font-bold">Payment Status: {data.payment_status || "N/A"}</p>
//           </div>

//           {/* Client Notes */}
//           <div className="mt-8">
//             <h4 className="font-bold">Client Notes:</h4>
//             <p>{data.client_note || "N/A"}</p>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default InvoiceModal;






















// import React from "react";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Modal from "react-modal";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';


// const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
//     const navigate = useNavigate();
//   const data = invoiceData?.data || {}; // Direct access to data fields
//   // const handleEdit = () => {
//   //   navigate("/addinvoice", { state: { invoiceData: data } });
//   //   // Navigate to AddInvoice with the invoice data
   
//   // };



//   // const handleEdit = () => {
//   //   const invoiceToPass = {
//   //     ...data, // Spread the existing data fields
//   //     company: data.company || {}, // Ensure company info is included
//   //     user: data.user || {},       // Ensure user (customer) info is included
//   //   };
    
//   //   navigate("/addinvoice", { state: { invoiceData: invoiceToPass } });
//   // };




// console.log("company", data.company);
// console.log("customer", data.user);
// console.log("products", data.products);



//   // Handle Edit Button Click - Navigate to AddInvoice with data
// const handleEdit = () => {
//   navigate("/addinvoice",  { 
//       state: { 
//           invoiceData: data,         // Pass full invoice data
//           companyData: data.company  , // Pass company data
//           customerData: data.user,   // Pass customer data
//           productsData: data.products // Pass products data
//       } 
//   });
// };

  
//   return (
//     <Modal 
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Invoice Modal"
//       style={{
//         overlay: {
//           backgroundColor: 'rgba(0, 0, 0, 0.75)',
//         },
//         content: {
//           width: '80%',
//           margin: 'auto',
//           padding: '20px',
//         },
//       }}
//     >
//       <div>
//         <button
//           onClick={onClose}
//           className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
//         >
//           Close
//         </button>

//         {/* Top Buttons: Edit, Download, and Email with Icons */}
//         <div className="flex justify-end gap-4 mt-4">
          
//           <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
//             <FontAwesomeIcon icon={faDownload} className="mr-2" />
//             Download
//             </button>
            
//             <button onClick={handleEdit} className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center">
//              <FontAwesomeIcon icon={faEdit} className="mr-2" />
//            Edit
//               </button>

        
//           <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
//             <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
//             Email
//           </button>
//         </div>

//         <div className="mt-5">
//           <div className="flex justify-between">
//             {/* Customer Information (Left) */}
         

//             {/* Company Information (Right) */}
//             <div className="text-right ml-auto">
//               <h4 className="font-bold">Company Name: {data.company?.company_name  || "N/A"}</h4>
//               <p>Address: {data.company?.company_address || "N/A"}</p>
//               <p>GSTIN: {data.company?.gstin || "N/A"}</p>
//             </div>
//           </div>

//           {/* Invoice Title */}
//           <div className="relative text-center mb-2">
           
//             <h2 className="inline-block  text-2xl font-bold">INVOICE</h2>

            
//           </div>

//           {/* Customer and Invoice Details Side by Side */}
//           <div className="flex justify-between items-start gap-6">
//             {/* Customer Information */}
//             <div className="w-1/2">
//               <h4 className="font-bold">Customer Name: {data.user?.customer || "N/A"}</h4>
//               <p>Address: {data.user?.address || "N/A"}</p>
//               <p>GSTIN: {data.user?.gstin || "N/A"}</p>
//             </div>

//             {/* Invoice Details Table */}
//             <table className="w-1/2 mt-2 border-collapse border border-gray-300">
//               <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//                 <tr>
//                   <th className="py-2 px-4 border">Field</th>
//                   <th className="py-2 px-4 border">Value</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="py-2 px-4 border">Invoice ID</td>
//                   <td className="py-2 px-4 border">{data.id || "N/A"}</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2 px-4 border">Billing Date</td>
//                   <td className="py-2 px-4 border">{data.billing_date || "N/A"}</td>
//                 </tr>
//                 <tr>
//                   <td className="py-2 px-4 border">Due Date</td>
//                   <td className="py-2 px-4 border">{data.due_date || "N/A"}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Products/Services Table */}
//           <h4 className="mt-8 font-bold">Products/Services</h4>
//           <table className="w-full border-collapse border border-gray-300 mt-2">
//             <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//               <tr>
//                 <th className="py-2 px-4 border">Product</th>
//                 <th className="py-2 px-4 border">Quantity</th>
//                 <th className="py-2 px-4 border">Price</th>
//                 <th className="py-2 px-4 border">Tax (%)</th>
//                 <th className="py-2 px-4 border">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.products?.length > 0 ? (
//                 data.products.map((products, index) => (
//                   <tr key={index}>
//                     <td className="py-2 px-4 border">{products.products || "N/A"}</td>
//                     <td className="py-2 px-4 border">{products.quantity || "N/A"}</td>
//                     <td className="py-2 px-4 border">{products.price || "N/A"}</td>
//                     <td className="py-2 px-4 border">{products.tax || "N/A"}</td>
//                     <td className="py-2 px-4 border">
//                       {(products.price * products.quantity).toFixed(2) || "N/A"}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="py-2 px-4 border" colSpan="5">
//                     No Products Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Invoice Summary */}
//           <div className="text-right mt-5">
//             <p>Subtotal: {data.sub_total || "0.00"}</p>
//             <p>Total Discount: {data.total_discount || "0.00"}</p>
//             <p className="font-bold">Payment Status: {data.payment_status || "N/A"}</p>
//           </div>

//           {/* Client Notes */}
//           <div className="mt-8">
//             <h4 className="font-bold">Client Notes:</h4>
//             <p>{data.client_note || "N/A"}</p>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default InvoiceModal;






// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import ReactDOM from "react-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
//   const navigate = useNavigate();
//   const data = invoiceData?.data || {}; // Access invoice data

//   // Handle Edit Button Click - Navigate to AddInvoice with data
//   const handleEdit = () => {
//     navigate("/addinvoice", {
//       state: {
//         invoiceData: data,         // Pass full invoice data
//         companyData: data.company, // Pass company data
//         customerData: data.user,   // Pass customer data
//         productsData: data.products // Pass products data
//       }
//     });
//   };

//   // Close modal on "Escape" key press
//   useEffect(() => {
//     const handleEscape = (event) => {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, [onClose]);

//   // Prevent body scroll when the modal is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpen]);

//   return ReactDOM.createPortal(
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
//         >
//           <motion.div
//             onClick={onClose}
//             initial={{ backdropFilter: "blur(0px)" }}
//             animate={{ backdropFilter: "blur(5px)" }}
//             exit={{ backdropFilter: "blur(0px)" }}
//             transition={{ duration: 0.3 }}
//             className="absolute inset-0"
//           />

//           <motion.div
//             onClick={(e) => e.stopPropagation()}
//             initial={{ scale: 0.9, y: 20 }}
//             animate={{ scale: 1, y: 0 }}
//             exit={{ scale: 0.9, y: 20 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="relative bg-white rounded-xl w-full max-w-7xl mx-4 p-6 shadow-2xl"
//             style={{ maxHeight: "100vh", overflowY: "auto" }}
//           >
//             {/* Close button */}
//             <button
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
//               onClick={onClose}
//               aria-label="Close Modal"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             {/* Modal Content */}
//             <div id="modal-title" className="text-gray-800">
//               <div className="flex justify-end gap-4 mt-14">
//                 <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
//                   <FontAwesomeIcon icon={faDownload} className="mr-2" />
//                   Download
//                 </button>

//                 <button onClick={handleEdit} className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center">
//                   <FontAwesomeIcon icon={faEdit} className="mr-2" />
//                   Edit
//                 </button>

//                 <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
//                   <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
//                   Email
//                 </button>
//               </div>

//               {/* Invoice Details */}
//               <div className="mt-5">
//                 <div className="flex justify-between">
//                   {/* Company Information */}
//                   <div className="text-right ml-auto">
//                     <h4 className="font-bold">Company Name: {data.company?.company_name || "N/A"}</h4>
//                     <p>Address: {data.company?.company_address || "N/A"}</p>
//                     <p>GSTIN: {data.company?.gstin || "N/A"}</p>
//                   </div>
//                 </div>

//                 {/* Invoice Title */}
//                 <div className="relative text-center mb-2  ">
//                   <h2 className="inline-block text-2xl font-bold ">INVOICE</h2>
//                 </div>

//                 {/* Customer & Invoice Details */}
//                 <div className="flex justify-between items-start gap-6">
//                   <div className="w-1/2">
//                     <h4 className="font-bold">Customer Name: {data.user?.customer || "N/A"}</h4>
//                     <p>Address: {data.user?.address || "N/A"}</p>
//                     <p>GSTIN: {data.user?.gstin || "N/A"}</p>
//                   </div>
//                   <table className="w-1/2 mt-2 border-collapse border border-gray-300">
//                     <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//                       <tr>
//                         <th className="py-2 px-4 border">Field</th>
//                         <th className="py-2 px-4 border">Value</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td className="py-2 px-4 border">Invoice ID</td>
//                         <td className="py-2 px-4 border">{data.id || "N/A"}</td>
//                       </tr>
//                       <tr>
//                         <td className="py-2 px-4 border">Billing Date</td>
//                         <td className="py-2 px-4 border">{data.billing_date || "N/A"}</td>
//                       </tr>
//                       <tr>
//                         <td className="py-2 px-4 border">Due Date</td>
//                         <td className="py-2 px-4 border">{data.due_date || "N/A"}</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Products Table */}
//                 <h4 className="mt-8 font-bold">Products/Services</h4>
//                 <table className="w-full border-collapse border border-gray-300 mt-2">
//                   <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//                     <tr>
//                       <th className="py-2 px-4 border">Product</th>
//                       <th className="py-2 px-4 border">Quantity</th>
//                       <th className="py-2 px-4 border">Price</th>
//                       <th className="py-2 px-4 border">Tax (%)</th>
//                       <th className="py-2 px-4 border">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {data.products?.length > 0 ? (
//                       data.products.map((products, index) => (
//                         <tr key={index}>
//                           <td className="py-2 px-4 border">{products.products || "N/A"}</td>
//                           <td className="py-2 px-4 border">{products.quantity || "N/A"}</td>
//                           <td className="py-2 px-4 border">{products.price || "N/A"}</td>
//                           <td className="py-2 px-4 border">{products.tax || "N/A"}</td>
//                           <td className="py-2 px-4 border">{(products.price * products.quantity).toFixed(2) || "N/A"}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td className="py-2 px-4 border" colSpan="5">No Products Available</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>

//                 {/* Invoice Summary */}
//                 <div className="text-right mt-5">
//                   <p>Subtotal: {data.sub_total || "0.00"}</p>
//                   <p>Total Discount: {data.total_discount || "0.00"}</p>
//                   <p className="font-bold">Payment Status: {data.payment_status || "N/A"}</p>
//                 </div>

//                 {/* Client Notes */}
//                 <div className="mt-8">
//                   <h4 className="font-bold">Client Notes:</h4>
//                   <p>{data.client_note || "N/A"}</p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>,
//     document.body
//   );
// };

// export default InvoiceModal;



import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
  const navigate = useNavigate();
  const data = invoiceData?.data || {}; // Access invoice data

  // Handle Edit Button Click - Navigate to AddInvoice with data
  const handleEdit = () => {
    navigate("/addinvoice", {
      state: {
        invoiceData: data,         // Pass full invoice data
        companyData: data.company, // Pass company data
        customerData: data.user,   // Pass customer data
        productsData: data.products // Pass products data
      }
    });
  };

  // Close modal on "Escape" key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Prevent body scroll when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            onClick={onClose}
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(5px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          />

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-xl w-full max-w-7xl mx-4 p-6 shadow-2xl"
            style={{ maxHeight: "100vh", overflowY: "auto" }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={onClose}
              aria-label="Close Modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div id="modal-title" className="text-gray-800">
              <div className="flex justify-end gap-4 mt-14">
                <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download
                </button>

                <button onClick={handleEdit} className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center">
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </button>

                <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Email
                </button>
              </div>

              {/* Invoice Details */}
              <div className="mt-5">
                <div className="flex justify-between">
                  {/* Company Information */}
                  <div className="text-right ml-auto">
                    <h4 className="font-bold">Company Name: {data.company?.company_name || "N/A"}</h4>
                    <p>Address: {data.company?.company_address || "N/A"}</p>
                    <p>GSTIN: {data.company?.gstin || "N/A"}</p>
                  </div>
                </div>

                {/* Invoice Title */}
                <div className="relative text-center mb-2  ">
                  <h2 className="inline-block text-2xl font-bold ">INVOICE</h2>
                </div>

                {/* Customer & Invoice Details */}
                <div className="flex justify-between items-start gap-6">
                  <div className="w-1/2">
                    <h4 className="font-bold">Customer Name: {data.user?.customer || "N/A"}</h4>
                    <p>Address: {data.user?.address || "N/A"}</p>
                    <p>GSTIN: {data.user?.gstin || "N/A"}</p>
                  </div>
                  <table className="w-1/2 mt-2 border-collapse border border-gray-300">
                    <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
                      <tr>
                        <th className="py-2 px-4 border">Field</th>
                        <th className="py-2 px-4 border">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border">Invoice ID</td>
                        <td className="py-2 px-4 border">{data.id || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border">Billing Date</td>
                        <td className="py-2 px-4 border">{data.billing_date || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border">Due Date</td>
                        <td className="py-2 px-4 border">{data.due_date || "N/A"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Products Table */}
                <h4 className="mt-8 font-bold">Products/Services</h4>
                <table className="w-full border-collapse border border-gray-300 mt-2">
                  <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
                    <tr>
                      <th className="py-2 px-4 border">Product</th>
                      <th className="py-2 px-4 border">Quantity</th>
                      <th className="py-2 px-4 border">Price</th>
                      <th className="py-2 px-4 border">Tax (%)</th>
                      <th className="py-2 px-4 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products?.length > 0 ? (
                      data.products.map((products, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4 border">{products.products || "N/A"}</td>
                          <td className="py-2 px-4 border">{products.quantity || "N/A"}</td>
                          <td className="py-2 px-4 border">{products.price || "N/A"}</td>
                          <td className="py-2 px-4 border">{products.itemTotalTax  || "N/A"}</td>
                          <td className="py-2 px-4 border">{(products.price * products.quantity).toFixed(2) || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2 px-4 border" colSpan="5">No Products Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Invoice Summary */}
                <div className="text-right mt-5">
                  <p>Subtotal: {data.sub_total || "0.00"}</p>
                  <p>Total Discount: {data.total_discount || "0.00"}</p>
                  <p className="font-bold">Payment Status: {data.payment_status || "N/A"}</p>
                </div>

                {/* Client Notes */}
                <div className="mt-8">
                  <h4 className="font-bold">Client Notes:</h4>
                  <p>{data.client_note || "N/A"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default InvoiceModal;















































// import React from "react";
// import Modal from "react-modal";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from "react-router-dom";

// const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
//   const data = invoiceData?.data || {};
//   const navigate = useNavigate();

//   // Handle Edit Button Click - Navigate to AddInvoice with data
//   const handleEdit = () => {
//     navigate("/addinvoice", { state: { invoiceData: data } }); // Pass invoice data via state
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Invoice Modal"
//       style={{
//         overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
//         content: { width: '80%', margin: 'auto', padding: '20px' }
//       }}
//     >
//       <div>
//         <button onClick={onClose} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Close</button>
        
//         {/* Top Buttons */}
//         <div className="flex justify-end gap-4 mt-4">
//           <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center" onClick={handleEdit}>
//             <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit
//           </button>
//           <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
//             <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download
//           </button>
//           <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
//             <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Email
//           </button>
//         </div>

//         {/* Invoice Details */}
//         {/* Company and Customer Information */}
//         <div className="mt-5">
//           <div className="flex justify-between">
//             <div>
//               <h4 className="font-bold">Company Name: {data.company?.company_name || "N/A"}</h4>
//               <p>Address: {data.company?.company_address || "N/A"}</p>
//               <p>GSTIN: {data.company?.gstin || "N/A"}</p>
//             </div>
//             <div>
//               <h4 className="font-bold text-right ml-auto">Customer Name: {data.user?.customer || "N/A"}</h4>
//               <p>Address: {data.user?.address || "N/A"}</p>
//               <p>GSTIN: {data.user?.gstin || "N/A"}</p>
//             </div>
//           </div>
          
//           {/* Product/Service Table */}
//           <h4 className="mt-8 font-bold">Products/Services</h4>
//           <table className="w-full border-collapse border border-gray-300 mt-2">
//             <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//               <tr>
//                 <th className="py-2 px-4 border">Product</th>
//                 <th className="py-2 px-4 border">Quantity</th>
//                 <th className="py-2 px-4 border">Price</th>
//                 <th className="py-2 px-4 border">Tax (%)</th>
//                 <th className="py-2 px-4 border">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.products?.length > 0 ? (
//                 data.products.map((product, index) => (
//                   <tr key={index}>
//                     <td className="py-2 px-4 border">{product.products || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.quantity || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.price || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.tax || "N/A"}</td>
//                     <td className="py-2 px-4 border">{(product.price * product.quantity).toFixed(2) || "N/A"}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="py-2 px-4 border" colSpan="5">No Products Available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           <div className="text-right mt-5">
//             <p>Subtotal: {data.sub_total || "0.00"}</p>
//             <p>Total Discount: {data.total_discount || "0.00"}</p>
//             <p className="font-bold">Payment Status: {data.payment_status || "N/A"}</p>
//           </div>

//           <div className="mt-8">
//             <h4 className="font-bold">Client Notes:</h4>
//             <p>{data.client_note || "N/A"}</p>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default InvoiceModal;


















// import React from "react";
// import Modal from "react-modal";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import { useNavigate } from "react-router-dom";

// const InvoiceModal = ({ isOpen, onClose, invoiceData }) => {
//   const data = invoiceData?.data || {};
//   const navigate = useNavigate();

//   // Handle Edit Button Click - Navigate to AddInvoice with data
//   const handleEdit = () => {
//     navigate("/addinvoice", { state: { invoiceData: data } }); // Pass invoice data via state
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Invoice Modal"
//       style={{
//         overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
//         content: { width: '80%', margin: 'auto', padding: '20px' }
//       }}
//     >
//       <div>
//         <button onClick={onClose} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Close</button>
        
//         {/* Top Buttons */}
//         <div className="flex justify-end gap-4 mt-4">
//           <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 flex items-center" onClick={handleEdit}>
//             <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit
//           </button>
//           <button className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 flex items-center">
//             <FontAwesomeIcon icon={faDownload} className="mr-2" /> Download
//           </button>
//           <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 flex items-center">
//             <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Email
//           </button>
//         </div>

//         {/* Invoice Details */}
//         {/* Company and Customer Information */}
//         <div className="mt-5">
//           <div className="flex justify-between">
//             {/* Company Information */}
//             <div>
//               <h4 className="font-bold">Company Information:</h4>
//               <p>Company Name: {data.company?.company_name || "N/A"}</p>
//               <p>Address: {data.company?.company_address || "N/A"}</p>
//               <p>GSTIN: {data.company?.gstin || "N/A"}</p>
//               <p>Email: {data.company?.email || "N/A"}</p>
//               <p>Phone: {data.company?.phone_number || "N/A"}</p>
//             </div>

//             {/* Customer Information */}
//             <div>
//               <h4 className="font-bold text-right ml-auto">Customer Information:</h4>
//               <p>Customer Name: {data.user?.customer || "N/A"}</p>
//               <p>Address: {data.user?.address || "N/A"}</p>
//               <p>GSTIN: {data.user?.gstin || "N/A"}</p>
//               <p>Email: {data.user?.email || "N/A"}</p>
//               <p>Phone: {data.user?.phone || "N/A"}</p>
//             </div>
//           </div>

//           {/* Product/Service Table */}
//           <h4 className="mt-8 font-bold">Products/Services</h4>
//           <table className="w-full border-collapse border border-gray-300 mt-2">
//             <thead style={{ backgroundColor: 'rgb(26, 189, 156)', color: 'white' }}>
//               <tr>
//                 <th className="py-2 px-4 border">Product</th>
//                 <th className="py-2 px-4 border">Quantity</th>
//                 <th className="py-2 px-4 border">Price</th>
//                 <th className="py-2 px-4 border">Tax (%)</th>
//                 <th className="py-2 px-4 border">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.products?.length > 0 ? (
//                 data.products.map((product, index) => (
//                   <tr key={index}>
//                     <td className="py-2 px-4 border">{product.products || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.quantity || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.price || "N/A"}</td>
//                     <td className="py-2 px-4 border">{product.tax || "N/A"}</td>
//                     <td className="py-2 px-4 border">{(product.price * product.quantity).toFixed(2) || "N/A"}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="py-2 px-4 border" colSpan="5">No Products Available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Subtotal, Discount, and Payment Status */}
//           <div className="text-right mt-5">
//             <p>Subtotal: {data.sub_total || "0.00"}</p>
//             <p>Total Discount: {data.total_discount || "0.00"}</p>
//             <p className="font-bold">Payment Status: {data.payment_status || "N/A"}</p>
//           </div>

//           {/* Client Notes */}
//           <div className="mt-8">
//             <h4 className="font-bold">Client Notes:</h4>
//             <p>{data.client_note || "N/A"}</p>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default InvoiceModal;



































































































