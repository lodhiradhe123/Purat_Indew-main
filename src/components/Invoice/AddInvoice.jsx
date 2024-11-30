// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { invoicefull } from "../../services/api";
// import CompanyInfo from "./CompanyInfo";
// import CustomerInfo from "./CustomerInfo";
// import ProductsAndServices from "./ProductsAndServices";
// import BillingInfo from "./BillingInfo";
// import TermsAndConditions from "./TermsAndConditions";
// import DownloadInvoice from "./DownloadInvoice";

// const AddInvoice = ({ user }) => {
//     const navigate = useNavigate();

//     const [invoiceID, setInvoiceID] = useState("IND/24-25/00148");
//     const [billingDate, setBillingDate] = useState("");
//     const [dueDate, setDueDate] = useState("");
//     const [status, setStatus] = useState("");
//     const [clientNote, setClientNote] = useState("Thank you for your business");
//     const [terms, setTerms] = useState(
//         "Note: This is a system-generated invoice and does not require a signature"
//     );
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [selectedCustomer, setSelectedCustomer] = useState(null);
//     const [items, setItems] = useState([
//         { description: "", quantity: 1, price: 0, tax: 0, total: 0 },
//     ]);
//     const [subtotal, setSubtotal] = useState(0);
//     const [totalTax, setTotalTax] = useState(0);
//     const [discount, setDiscount] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [errors, setErrors] = useState({});
//     const [viewInvoiceDetail, setViewInvoiceDetail] = useState(false); // Track whether to show the invoice details

//     const calculateTotals = (items, discountValue) => {
//         let subtotal = 0;
//         let totalTax = 0;
//         items.forEach((item) => {
//             subtotal += item.quantity * item.price;
//             totalTax += item.quantity * item.price * (item.tax / 100);
//         });
//         setSubtotal(subtotal);
//         setTotalTax(totalTax);
//         setTotal(subtotal + totalTax - discountValue);
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!selectedCompany || !selectedCompany.name)
//             newErrors.companyName = "Company Name is required";
//         if (!selectedCompany || !selectedCompany.address)
//             newErrors.companyAddress = "Company Address is required";
//         if (!selectedCompany || !selectedCompany.gstin)
//             newErrors.companyGSTIN = "GSTIN is required";
//         if (!selectedCustomer || !selectedCustomer.name)
//             newErrors.customerName = "Customer Name is required";
//         if (!selectedCustomer || !selectedCustomer.address)
//             newErrors.customerAddress = "Customer Address is required";
//         if (!selectedCustomer || !selectedCustomer.gstin)
//             newErrors.customerGSTIN = "Customer GSTIN is required";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSaveInvoice = async () => {
//         const products = items.map((item) => ({
//             action: item.product_id ? "update" : "create",
//             product_id: item.product_id || null,
//             products: item.description,
//             quantity: item.quantity,
//             price: item.price,
//             tax: item.tax,
//         }));

//         const payload = {
//             action: "create",
//             invoice_id: parseInt(invoiceID, 10) || null,
//             company_id: selectedCompany?.id,
//             user_id: selectedCustomer?.id || null,
//             username: user || "defaultUsername",
//             invoice_no: `INV-${invoiceID}`,
//             txn_id: `TXN-${invoiceID}`,
//             sub_total: subtotal,
//             total_tax: totalTax,
//             total_discount: discount,
//             billing_date: billingDate,
//             due_date: dueDate,
//             client_note: clientNote,
//             termsncondition: terms,
//             gstin: selectedCompany?.gstin,
//             products: products,
//             credits: 0,
//             rate: 1.0,
//             payment_gross: subtotal + totalTax - discount,
//             mc_currency: "null",
//             payment_date: billingDate,
//             items_detail: JSON.stringify(products), // Include items_detail as a JSON string
//             currency_code: "null",
//             address_country_code: "null",
//         };

//         try {
//             const response = await invoicefull(payload);
//             console.log("Invoice created successfully:", response.data);
//         } catch (error) {
//             console.error(
//                 "Error creating invoice:",
//                 error.response?.data || error.message
//             );
//         }
//     };

//     return (
//         <div>
//             <div className="flex justify-between items-center bg-gray-100 p-3 mb-8 shadow-md mt-0 ">
//                 <h1 className="text-xl font-semibold"> + Add New Invoice</h1>
//                 <button
//                     onClick={() => navigate("/InvoiceList")} // Use navigate to move to Invoice List
//                     className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
//                 >
//                     Invoice List
//                 </button>
//             </div>

//             <div className="add-invoice-page p-4 bg-white rounded-lg shadow-md">
//                 <div className="flex space-x-28 mb-10">
//                     <CompanyInfo
//                         user={user}
//                         setSelectedCompany={setSelectedCompany}
//                     />
//                     <CustomerInfo
//                         user={user}
//                         setSelectedCustomer={setSelectedCustomer}
//                     />
//                 </div>
//                 <BillingInfo
//                     invoiceID={invoiceID}
//                     setInvoiceID={setInvoiceID}
//                     billingDate={billingDate}
//                     setBillingDate={setBillingDate}
//                     dueDate={dueDate}
//                     setDueDate={setDueDate}
//                     status={status}
//                     setStatus={setStatus}
//                 />
//                 <ProductsAndServices
//                     items={items}
//                     setItems={setItems}
//                     subtotal={subtotal}
//                     totalTax={totalTax}
//                     discount={discount}
//                     setDiscount={setDiscount}
//                     total={total}
//                     calculateTotals={calculateTotals}
//                 />
//                 <TermsAndConditions
//                     clientNote={clientNote}
//                     setClientNote={setClientNote}
//                     terms={terms}
//                     setTerms={setTerms}
//                 />
//                 <div className="flex justify-end mt-4">
//                     <button
//                         className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
//                         onClick={handleSaveInvoice}
//                     >
//                         Save Invoice
//                     </button>

//                     <DownloadInvoice
//                         invoiceData={{
//                             id: invoiceID,
//                             date: billingDate,
//                             dueDate,
//                             subtotal,
//                             tax: totalTax,
//                             discount,
//                             total,
//                             clientNote,
//                         }}
//                         companyData={selectedCompany || {}}
//                         customerData={selectedCustomer || {}}
//                         items={items}
//                         status={status}
//                     />
//                 </div>
//                 {/* Conditionally Render InvoiceDetail */}

//             </div>
//         </div>
//     );
// };

// export default AddInvoice;

// import { useState } from "react";

