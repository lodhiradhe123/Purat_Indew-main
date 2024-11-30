import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFile, faQuestion, faSignInAlt, faUserCog, faTrash, faDownload, faTags } from "@fortawesome/free-solid-svg-icons";

import DashboardNavbar from '../../components/Navbar/DashboardNavbar.jsx';
import './index.css';
import LoginIntefration from "./LoginIntefration.jsx";


const FileManagerContainer = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("File Hosting");

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const renderPage = () => {
    switch (activeMenuItem) {
      // case "File Hosting":
      //   return <FileManager />;
      // case "Files":
      //   return <Files />;
      // case "Support":
      //   return <Support />;

        case "Login Integration":
          return <LoginIntefration />;
      default:
        return <LoginIntefration />;
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <aside className="sidebar w-16 md:w-64 bg-white text-indigo-600 rounded-r-xl py-8 shadow-lg p-2 fixed h-full overflow-y-auto transition-all duration-300 top: 60px">
        <nav>
          <ul className="flex flex-col gap-4">
            {[
                { name: "Login Integration", icon: faSignInAlt },
                { name: "Your Integration", icon: faUserCog },
                { name: "Reseller Settings", icon: faUserCog },
                { name: "Message Deletion", icon: faTrash },
                { name: "Export Chats", icon: faDownload },
                { name: "Tags and Attributes", icon: faTags }
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleMenuClick(item.name)}
                  className={`flex flex-col md:flex-row items-center text-blue font-bold p-2 rounded-lg hover:bg-indigo-100 w-full transition duration-300 ${
                    activeMenuItem === item.name ? "bg-blue-100" : ""
                  }`}
                  aria-label={`Go to ${item.name.replace(/([A-Z])/g, " $1").trim()}`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-6 h-6 md:mr-2"
                  />
                  <span className="hidden md:inline text-sm">
                    {item.name.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 ml-16 md:ml-64">
        <DashboardNavbar />
        {renderPage()}
      </main>
    </div>
  );
};

export default FileManagerContainer;

