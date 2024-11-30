// import jsPDF from "jspdf";
// import "jspdf-autotable"; // Import the autoTable plugin

// const DownloadInvoice = ({ invoiceData, companyData, customerData, items }) => {
//   const handleDownload = () => {
//     const doc = new jsPDF();

//     // if(companyData.logo) {
//     //     doc.addImage(companyData.logo, 'JPEG', 10,10,20,20);
//     // }

//     if (companyData.logo) {
//       const imgType = companyData.logo.startsWith("data:image/png")
//         ? "PNG"
//         : "JPEG";
//       doc.addImage(companyData.logo, imgType, 10, 10, 20, 20); // Adjust dimensions (x, y, width, height)
//     }

//     // Company Information (Top Right)
//     doc.setFontSize(20);
//     // doc.text('Company Information', 140, 20);
//     doc.setFontSize(8);
//     doc.text(companyData?.company_name || "Company Name", 140, 25);
//     doc.text(companyData?.company_address || "Company Address", 140, 30);
//     doc.text(`GSTIN: ${companyData?.gstin || "Not provided"}`, 140, 35);

//     // Title: Invoice (Centered with lines extending to the left and right)
//     const title = "INVOICE";
//     const titleWidth =
//       (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
//       doc.internal.scaleFactor;
//     const titleX = doc.internal.pageSize.width / 2; // Center title horizontally

//     // Draw the title
//     doc.setFontSize(16);
//     doc.text(title, titleX, 50, null, null, "center");

//     // Draw horizontal lines left and right of the title
//     doc.line(20, 48, titleX - titleWidth / 2 - 8, 48); // Left line
//     doc.line(
//       titleX + titleWidth / 2 + 8,
//       48,
//       doc.internal.pageSize.width - 20,
//       48
//     ); // Right line

//     // Customer Information (left side)
//     doc.setFontSize(10);
//     // doc.text('Customer Information', 20, 70);
//     doc.setFontSize(8);
//     doc.text(customerData?.customer || "Customer Name", 20, 75);
//     doc.text(customerData.address || "Customer Address", 20, 80);
//     doc.text(`GSTIN: ${customerData.gstin || "Not provided"}`, 20, 85);

//     // Table for Invoice Details (Right side)
//     doc.setFontSize(10);
//     // doc.text('Invoice Details', 105, 70);

//     // Prepare table data
//     const tableData = [
//       ["Invoice ID", invoiceData.id || "N/A"],
//       ["Invoice Date", invoiceData.date || "N/A"],
//       ["Due Date", invoiceData.dueDate || "N/A"],
//       ["Payment Status", invoiceData.payment_status],
//     ];

//     // Add the table with autoTable
//     // doc.autoTable({
//     //   startY: 75, // Position the table below the title
//     //   head: [["Field", "Value"]], // Table header
//     //   body: tableData, // Table body data
//     //   theme: "grid", // Theme with grid lines
//     //   margin: { left: 110 }, // Margin to align with the right side
//     //   styles: { fontSize: 8 }, // Font size for table content
//     //   columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 40 } }, // Adjust column width
//     // });

//     doc.autoTable({
//         startY: 75, // Position the table below the title
//         head: [["Field", "Value"]], // Table header
//         body: tableData, // Table body data
//         theme: "grid", // Theme with grid lines
//         margin: { left: 110 }, // Margin to align with the right side
//         styles: { fontSize: 8 }, // Font size for table content
//         columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 40 } }, // Adjust column width
//       });

//     // Set yPos below the table
//     let yPos = doc.lastAutoTable.finalY + 10;

//     // Add Items Table
//     doc.setFontSize(10);
//     doc.text("Products/Services", 10, yPos);

//     // Prepare items table data
//     // const itemsTableData = items.map(item => [
//     //     item.description || '',
//     //     item.quantity || '0',
//     //     (typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'),
//     //     item.tax || '0',
//     //     (typeof item.total === 'number' ? item.total.toFixed(2) : '0.00')
//     // ]);

//     doc.text('Products/Services', 10, yPos);
//     const itemsTableData = items.map((item) => [
//       item?.products || '',
//       item.quantity || "0",
//       item.price ? item.price.toFixed(2) : "0.00",
//       item.cgst + item.sgst + item.igst || "0",
//       item.total ? item.total.toFixed(2) : "0.00",
//       item.payment_status || '',
//     ]);