// import { invoicefull } from "../../services/api";
// import CompanyInfo from "./CompanyInfo";
// import CustomerInfo from "./CustomerInfo";
// import ProductsAndServices from "./ProductsAndServices";
// import BillingInfo from "./BillingInfo";
// import TermsAndConditions from "./TermsAndConditions";
// import DownloadInvoice from "./DownloadInvoice";
// import { useNavigate, useLocation } from "react-router-dom";

// const AddInvoice = ({ user }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
// //   const invoiceData = state?.invoiceData;
// const { invoiceData, companyData, customerData, productsData } = location.state || {}; // Ensure fallback

//     const [invoiceID, setInvoiceID] = useState("IND/24-25/00148");
//     const [billingDate, setBillingDate] = useState("");
//     const [dueDate, setDueDate] = useState("");
//     const [status, setStatus] = useState("");
//     const [clientNote, setClientNote] = useState("Thank you for your business");
//     const [terms, setTerms] = useState(
//         "Note: This is a system-generated invoice and does not require a signature"
//     );
//     const [selectedCompany, setSelectedCompany] = useState(null);
//     const [selectedCustomer, setSelectedCustomer] = useState(null);
//     const [items, setItems] = useState([
//         { description: "", quantity: 1, price: 0, tax: 0, total: 0 },
//     ]);
//     const [subtotal, setSubtotal] = useState(0);
//     const [totalTax, setTotalTax] = useState(0);
//     const [discount, setDiscount] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [errors, setErrors] = useState({});
//     const [viewInvoiceDetail, setViewInvoiceDetail] = useState(false); // Track whether to show the invoice details

//     const calculateTotals = (items, discountValue) => {
//         let subtotal = 0;
//         let totalTax = 0;
//         items.forEach((item) => {
//             subtotal += item.quantity * item.price;
//             totalTax += item.quantity * item.price * (item.tax / 100);
//         });
//         setSubtotal(subtotal);
//         setTotalTax(totalTax);
//         setTotal(subtotal + totalTax - discountValue);
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!selectedCompany || !selectedCompany.name)
//             newErrors.companyName = "Company Name is required";
//         if (!selectedCompany || !selectedCompany.address)
//             newErrors.companyAddress = "Company Address is required";
//         if (!selectedCompany || !selectedCompany.gstin)
//             newErrors.companyGSTIN = "GSTIN is required";
//         if (!selectedCustomer || !selectedCustomer.name)
//             newErrors.customerName = "Customer Name is required";
//         if (!selectedCustomer || !selectedCustomer.address)
//             newErrors.customerAddress = "Customer Address is required";
//         if (!selectedCustomer || !selectedCustomer.gstin)
//             newErrors.customerGSTIN = "Customer GSTIN is required";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSaveInvoice = async () => {
//       const products = items.map((item) => ({
//         action: item.product_id ? "update" : "create", // Use update or create based on the existence of product_id
//         product_id: item.product_id || null,
//         products: item.description,
//         quantity: item.quantity,
//         price: item.price,
//         tax: item.tax,
//       }));

//       const payload = {
//         action: invoiceData ? "update" : "create", // Use update if we're editing an invoice
//         invoice_id: invoiceData?.id || null, // Only pass invoice_id if editing
//         company_id: selectedCompany?.id,
//         user_id: selectedCustomer?.id || null,
//         username: user || "defaultUsername",
//         invoice_no: `INV-${invoiceID}`,
//         txn_id: `TXN-${invoiceID}`,
//         sub_total: subtotal,
//         total_tax: totalTax,
//         total_discount: discount,
//         billing_date: billingDate,
//         due_date: dueDate,
//         client_note: clientNote,
//         termsncondition: terms,
//         gstin: selectedCompany?.gstin,
//         products: products,
//         credits: 0,
//         rate: 1.0,
//         payment_gross: subtotal + totalTax - discount,
//         mc_currency: "null",
//         payment_date: billingDate,
//         items_detail: JSON.stringify(products),
//         currency_code: "null",
//         address_country_code: "null",
//       };

//       try {
//         const response = await invoicefull(payload);
//         console.log("Invoice created/updated successfully:", response.data);
//         navigate("/InvoiceList"); // Navigate back to the invoice list after saving
//       } catch (error) {
//         console.error("Error saving invoice:", error.response?.data || error.message);
//       }
//     };

//     return (
//         <div>
//             <div className="flex justify-between items-center bg-gray-100 p-3 mb-8 shadow-md mt-0 ">
//                 <h1 className="text-xl font-semibold"> + Add New Invoice</h1>
//                 <button
//                     onClick={() => navigate("/InvoiceList")} // Use navigate to move to Invoice List
//                     className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
//                 >
//                     Invoice List
//                 </button>
//             </div>

//             <div className="add-invoice-page p-4 bg-white rounded-lg shadow-md">
//             <div className="flex space-x-28 mb-10">
//             <CompanyInfo user={user}
//                 setSelectedCompany={setSelectedCompany}
//                 prefillData={selectedCompany}  // Pass prefilled company data
//             />

//             <CustomerInfo user={user}
//                 setSelectedCustomer={setSelectedCustomer}
//                 prefillData={selectedCustomer}  // Pass prefilled customer data
//             />
//             </div>

//                 <BillingInfo
//                     invoiceID={invoiceID}
//                     setInvoiceID={setInvoiceID}
//                     billingDate={billingDate}
//                     setBillingDate={setBillingDate}
//                     dueDate={dueDate}
//                     setDueDate={setDueDate}
//                     status={status}
//                     setStatus={setStatus}
//                 />
//                 <ProductsAndServices
//                     items={items}
//                     setItems={setItems}
//                     subtotal={subtotal}
//                     totalTax={totalTax}
//                     discount={discount}
//                     setDiscount={setDiscount}
//                     total={total}
//                     calculateTotals={calculateTotals}
//                 />
//                 <TermsAndConditions
//                     clientNote={clientNote}
//                     setClientNote={setClientNote}
//                     terms={terms}
//                     setTerms={setTerms}
//                 />
//                 <div className="flex justify-end mt-4">
//                     <button
//                         className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
//                         onClick={handleSaveInvoice}
//                     >
//                         Save Invoice
//                     </button>

//                     <DownloadInvoice
//                         invoiceData={{
//                             id: invoiceID,
//                             date: billingDate,
//                             dueDate,
//                             subtotal,
//                             tax: totalTax,
//                             discount,
//                             total,
//                             clientNote,
//                         }}
//                         companyData={selectedCompany || {}}
//                         customerData={selectedCustomer || {}}
//                         items={items}
//                         status={status}
//                     />
//                 </div>
//                 {/* Conditionally Render InvoiceDetail */}

