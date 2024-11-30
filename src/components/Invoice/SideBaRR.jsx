// import React, { useState } from "react";
// import AddInvoice from "./AddInvoice"; // Adjust path as necessary
// import InvoiceList from "./InvoiceList"; // Adjust path as necessary

// const SideBaRR = ({ user }) => {
//     const [selectedMenu, setSelectedMenu] = useState("AddInvoice");

//     const renderContent = () => {
//         switch (selectedMenu) {
//             case "InvoiceList":
//                 return <InvoiceList user={user}  />;
//             case "AddInvoice":
//             default:
//                 return <AddInvoice user={user} />;
//         }
//     };

//     return (
//         <div className="flex">
//             <aside className="w-64 h-screen bg-gray-200 p-2 border-lg rounded-lg">
//                 <nav>
//                     <ul className="space-y-2">
//                         <li>
//                             <button
//                                 onClick={() => setSelectedMenu("InvoiceList")}
//                                 className={`flex items-center p-2 rounded ${
//                                     selectedMenu === "InvoiceList"
//                                         ? "bg-gray-200 text-blue-600"
//                                         : "text-gray-700 hover:bg-gray-200"
//                                 }`}
//                             >
//                                 <i className="fas fa-table mr-3 text-lg "></i>
//                                 Invoice List
//                             </button>
//                         </li>
//                         <li>
//                             <button
//                                 onClick={() => setSelectedMenu("AddInvoice")}
//                                 className={`flex items-center p-2 rounded ${
//                                     selectedMenu === "AddInvoice"
//                                         ? "bg-gray-200 text-blue-600"
//                                         : "text-gray-700 hover:bg-gray-200"
//                                 }`}
//                             >
//                                 <i className="fas fa-plus mr-3"></i>
//                                 Add Invoice
//                             </button>
//                         </li>
//                     </ul>
//                 </nav>
//             </aside>
//             <main className="flex-grow p-6">{renderContent()}</main>
//         </div>
//     );
// };

// export default SideBaRR;























// import React from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Import useLocation to get current route
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHistory, faCalendarAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import AddInvoice from "./AddInvoice"; // Adjust path as necessary
// import InvoiceList from "./InvoiceList"; 

// const SidebarLayout = ({ user }) => {
//     const [selectedMenu, setSelectedMenu] = useState("AddInvoice");
//   // Menu items with routes
  
//   const renderContent = () => {
//     switch (selectedMenu) {
//         case "InvoiceList":
//             return <InvoiceList user={user}  />;
//         case "AddInvoice":
//         default:
//             return <AddInvoice user={user} />;
//     }
// };
//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <aside className="w-16 md:w-64 bg-white text-gray-800 rounded-r-3xl py-7 shadow-xl fixed h-full overflow-y-auto transition-all duration-300">
//         <nav className="px-2 md:px-4">
//           <ul className="flex flex-col gap-2">
//             {menuItems.map((item) => {
//               const isActive = location.pathname === item.route; // Check if the current route matches the menu item's route

//               return (
//                 <li key={item.name}>
//                   <button
//                        onClick={() => setSelectedMenu("InvoiceList")}
//                     className={`flex flex-col md:flex-row items-center justify-center md:justify-start w-full p-3 rounded-xl transition-all duration-300
//                       ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"}`}
//                     aria-label={`Go to ${item.name.replace(/([A-Z])/g, " $1").trim()}`}
//                   >
//                     <FontAwesomeIcon
//                       icon={item.icon}
//                       className={`w-6 h-6 md:mr-3 ${isActive ? "text-indigo-600" : "text-gray-400"}`}
//                     />
//                     <span className="hidden md:inline text-sm font-medium mt-2 md:mt-0">
//                       {item.name.replace(/([A-Z])/g, " $1").trim()}
//                     </span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 ml-16 md:ml-64 overflow-y-auto">
//         <Outlet /> {/* This will render the content based on the current route */}
//       </main>
//     </div>
//   );
// };

// export default SidebarLayout;




























import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet for route-based rendering if needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faCalendarAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import AddInvoice from "./AddInvoice"; // Adjust path as necessary
import InvoiceList from "./InvoiceList"; 

const SidebarLayout = ({ user }) => {
    const [selectedMenu, setSelectedMenu] = useState("AddInvoice");

    // Define menu items for the sidebar
    const menuItems = [
        { name: "InvoiceList", icon: faHistory },
        { name: "AddInvoice", icon: faCalendarAlt },
    ];

    // Function to render content based on selected menu
    const renderContent = () => {
        switch (selectedMenu) {
            case "InvoiceList":
                return <InvoiceList user={user} />;
            case "AddInvoice":
            default:
                return <AddInvoice user={user} />;
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-16 md:w-64 bg-white text-gray-800 rounded-r-3xl py-7 shadow-xl fixed h-full overflow-y-auto transition-all duration-300">
                <nav className="px-2 md:px-4">
                    <ul className="flex flex-col gap-2">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <button
                                    onClick={() => setSelectedMenu(item.name)} // Set selected menu item
                                    className={`flex flex-col md:flex-row items-center justify-center md:justify-start w-full p-3 rounded-xl transition-all duration-300 ${
                                        selectedMenu === item.name
                                            ? "bg-indigo-100 text-indigo-600"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                                    }`}
                                    aria-label={`Go to ${item.name.replace(/([A-Z])/g, " $1").trim()}`}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className={`w-6 h-6 md:mr-3 ${
                                            selectedMenu === item.name ? "text-indigo-600" : "text-gray-400"
                                        }`}
                                    />
                                    <span className="hidden md:inline text-sm font-medium mt-2 md:mt-0">
                                        {item.name.replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 ml-16 md:ml-64">
                {renderContent()} {/* Render content based on selected menu */}
            </main>
        </div>
    );
};

export default SidebarLayout;