//     // Add the items table with autoTable
//     doc.autoTable({
//       startY: yPos + 10, // Position the table below the previous section
//       head: [["Product", "Quantity", "Price", "Tax (%)", "Total"]], // Table header
//       body: itemsTableData, // Table body data
//       theme: "grid", // Theme with grid lines
//       styles: { fontSize: 8 }, // Font size for table content
//       columnStyles: {
//         0: { cellWidth: 60 },
//         1: { cellWidth: 30 },
//         2: { cellWidth: 30 },
//         3: { cellWidth: 30 },
//         4: { cellWidth: 40 },
//       }, // Adjust column width
//     });

//     // Set yPos below the items table
//     yPos = doc.lastAutoTable.finalY + 10;

//     // Add Total calculations
//     doc.text(`Subtotal:`, 125, yPos);
//     doc.text(invoiceData?.subtotal?.toFixed(2) || "0.00", 165, yPos);
//     yPos += 5;
//     doc.text(`Tax:`, 125, yPos);
//     doc.text(invoiceData?.tax?.toFixed(2) || "0.00", 165, yPos);
//     yPos += 5;
//     doc.text(`Discount:`, 125, yPos);
//     doc.text(invoiceData?.discount?.toFixed(2) || "0.00", 165, yPos);
//     yPos += 5;
//     doc.text(`Total:`, 125, yPos);
//     doc.text(invoiceData?.total?.toFixed(2) || "0.00", 165, yPos);

//     // Client Notes
//     yPos += 10;
//     doc.text("Client Notes:", 20, yPos);
//     doc.text(invoiceData?.clientNote?.toString() || "", 20, yPos + 5);

//     // Save the PDF

//     doc.save(`${invoiceData.id || "invoice"}.pdf`);
//   };

//   return (
//     <button
//       onClick={handleDownload}
//       className="bg-blue-500 text-white py-2 px-4 rounded"
//     >
//       Download Invoice
//     </button>
//   );
// };

// export default DownloadInvoice;

// import jsPDF from "jspdf";
// import "jspdf-autotable"; // Import the autoTable plugin

// const DownloadInvoice = ({ invoiceData, companyData, customerData, items }) => {
//   const handleDownload = async () => {
//     const doc = new jsPDF();

//     // Load and add company logo if it exists
// //     if (companyData.company_image) {
// //       try {
// //         // Load image as a base64 URL
// //         const imgType = companyData.company_image.endsWith(".png")
// //           ? "PNG"
// //           : "JPEG";
// //         doc.addImage(companyData.company_image, imgType, 10, 10, 20, 20);
// //         const imageUrl = companyData.company_image; // URL of the image
// //         const imgData = await fetch(imageUrl).then((response) =>
// //           response.blob()
// //         );
// //         const reader = new FileReader();

// //         reader.onload = function () {
// //           const imgBase64 = reader.result;
// //           doc.addImage(imgBase64, "JPEG", 10, 10, 20, 20); // Adjust dimensions as needed
// //           generatePDFContent(doc);
// //         };

// //         reader.readAsDataURL(imgData); // Convert blob to base64 and trigger onload
// //       } catch (error) {
// //         console.error("Error loading company image:", error);
// //         generatePDFContent(doc); // Generate the rest of the PDF even if image fails
// //       }
// //     } else {
// //       generatePDFContent(doc);
// //     }
// //   };

// if (companyData.company_image) {
//     try {
//       // Check the image type for use in jsPDF
//       const imgType = companyData.company_image.endsWith(".png") ? "PNG" : "JPEG";
//       const imageUrl = companyData.company_image; // URL of the image

//       // Fetch image as a blob and convert to base64
//       const imgData = await fetch(imageUrl).then((response) => response.blob());
//       const reader = new FileReader();

//       reader.onload = function () {
//         const imgBase64 = reader.result;
//         doc.addImage(imgBase64, imgType, 10, 10, 20, 20); // Add image to PDF
//         generatePDFContent(doc); // Continue with generating the rest of the PDF
//       };

//       reader.readAsDataURL(imgData); // Convert blob to base64 and trigger onload

//     } catch (error) {
//       console.error("Error loading company image:", error);
//       generatePDFContent(doc); // Continue PDF generation even if the image fails
//     }
//   } else {
//     generatePDFContent(doc); // Generate PDF content without an image
//   }