//             </div>
//         </div>
//     );
// };

// export default AddInvoice;

// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { invoicefull } from "../../services/api";
// import CompanyInfo from "./CompanyInfo";
// import CustomerInfo from "./CustomerInfo";
// import ProductsAndServices from "./ProductsAndServices";
// import BillingInfo from "./BillingInfo";
// import TermsAndConditions from "./TermsAndConditions";
// import DownloadInvoice from "./DownloadInvoice";

// const AddInvoice = ({ user }) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const invoiceData = location.state?.invoiceData || {}; // Access passed data

//     const [invoiceID, setInvoiceID] = useState(invoiceData.invoice_no || "");
//     const [billingDate, setBillingDate] = useState(invoiceData.billing_date || "");
//     const [dueDate, setDueDate] = useState(invoiceData.due_date || "");
//     const [status, setStatus] = useState(invoiceData.payment_status || "");
//     const [clientNote, setClientNote] = useState(invoiceData.client_note || "");
//     const [terms, setTerms] = useState(invoiceData.termsncondition || "");
//     const [selectedCompany, setSelectedCompany] = useState(invoiceData.company || {});
//     const [selectedCustomer, setSelectedCustomer] = useState(invoiceData.user || {});
//     const [items, setItems] = useState(invoiceData.products || []);
//     const [subtotal, setSubtotal] = useState(invoiceData.sub_total || 0);
//     const [totalTax, setTotalTax] = useState(invoiceData.total_tax || 0);
//     const [discount, setDiscount] = useState(invoiceData.total_discount || 0);
//     const [total, setTotal] = useState(invoiceData.payment_gross || 0);
//     console.log("Company Data:", selectedCompany);
//     console.log("Customer Data:", selectedCustomer);

//     const calculateTotals = (items, discountValue) => {
//         let subtotal = 0;
//         let totalTax = 0;
//         items.forEach((item) => {
//             subtotal += item.quantity * item.price;
//             totalTax += item.quantity * item.price * (item.tax / 100);
//         });
//         setSubtotal(subtotal);
//         setTotalTax(totalTax);
//         setTotal(subtotal + totalTax - discountValue);
//     };

//     const handleSaveInvoice = async () => {
//         const products = items.map((item) => ({
//             action: item.product_id ? "update" : "create",
//             product_id: item.product_id || null,
//             products: item.description,
//             quantity: item.quantity,
//             price: item.price,
//             tax: item.tax,
//         }));

//         const payload = {
//             action: invoiceData ? "update" : "create", // Use update if we're editing an invoice
//             invoice_id: invoiceData?.id || null, // Only pass invoice_id if editing
//             company_id: selectedCompany?.id,
//             user_id: selectedCustomer?.id || null,
//             username: user || "defaultUsername",
//             invoice_no: `INV-${invoiceID}`,
//             txn_id: `TXN-${invoiceID}`,
//             sub_total: subtotal,
//             total_tax: totalTax,
//             total_discount: discount,
//             billing_date: billingDate,
//             due_date: dueDate,
//             client_note: clientNote,
//             termsncondition: terms,
//             gstin: selectedCompany?.gstin,
//             products: products,
//             credits: 0,
//             rate: 1.0,
//             payment_gross: subtotal + totalTax - discount,
//             mc_currency: "null",
//             payment_date: billingDate,
//             items_detail: JSON.stringify(products),
//             currency_code: "null",
//             address_country_code: "null",
//         };

//         try {
//             const response = await invoicefull(payload);
//             console.log("Invoice saved successfully:", response.data);
//         } catch (error) {
//             console.error("Error saving invoice:", error.response?.data || error.message);
//         }

//   useEffect(() => {
//     console.log("Company Data:", selectedCompany);
//     console.log("Customer Data:", selectedCustomer);
//   }, [selectedCompany, selectedCustomer]);

//     };

//     return (
//         <div>
//             <div className="flex justify-between items-center bg-gray-100 p-3 mb-8 shadow-md mt-0">

//                 <h1 className="text-xl font-semibold">{invoiceData.id ? "Edit Invoice" : "+ Add New Invoice"}</h1>
//                 <button
//                     onClick={() => navigate("/InvoiceList")}
//                     className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
//                 >
//                     Invoice List
//                 </button>
//             </div>

//             <div className="add-invoice-page p-4 bg-white rounded-lg shadow-md">
//                 <div className="flex space-x-28 mb-10">
//                     <CompanyInfo user={user} setSelectedCompany={setSelectedCompany} initialData={selectedCompany} />
//                     <CustomerInfo user={user} setSelectedCustomer={setSelectedCustomer} initialData={selectedCustomer} />
//                 </div>
//                 <BillingInfo
//                     invoiceID={invoiceID}
//                     setInvoiceID={setInvoiceID}
//                     billingDate={billingDate}
//                     setBillingDate={setBillingDate}
//                     dueDate={dueDate}
//                     setDueDate={setDueDate}
//                     status={status}
//                     setStatus={setStatus}
//                 />
//                 <ProductsAndServices
//                     items={items}
//                     setItems={setItems}
//                     subtotal={subtotal}
//                     totalTax={totalTax}
//                     discount={discount}
//                     setDiscount={setDiscount}
//                     total={total}
//                     calculateTotals={calculateTotals}
//                 />
//                 <TermsAndConditions
//                     clientNote={clientNote}
//                     setClientNote={setClientNote}
//                     terms={terms}
//                     setTerms={setTerms}
//                 />
//                 <div className="flex justify-end mt-4">
//                     <button
//                         className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
//                         onClick={handleSaveInvoice}
//                     >
//                         Save Invoice
//                     </button>

//                     <DownloadInvoice
//                         invoiceData={{
//                             id: invoiceID,
//                             date: billingDate,
//                             dueDate,
//                             subtotal,
//                             tax: totalTax,
//                             discount,
//                             total,
//                             clientNote,
//                         }}
//                         companyData={selectedCompany || {}}
//                         customerData={selectedCustomer || {}}
//                         items={items}
//                         status={status}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddInvoice;

// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { invoicefull } from "../../services/api";
// import CompanyInfo from "./CompanyInfo";
// import CustomerInfo from "./CustomerInfo";
// import ProductsAndServices from "./ProductsAndServices";
// import BillingInfo from "./BillingInfo";
// import TermsAndConditions from "./TermsAndConditions";
// import DownloadInvoice from "./Downloadinvoice";

// const AddInvoice = ({ user }) => {
//     console.log("User in AddInvoice before navigate:", user);  // Log user before navigation

//     const navigate = useNavigate();
//     const location = useLocation();
//     const { companyData, customerData, productsData } = location.state || {}; // Ensure fallback
//     // const [invoiceID, setInvoiceID] = useState(invoiceData?.id || "");

//     const invoiceData = location.state?.invoiceData || {};

//     const [invoiceID, setInvoiceID] = useState(invoiceData?.invoice_no || ""); // Safe access using ?
//     const [billingDate, setBillingDate] = useState(
//         invoiceData?.billing_date || ""
//     );
//     const [dueDate, setDueDate] = useState(invoiceData?.due_date || "");
//     const [status, setStatus] = useState(invoiceData?.payment_status || "");
//     const [clientNote, setClientNote] = useState(
//         invoiceData?.client_note || "Thank you for your business"
//     );
//     const [terms, setTerms] = useState(
//         invoiceData?.termsncondition ||
//             "Note: This is a system-generated invoice and does not require a signature"
//     );

//     // const [selectedCompany, setSelectedCompany] = useState(companyData || {});
//     const [selectedCompany, setSelectedCompany] = useState(companyData || null);
//     // Use companyData fallback
//     const [selectedCustomer, setSelectedCustomer] = useState(customerData); // Use customerData fallback

//     const [items, setItems] = useState(
//         productsData || [
//             { description: "", quantity: 1, price: 0, tax: 0, total: 0 },
//         ]
//     );

//     const [subtotal, setSubtotal] = useState(invoiceData?.sub_total || 0);
//     const [totalTax, setTotalTax] = useState(invoiceData?.total_tax || 0);
//     const [discount, setDiscount] = useState(invoiceData?.total_discount || 0);
//     const [total, setTotal] = useState(0);
//     console.log("Navigating with data:", {
//         invoiceData,
//         companyData,
//         customerData,
//         productsData,
//     });

//     useEffect(() => {
//         console.log("Invoice Data:", invoiceData); // Make sure `invoice_id` is present here
//     }, [invoiceData]);

//     useEffect(() => {
//         // Calculate total when items, subtotal, or discount changes
//         calculateTotals(items, discount);
//     }, [items, discount]);

//     const calculateTotals = (items, discountValue) => {
//         let subtotal = 0;
//         let totalTax = 0;
//         items.forEach((item) => {
//             subtotal += item.quantity * item.price;
//             totalTax += item.quantity * item.price * (item.tax / 100);
//         });
//         setSubtotal(subtotal);
//         setTotalTax(totalTax);
//         setTotal(subtotal + totalTax - discountValue);
//     };

//     const handleSaveInvoice = async () => {
//         const products = items.map((item) => ({
//             action: item.product_id ? "update" : "create",
//             product_id: item.product_id || null,
//             products: item.description,
//             quantity: item.quantity,
//             price: item.price,
//             tax: item.tax,
//         }));

//         const payload = {
//             action: invoiceID ? "create" : "update",
//             invoice_id: invoiceData?.id || null,

//             company_id: selectedCompany?.id,
//             user_id: selectedCustomer?.id,
//             username: user,
//             invoice_no: String(invoiceID), // Ensure it's a string
//             sub_total: subtotal,
//             total_tax: totalTax,
//             total_discount: discount,
//             billing_date: billingDate,
//             due_date: dueDate,
//             client_note: clientNote,
//             termsncondition: terms,
//             gstin: selectedCompany?.gstin,
//             products: products,
//         };

//         try {
//             const response = await invoicefull(payload);
//             console.log("Invoice updated successfully:", response.data);
//             navigate("/InvoiceList", { state: { refresh: true } }); // Redirect with refresh flag
//         } catch (error) {
//             console.error(
//                 "Error updating invoice:",
//                 error.response?.data || error.message
//             );
//         }
//     };

//     useEffect(() => {
//         console.log("Invoice Data:", invoiceData);
//         console.log("Company Data:", companyData);
//         console.log("Customer Data:", customerData);
//         console.log("Products Data:", productsData);
//     }, [invoiceData, companyData, customerData, productsData]);

//     useEffect(() => {
//         console.log("Invoice Data on load:", invoiceData);
//     }, [invoiceData]);

//     return (
//         <div>
//             <div className="flex justify-between items-center bg-gray-100 p-3 mb-8 shadow-md mt-0">
//                 <h1 className="text-xl font-semibold">
//                     {invoiceData?.id ? "Edit Invoice" : "+ Add New Invoice"}
//                 </h1>

//                 <button
//                     onClick={() =>
//                         navigate("/InvoiceList", {
//                                 state: { invoiceID: invoiceData?.id, user: user.username },
//                         })
//                     }
//                     className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
//                 >
//                     Invoice List
//                 </button>
//             </div>
//             <div className="flex space-x-28 mb-10">
//                 <CompanyInfo
//                     user={user}
//                     setSelectedCompany={setSelectedCompany}
//                     prefillData={selectedCompany} // Pass prefilled company data
//                 />

//                 <CustomerInfo
//                     user={user}
//                     setSelectedCustomer={setSelectedCustomer}
//                     prefillData={selectedCustomer} // Pass prefilled customer data
//                 />
//             </div>

//             {/* <ProductsAndServices
//                 items={items}
//                 setItems={setItems}
//                 // Pass other props like discount, etc.
//             /> */}

//             <BillingInfo
//                 invoiceID={invoiceID}
//                 setInvoiceID={setInvoiceID}
//                 billingDate={billingDate}
//                 setBillingDate={setBillingDate}
//                 dueDate={dueDate}
//                 setDueDate={setDueDate}
//                 status={status}
//                 setStatus={setStatus}
//             />

//             <ProductsAndServices
//                 user={user}
//                 items={items}
//                 setItems={setItems}
//                 subtotal={subtotal}
//                 totalTax={totalTax}
//                 discount={discount}
//                 setDiscount={setDiscount}
//                 total={total}
//                 calculateTotals={calculateTotals}
//             />

//             <TermsAndConditions
//                 clientNote={clientNote}
//                 setClientNote={setClientNote}
//                 terms={terms}
//                 setTerms={setTerms}
//             />

//             <div className="flex justify-end mt-4">
//                 <button
//                     className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
//                     onClick={handleSaveInvoice}
//                 >
//                     Save Invoice
//                 </button>