//   // Separate function to add the content after image loads
//   const generatePDFContent = (doc) => {
//     // Company Information (Top Right)
//     doc.setFontSize(20);
//     doc.setFontSize(8);
//     doc.text(companyData?.company_name || "Company Name", 140, 25);
//     doc.text(companyData?.company_address || "Company Address", 140, 30);
//     doc.text(`GSTIN: ${companyData?.gstin || "Not provided"}`, 140, 35);

//     // Title: Invoice (Centered with lines extending to the left and right)
//     const title = "INVOICE";
//     const titleWidth =
//       (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
//       doc.internal.scaleFactor;
//     const titleX = doc.internal.pageSize.width / 2;

//     doc.setFontSize(16);
//     doc.text(title, titleX, 50, null, null, "center");

//     // Draw horizontal lines
//     doc.line(20, 48, titleX - titleWidth / 2 - 8, 48); // Left line
//     doc.line(
//       titleX + titleWidth / 2 + 8,
//       48,
//       doc.internal.pageSize.width - 20,
//       48
//     ); // Right line

//     // Customer Information
//     doc.setFontSize(8);
//     doc.text(customerData?.customer || "Customer Name", 20, 75);
//     doc.text(customerData.address || "Customer Address", 20, 80);
//     doc.text(`GSTIN: ${customerData.gstin || "Not provided"}`, 20, 85);

//     // Invoice Details Table
//     const tableData = [
//       ["Invoice ID", invoiceData.id || "N/A"],
//       ["Invoice Date", invoiceData.date || "N/A"],
//       ["Due Date", invoiceData.dueDate || "N/A"],
//       ["Payment Status", invoiceData.payment_status],
//     ];

//     doc.autoTable({
//       startY: 75,
//       head: [["Field", "Value"]],
//       body: tableData,
//       theme: "grid",
//       margin: { left: 110 },
//       styles: { fontSize: 8 },
//       columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 40 } },
//     });

//     let yPos = doc.lastAutoTable.finalY + 10;

//     // Products/Services Table
//     doc.text("Products/Services", 10, yPos);
//     const itemsTableData = items.map((item) => [
//       item?.products || "",
//       item.quantity || "0",
//       item.price ? item.price.toFixed(2) : "0.00",
//       item.cgst + item.sgst + item.igst || "0",
//       item.total ? item.total.toFixed(2) : "0.00",
//       item.payment_status || "",
//     ]);

//     doc.autoTable({
//       startY: yPos + 10,
//       head: [["Product", "Quantity", "Price", "Tax (%)", "Total"]],
//       body: itemsTableData,
//       theme: "grid",
//       styles: { fontSize: 8 },
//       columnStyles: {
//         0: { cellWidth: 60 },
//         1: { cellWidth: 30 },
//         2: { cellWidth: 30 },
//         3: { cellWidth: 30 },
//         4: { cellWidth: 40 },
//       },
//     });

//     yPos = doc.lastAutoTable.finalY + 10;

//     // Totals
//     doc.text(`Subtotal:`, 125, yPos);
//     doc.text(invoiceData?.subtotal?.toFixed(2) || "0.00", 165, yPos);
//     yPos += 5;
//     doc.text(`Tax:`, 125, yPos);
//     doc.text(invoiceData?.tax?.toFixed(2) || "0.00", 165, yPos);
//     yPos += 5;
//     doc.text(`Discount:`, 125, yPos);
//     doc.text(invoiceData?.discount?.toFixed(2) || "0.00", 165, yPos);
//     yPos += 5;
//     doc.text(`Total:`, 125, yPos);
//     doc.text(invoiceData?.total?.toFixed(2) || "0.00", 165, yPos);

//     // Client Notes
//     yPos += 10;
//     doc.text("Client Notes:", 20, yPos);
//     doc.text(invoiceData?.clientNote?.toString() || "", 20, yPos + 5);

//     doc.save(`${invoiceData.id || "invoice"}.pdf`);
//   };

//   return (
//     <button
//       onClick={handleDownload}
//       className="bg-blue-500 text-white py-2 px-4 rounded"
//     >
//       Download Invoice
//     </button>
//   );

// };
// export default DownloadInvoice;

import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin

const DownloadInvoice = ({
  invoiceData,
  companyData,
  customerData,
  items,
  logoPreview,
}) => {
  const handleDownload = async () => {
    const doc = new jsPDF();

    // Utility function to fetch and convert image to base64
    const fetchImageAsBase64 = async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject("Error loading image");
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Error fetching image:", error);
        return null;
      }
    };

    // Add company logo to PDF if available
    if (logoPreview) {
      const imgBase64 = await fetchImageAsBase64(logoPreview);
      if (imgBase64) {
        // Determine the image type based on the URL extension
        let imgType = "JPEG"; // Default to JPEG if the type isn't clear
        if (companyData.company_image.match(/\.(png)$/i)) {
          imgType = "PNG";
        } else if (companyData.company_image.match(/\.(jpg|jpeg)$/i)) {
          imgType = "JPEG";
        }

        doc.addImage(imgBase64, imgType, 10, 10, 20, 20); // Add image to PDF
        console.log("Image added successfully to PDF.");
      } else {
        console.warn("Company logo could not be loaded.");
      }
    }

    generatePDFContent(doc);
  };

  // Function to add the rest of the content to the PDF
  const generatePDFContent = (doc) => {
    // Company Information (Top Right)
    doc.setFontSize(8);
    doc.text(companyData?.company_name || "Company Name", 140, 25);
    doc.text(companyData?.company_address || "Company Address", 140, 30);
    doc.text(`GSTIN: ${companyData?.gstin || "Not provided"}`, 140, 35);

    // Title: Invoice
    const title = "INVOICE";
    const titleX = doc.internal.pageSize.width / 2;
    doc.setFontSize(16);
    doc.text(title, titleX, 50, null, null, "center");

    // Draw horizontal lines
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    doc.line(20, 48, titleX - titleWidth / 2 - 8, 48); // Left line
    doc.line(
      titleX + titleWidth / 2 + 8,
      48,
      doc.internal.pageSize.width - 20,
      48
    ); // Right line

    // Customer Information
    doc.setFontSize(8);
    doc.text(customerData?.customer || "Customer Name", 20, 75);
    doc.text(customerData.address || "Customer Address", 20, 80);
    doc.text(`GSTIN: ${customerData.gstin || "Not provided"}`, 20, 85);

    // Invoice Details Table
    const tableData = [
      ["Invoice ID", invoiceData.id || "N/A"],
      ["Invoice Date", invoiceData.date || "N/A"],
      ["Due Date", invoiceData.dueDate || "N/A"],
      ["Payment Status", invoiceData.payment_status || "N/A"],
    ];

    doc.autoTable({
      startY: 75,
      head: [["Field", "Value"]],
      body: tableData,
      theme: "grid",
      margin: { left: 110 },
      styles: { fontSize: 8 },
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 40 } },
    });

    let yPos = doc.lastAutoTable.finalY + 10;

    // Products/Services Table
    doc.text("Products/Services", 10, yPos);
    const itemsTableData = items.map((item) => [
      item?.products || "",
      item.quantity || "0",
      item.price ? item.price.toFixed(2) : "0.00",
      item.cgst + item.sgst + item.igst || "0",
      item.total ? item.total.toFixed(2) : "0.00",
    ]);

    doc.autoTable({
      startY: yPos + 10,
      head: [["Product", "Quantity", "Price", "Tax (%)", "Total"]],
      body: itemsTableData,
      theme: "grid",
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 40 },
      },
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Totals
    doc.text(`Subtotal:`, 125, yPos);
    doc.text(invoiceData?.subtotal?.toFixed(2) || "0.00", 165, yPos);
    yPos += 5;
    doc.text(`Tax:`, 125, yPos);
    doc.text(invoiceData?.tax?.toFixed(2) || "0.00", 165, yPos);
    yPos += 5;
    doc.text(`Discount:`, 125, yPos);
    doc.text(invoiceData?.discount?.toFixed(2) || "0.00", 165, yPos);
    yPos += 5;
    doc.text(`Total:`, 125, yPos);
    doc.text(invoiceData?.total?.toFixed(2) || "0.00", 165, yPos);

    // Client Notes
    yPos += 10;
    doc.text("Client Notes:", 20, yPos);
    doc.text(invoiceData?.clientNote?.toString() || "", 20, yPos + 5);

    doc.save(`${invoiceData.id || "invoice"}.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-blue-500 text-white py-2 px-4 rounded"
    >
      Download Invoice
    </button>
  );
};

export default DownloadInvoice;