//                 <DownloadInvoice
//                     invoiceData={{
//                         id: invoiceID,
//                         date: billingDate,
//                         dueDate,
//                         subtotal,
//                         tax: totalTax,
//                         discount,
//                         total,
//                         clientNote,
//                     }}
//                     companyData={selectedCompany || {}}
//                     customerData={selectedCustomer || {}}
//                     items={items}
//                     status={status}
//                 />
//             </div>
//         </div>
//     );
// };

// export default AddInvoice;

// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { invoicefull } from "../../services/api";
// import CompanyInfo from "./CompanyInfo";
// import CustomerInfo from "./CustomerInfo";
// import ProductsAndServices from "./ProductsAndServices";
// import BillingInfo from "./BillingInfo";
// import TermsAndConditions from "./TermsAndConditions";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import DownloadInvoice from "./DownloadInvoice";
// import Modal from "./Modal";
// import InvoiceList from "./InvoiceList";
// // const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state

// const AddInvoice = ({ user }) => {
//   const location = useLocation();

//   // Destructure the company, customer, and product data from the location.state, with fallback to empty objects
//   const { companyData, customerData, productsData } = location.state || {};
//   const navigate = useNavigate();
//   const invoiceData = location.state?.invoiceData || {};
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const openInvoiceListModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeInvoiceListModal = () => {
//     setIsModalOpen(false);
//   };
//   //   const invoiceData = location.state?.invoiceData || {}; // Fallback to an empty object if no invoiceData is passed

//   // Define the state for various invoice-related data
//   const [invoiceID, setInvoiceID] = useState(invoiceData?.invoice_no || "");
//   const [billingDate, setBillingDate] = useState(
//     invoiceData?.billing_date || ""
//   );
//   const [dueDate, setDueDate] = useState(invoiceData?.due_date || "");
//   const [status, setStatus] = useState(invoiceData?.payment_status || "");
//   const [clientNote, setClientNote] = useState(
//     invoiceData?.client_note || "Thank you for your business"
//   );
//   const [terms, setTerms] = useState(
//     invoiceData?.termsncondition ||
//       "Note: This is a system-generated invoice and does not require a signature"
//   );

//   const [selectedCompany, setSelectedCompany] = useState(companyData || null); // Fallback to null if no company data is passed
//   const [selectedCustomer, setSelectedCustomer] = useState(customerData); // Fallback to customerData or undefined

//   const [items, setItems] = useState(
//     productsData || [
//       { description: "", quantity: 1, price: 0, tax: 0, total: 0 },
//     ]
//   );

//   const [subtotal, setSubtotal] = useState(invoiceData?.sub_total || 0);
//   const [totalTax, setTotalTax] = useState(invoiceData?.total_tax || 0);
//   const [discount, setDiscount] = useState(invoiceData?.total_discount || 0);
//   const [total, setTotal] = useState(0);

//   const backlogic = () => {
//     navigate("/dashboard"); // Back button logic for returning to the dashboard
//   };

//   // Log the user and important state to ensure they're passed and updated correctly
//   useEffect(() => {
//     console.log("User in AddInvoice:", user); // Check if user is passed
//     console.log("Navigating with data:", {
//       invoiceData,
//       companyData,
//       customerData,
//       productsData,
//     });
//   }, [user, invoiceData, companyData, customerData, productsData]);

//   // Function to calculate totals when items or discount change
//   useEffect(() => {
//     calculateTotals(items, discount);
//   }, [items, discount]);

//   const calculateTotals = (items, discountValue) => {
//     let subtotal = 0;
//     let totalTax = 0;
//     items.forEach((item) => {
//       subtotal += item.quantity * item.price;
//       totalTax += item.quantity * item.price * (item.tax / 100);
//     });
//     setSubtotal(subtotal);
//     setTotalTax(totalTax);
//     setTotal(subtotal + totalTax - discountValue);
//   };

//   // Handle save invoice
//   const handleSaveInvoice = async () => {
//     const products = items.map((item) => ({
//       action: item.product_id ? "update" : "create",
//       product_id: item.product_id || null,
//       products: item.description,
//       quantity: item.quantity,
//       price: item.price,
//       tax: item.tax,
//     }));

//     const payload = {
//       action: invoiceID ? "create" : "update",
//       invoice_id: invoiceData?.id || null,
//       company_id: selectedCompany?.id,
//       user_id: selectedCustomer?.id,
//       username: user,
//       invoice_no: String(invoiceID), // Ensure it's a string
//       sub_total: subtotal,
//       total_tax: totalTax,
//       total_discount: discount,
//       billing_date: billingDate,
//       due_date: dueDate,
//       client_note: clientNote,
//       termsncondition: terms,
//       gstin: selectedCompany?.gstin,
//       products: products,
//     };

//     try {
//       const response = await invoicefull(payload);
//       console.log("Invoice updated successfully:", response.data);
//       navigate("/InvoiceList", { state: { refresh: true, user: user } }); // Redirect with user and refresh flag
//     } catch (error) {
//       console.error(
//         "Error updating invoice:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <div>
//       {/* <div className="flex justify-between items-center bg-gray-100 p-3 mb-8 shadow-md mt-0">
//                 <h1 className="text-xl font-semibold">
//                     {invoiceData?.id ? "Edit Invoice" : "+ Add New Invoice"}
//                 </h1>
//                 <button
//                     onClick={() => {
//                         console.log("Navigating with user:", user);  // Ensure user is logged before navigation
//                         navigate("/InvoiceList", {
//                             state: ({ invoiceID: invoiceData?.id, user: user })  // Pass state as a JSON string
//                         });

//                     }}
//                     className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
//                 >
//                     Invoice List
//                 </button>
//             </div> */}

//       <div className="p-10">
//         {/* Header with Back Button and Heading */}
//         <div className="flex w-full mr">
//           <div className="bg-white p-6 shadow-md mb-5 rounded-xl w-full">
//             <div className="flex  items-center">
//               {/* Back Button */}
//               <button
//                 onClick={backlogic}
//                 className="bg-white text-indigo-600 py-2 px-2 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
//                 aria-label="Go back"
//               >
//                 <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
//                 Back
//               </button>

//               {/* Dynamic Heading */}
//               <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center flex-grow">
//                 {invoiceData?.id ? "Edit Invoice" : "+ Add New Invoice"}
//               </h1>

//               {/* Button for Adding a New Client or Invoice */}
//               {!invoiceData?.id && (
//                 <button
//                   // onClick={() => {
//                   //   console.log("Navigating with user:", user);
//                   //   navigate("/InvoiceList", {
//                   //     state: { invoiceID: invoiceData?.id, username: user },
//                   //   });
//                   // }}

//                   onClick={openInvoiceListModal}
//                   className="bg-white text-indigo-600 py-4 px-10 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
//                   aria-label="View Invoice List"
//                 >
//                   Invoice List →
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex space-x-28 mb-10">
//           <CompanyInfo
//             user={user}
//             setSelectedCompany={setSelectedCompany}
//             prefillData={selectedCompany}
//           />
//           <CustomerInfo
//             user={user}
//             setSelectedCustomer={setSelectedCustomer}
//             prefillData={selectedCustomer}
//           />
//         </div>

//         <BillingInfo
//           invoiceID={invoiceID}
//           setInvoiceID={setInvoiceID}
//           billingDate={billingDate}
//           setBillingDate={setBillingDate}
//           dueDate={dueDate}
//           setDueDate={setDueDate}
//           status={status}
//           setStatus={setStatus}
//         />
//         {/*
//         <ProductsAndServices
//           user={user}
//           items={items}
//           setItems={setItems}
//           subtotal={subtotal}
//           totalTax={totalTax}
//           discount={discount}
//           setDiscount={setDiscount}
//           total={total}
//           calculateTotals={calculateTotals}
//         /> */}

//         <ProductsAndServices
//           user={user}
//           items={items}
//           setItems={setItems}
//           subtotal={subtotal}
//           totalTax={totalTax}
//           discount={discount}
//           setDiscount={setDiscount}
//           total={total}
//           calculateTotals={calculateTotals}
//           totalCGST={totalCGST} // Pass total CGST
//           totalSGST={totalSGST} // Pass total SGST
//           totalIGST={totalIGST} // Pass total IGST
//         />

//         <TermsAndConditions
//           clientNote={clientNote}
//           setClientNote={setClientNote}
//           terms={terms}
//           setTerms={setTerms}
//         />

//         <div className="flex justify-end mt-4">
//           <button
//             className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
//             onClick={handleSaveInvoice}
//           >
//             Save Invoice
//           </button>

//           <DownloadInvoice
//             invoiceData={{
//               id: invoiceID,
//               date: billingDate,
//               dueDate,
//               subtotal,
//               tax: totalTax,
//               discount,
//               total,
//               clientNote,
//             }}
//             companyData={selectedCompany || {}}
//             customerData={selectedCustomer || {}}
//             items={items}
//             status={status}
//           />
//           <Modal isModalOpen={isModalOpen} closeModal={closeInvoiceListModal}>
//             <InvoiceList user={user} />
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddInvoice;

// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { invoicefull } from "../../services/api";
// import CompanyInfo from "./CompanyInfo";
// import CustomerInfo from "./CustomerInfo";
// import ProductsAndServices from "./ProductsAndServices";
// import BillingInfo from "./BillingInfo";
// import TermsAndConditions from "./TermsAndConditions";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import DownloadInvoice from "./DownloadInvoice";
// import Modal from "./Modal"; // Import the modal
// import InvoiceList from "./InvoiceList"; // Import the InvoiceList

// const AddInvoice = ({ user }) => {
//   const location = useLocation();

//   // Destructure the company, customer, and product data from the location.state, with fallback to empty objects
//   const { companyData, customerData, productsData } = location.state || {};
//   const navigate = useNavigate();
//   const invoiceData = location.state?.invoiceData || {}; // Fallback to an empty object if no invoiceData is passed

//   const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state

//   // Modal open/close logic
//   const openInvoiceListModal = () => setIsModalOpen(true);
//   const closeInvoiceListModal = () => setIsModalOpen(false);

//   // Define the state for various invoice-related data
//   const [invoiceID, setInvoiceID] = useState(invoiceData?.invoice_no || "");
//   const [billingDate, setBillingDate] = useState(invoiceData?.billing_date || "");
//   const [dueDate, setDueDate] = useState(invoiceData?.due_date || "");
//   const [status, setStatus] = useState(invoiceData?.payment_status || "");
//   const [clientNote, setClientNote] = useState(invoiceData?.client_note || "Thank you for your business");
//   const [terms, setTerms] = useState(invoiceData?.termsncondition || "Note: This is a system-generated invoice and does not require a signature");

//   const [selectedCompany, setSelectedCompany] = useState(companyData || null); // Fallback to null if no company data is passed
//   const [selectedCustomer, setSelectedCustomer] = useState(customerData); // Fallback to customerData or undefined

//   const [items, setItems] = useState(
//     productsData || [{ description: "", quantity: 1, price: 0, tax: 0, total: 0 }]
//   );

//   const [subtotal, setSubtotal] = useState(invoiceData?.sub_total || 0);
//   const [totalTax, setTotalTax] = useState(invoiceData?.total_tax || 0);
//   const [discount, setDiscount] = useState(invoiceData?.total_discount || 0);
//   const [total, setTotal] = useState(0);

//   const backlogic = () => {
//     navigate("/dashboard"); // Back button logic for returning to the dashboard
//   };

//   // Log the user and important state to ensure they're passed and updated correctly
//   useEffect(() => {
//     console.log("User in AddInvoice:", user); // Check if user is passed
//     console.log("Navigating with data:", { invoiceData, companyData, customerData, productsData });
//   }, [user, invoiceData, companyData, customerData, productsData]);

//   // Function to calculate totals when items or discount change
//   useEffect(() => {
//     calculateTotals(items, discount);
//   }, [items, discount]);

//   const calculateTotals = (items, discountValue) => {
//     let subtotal = 0;
//     let totalTax = 0;
//     items.forEach((item) => {
//       subtotal += item.quantity * item.price;
//       totalTax += item.quantity * item.price * (item.tax / 100);
//     });
//     setSubtotal(subtotal);
//     setTotalTax(totalTax);
//     setTotal(subtotal + totalTax - discountValue);
//   };

//   // Handle save invoice
//   const handleSaveInvoice = async () => {
//     const products = items.map((item) => ({
//       action: item.product_id ? "update" : "create",
//       product_id: item.product_id || null,
//       products: item.description,
//       quantity: item.quantity,
//       price: item.price,
//       tax: item.tax,
//     }));

//     const payload = {
//       action: invoiceID ? "create" : "update",
//       invoice_id: invoiceData?.id || null,
//       company_id: selectedCompany?.id,
//       user_id: selectedCustomer?.id,
//       username: user,
//       invoice_no: String(invoiceID), // Ensure it's a string
//       sub_total: subtotal,
//       total_tax: totalTax,
//       total_discount: discount,
//       billing_date: billingDate,
//       due_date: dueDate,
//       client_note: clientNote,
//       termsncondition: terms,
//       gstin: selectedCompany?.gstin,
//       products: products,
//     };

//     try {
//       const response = await invoicefull(payload);
//       console.log("Invoice updated successfully:", response.data);
//       navigate("/InvoiceList", { state: { refresh: true, user: user } }); // Redirect with user and refresh flag
//     } catch (error) {
//       console.error("Error updating invoice:", error.response?.data || error.message);
//     }
//   };

//   return (
//     <div>
//       <div className="p-10">
//         {/* Header with Back Button and Heading */}
//         <div className="flex w-full mr">
//           <div className="bg-white p-6 shadow-md mb-5 rounded-xl w-full">
//             <div className="flex justify-between items-center">
//               {/* Back Button */}
//               <button
//                 onClick={backlogic}
//                 className="bg-white text-indigo-600 py-2 px-2 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
//                 aria-label="Go back"
//               >
//                 <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
//                 Back
//               </button>

//               {/* Dynamic Heading */}
//               <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
//                 {invoiceData?.id ? "Edit Invoice" : "+ Add New Invoice"}
//               </h1>

//               {/* Show Invoice List Button only if it's a new invoice (Add Invoice mode) */}
//               {!invoiceData?.id && (
//                 <button
//                   onClick={openInvoiceListModal} // Open the InvoiceList modal
//                   className="bg-white text-indigo-600 py-4 px-10 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
//                   aria-label="View Invoice List"
//                 >
//                   Invoice List →
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="flex space-x-28 mb-10">
//           <CompanyInfo user={user} setSelectedCompany={setSelectedCompany} prefillData={selectedCompany} />
//           <CustomerInfo user={user} setSelectedCustomer={setSelectedCustomer} prefillData={selectedCustomer} />
//         </div>

//         <BillingInfo
//           invoiceID={invoiceID}
//           setInvoiceID={setInvoiceID}
//           billingDate={billingDate}
//           setBillingDate={setBillingDate}
//           dueDate={dueDate}
//           setDueDate={setDueDate}
//           status={status}
//           setStatus={setStatus}
//         />

//         <ProductsAndServices
//           user={user}
//           items={items}
//           setItems={setItems}
//           subtotal={subtotal}
//           totalTax={totalTax}
//           discount={discount}
//           setDiscount={setDiscount}
//           total={total}
//           calculateTotals={calculateTotals}
//         />

//         <TermsAndConditions clientNote={clientNote} setClientNote={setClientNote} terms={terms} setTerms={setTerms} />

//         <div className="flex justify-end mt-4">
//           <button className="bg-blue-500 text-white py-2 px-4 rounded mr-2" onClick={handleSaveInvoice}>
//             Save Invoice
//           </button>

//           <DownloadInvoice
//             invoiceData={{
//               id: invoiceID,
//               date: billingDate,
//               dueDate,
//               subtotal,
//               tax: totalTax,
//               discount,
//               total,
//               clientNote,
//             }}
//             companyData={selectedCompany || {}}
//             customerData={selectedCustomer || {}}
//             items={items}
//             status={status}
//           />
//         </div>

//         {/* Modal for InvoiceList */}
//         <Modal isModalOpen={isModalOpen} closeModal={closeInvoiceListModal}>
//           <InvoiceList user={user} /> {/* Pass user prop to InvoiceList */}
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default AddInvoice;

// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import CompanyInfo from "./CompanyInfo";
// import CustomerInfo from "./CustomerInfo";
// import ProductsAndServices from "./ProductsAndServices";
// import BillingInfo from "./BillingInfo";
// import TermsAndConditions from "./TermsAndConditions";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import InvoiceList from "./InvoiceList"; // Import the InvoiceList component
// import Modal from "./Modal"; // Import your existing modal

// const AddInvoice = ({ user }) => {
//     const location = useLocation();
//     const { companyData, customerData, productsData } = location.state || {};
//     const navigate = useNavigate();
//     const invoiceData = location.state?.invoiceData || {};

//     const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state for InvoiceList

//     const openInvoiceListModal = () => {
//         setIsModalOpen(true);
//     };

//     const closeInvoiceListModal = () => {
//         setIsModalOpen(false);
//     };

//     const backlogic = () => {
//         navigate("/dashboard");
//     };

//     return (
//         <div>
//             <div className="p-10">
//                 <div className="flex w-full mr">
//                     <div className="bg-white p-6 shadow-md mb-5 rounded-xl w-full">
//                         <div className="flex justify-between items-center">
//                             <button
//                                 onClick={backlogic}
//                                 className="bg-white text-indigo-600 py-2 px-2 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
//                                 aria-label="Go back"
//                             >
//                                 <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
//                                 Back
//                             </button>

//                             <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
//                                 {invoiceData?.id ? "Edit Invoice" : "+ Add New Invoice"}
//                             </h1>

//                             <button
//                                 onClick={openInvoiceListModal} // Open InvoiceList modal on click
//                                 className="bg-white text-indigo-600 py-4 px-10 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
//                                 aria-label="View Invoice List"
//                             >
//                                 Invoice List →
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Other form elements (e.g., company, customer, billing info) */}

//                 {/* Modal for InvoiceList */}
//                 <Modal isModalOpen={isModalOpen} closeModal={closeInvoiceListModal}>
//                     <InvoiceList user={user} /> {/* Pass user prop to InvoiceList */}
//                 </Modal>
//             </div>
//         </div>
//     );
// };

// export default AddInvoice;

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { invoicefull } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyInfo from "./CompanyInfo";
import CustomerInfo from "./CustomerInfo";
import ProductsAndServices from "./ProductsAndServices";
import BillingInfo from "./BillingInfo";
import TermsAndConditions from "./TermsAndConditions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DownloadInvoice from "./Downloadinvoice";
import Modal from "./Modal";
import InvoiceList from "./InvoiceList";

const AddInvoice = ({ user }) => {
  const location = useLocation();

  const { companyData, customerData, productsData } = location.state || {};
  const navigate = useNavigate();
  const invoiceData = location.state?.invoiceData || {};
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add state variables for CGST, SGST, IGST
  const [totalCGST, setTotalCGST] = useState(0); // Add CGST state
  const [totalSGST, setTotalSGST] = useState(0); // Add SGST state
  const [totalIGST, setTotalIGST] = useState(0); // Add IGST state
  const [logoPreview, setLogoPreview] = useState(null);

  const openInvoiceListModal = () => {
    setIsModalOpen(true);
  };

  const closeInvoiceListModal = () => {
    setIsModalOpen(false);
  };

  const [invoiceID, setInvoiceID] = useState(invoiceData?.invoice_no || "");
  const [billingDate, setBillingDate] = useState(
    invoiceData?.billing_date || ""
  );
  const [dueDate, setDueDate] = useState(invoiceData?.due_date || "");
  const [status, setStatus] = useState(invoiceData?.payment_status || "");
  const [clientNote, setClientNote] = useState(
    invoiceData?.client_note || "Thank you for your business"
  );
  const [terms, setTerms] = useState(
    invoiceData?.termsncondition ||
      "Note: This is a system-generated invoice and does not require a signature"
  );

  const [selectedCompany, setSelectedCompany] = useState(companyData || null);

  const [selectedCustomer, setSelectedCustomer] = useState(customerData);
  const [items, setItems] = useState(
    productsData || [
      { description: "", quantity: 1, price: 0, tax: 0, total: 0 },
    ]
  );

  const [subtotal, setSubtotal] = useState(invoiceData?.sub_total || 0);
  const [totalTax, setTotalTax] = useState(invoiceData?.total_tax || 0);
  const [discount, setDiscount] = useState(invoiceData?.total_discount || 0);
  const [total, setTotal] = useState(0);

  const backlogic = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    console.log("Selected Company Data:", selectedCompany); // Check if company_image is included
  }, [selectedCompany]);

  useEffect(() => {
    calculateTotals(items, discount);
  }, [items, discount]);

  // Update calculateTotals to set CGST, SGST, and IGST
  const calculateTotals = (items, discountValue) => {
    let subtotal = 0;
    let totalTax = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    items.forEach((item) => {
      subtotal += item.quantity * item.price;
      totalCGST += item.quantity * item.price * (item.cgst / 100);
      totalSGST += item.quantity * item.price * (item.sgst / 100);
      totalIGST += item.quantity * item.price * (item.igst / 100);
    });

    totalTax = totalCGST + totalSGST + totalIGST;

    setSubtotal(subtotal);
    setTotalTax(totalTax); // This ensures total tax is the sum of individual taxes
    setTotalCGST(totalCGST);
    setTotalSGST(totalSGST);
    setTotalIGST(totalIGST);
    setTotal(subtotal + totalTax - discountValue);
  };

  // Handle save invoice
  const handleSaveInvoice = async () => {
    const products = items.map((item) => {
      const itemCGST = item.quantity * item.price * (item.cgst / 100);
      const itemSGST = item.quantity * item.price * (item.sgst / 100);
      const itemIGST = item.quantity * item.price * (item.igst / 100);
      const itemTotalTax = itemCGST + itemSGST + itemIGST; // Sum up individual taxes for the item

      return {
        action: item.product_id ? "update" : "create",
        product_id: item.product_id,
        products: item.products,
        quantity: item.quantity,
        price: item.price,
        cgst: itemCGST, // Individual CGST for the item
        sgst: itemSGST, // Individual SGST for the item
        igst: itemIGST, // Individual IGST for the item
        tax: itemTotalTax, // Total tax for the item
      };
    });

    const payload = {
      action: invoiceID ? "create" : "update",
      invoice_id: invoiceData?.id || null,
      company_id: selectedCompany?.id,
      user_id: selectedCustomer?.id,
      payment_date: billingDate,
      username: user,
      invoice_no: String(invoiceID),
      sub_total: subtotal,
      total_tax: totalTax,
      total_discount: discount,
      billing_date: billingDate,
      due_date: dueDate,
      client_note: clientNote,
      termsncondition: terms,
      gstin: selectedCompany?.gstin,
      products: products,
      items_detail: JSON.stringify(products),
      payment_status: status,
    };

    try {
      const response = await invoicefull(payload);

      // Check for success in the response
      if (response.data.status === 1) {
        toast.success("Invoice created successfully!");
        navigate("/InvoiceList", { state: { refresh: true, user: username } });
      } else {
        // If the API returns a failure status
        toast.error("Error creating invoice!");
        console.error(
          "Error creating invoice:",
          response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      // Handle any network or server errors here
      console.error(
        "Error creating invoice:",
        error.response?.data || error.message
      );
      toast.error("Error creating invoice! Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-10">
        <div className="flex w-full mr">
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl w-full">
            <div className="flex  items-center">
              <button
                onClick={backlogic}
                className="bg-white text-indigo-600 py-2 px-2 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center flex-grow">
                {invoiceData?.id ? "Edit Invoice" : "+ Add New Invoice"}
              </h1>
              {!invoiceData?.id && (
                <button
                  onClick={openInvoiceListModal}
                  className="bg-white text-indigo-600 py-4 px-10 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
                  aria-label="View Invoice List"
                >
                  Invoice List →
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-28 mb-10">
          <CompanyInfo
            user={user}
            setSelectedCompany={setSelectedCompany}
            prefillData={selectedCompany}
            logoPreview={logoPreview} // Pass logo preview to CompanyInfo
            setLogoPreview={setLogoPreview}
          />
          <CustomerInfo
            user={user}
            setSelectedCustomer={setSelectedCustomer}
            prefillData={selectedCustomer}
          />
        </div>

        <BillingInfo
          invoiceID={invoiceID}
          setInvoiceID={setInvoiceID}
          billingDate={billingDate}
          setBillingDate={setBillingDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
          status={status}
          setStatus={setStatus}
        />

        <ProductsAndServices
          user={user}
          items={items}
          // description={description}
          setItems={setItems}
          subtotal={subtotal}
          totalTax={totalTax}
          discount={discount}
          setDiscount={setDiscount}
          total={total}
          calculateTotals={calculateTotals}
          totalCGST={totalCGST} // Pass CGST total
          totalSGST={totalSGST} // Pass SGST total
          totalIGST={totalIGST} // Pass IGST total
        />

        <TermsAndConditions
          clientNote={clientNote}
          setClientNote={setClientNote}
          terms={terms}
          setTerms={setTerms}
        />

        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            onClick={handleSaveInvoice}
          >
            Save Invoice
          </button>

          <DownloadInvoice
            invoiceData={{
              id: invoiceID,
              date: billingDate,
              dueDate,
              subtotal,
              tax: totalTax,
              discount,
              total,
              clientNote,
              payment_status: status, // Ensure this is defined
            }}
            companyData={selectedCompany || {}}
            customerData={selectedCustomer || {}}
            items={items}
            logoPreview={logoPreview}
          />

          <Modal isModalOpen={isModalOpen} closeModal={closeInvoiceListModal}>
            <InvoiceList user={user} />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;
