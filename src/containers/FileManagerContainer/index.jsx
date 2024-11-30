import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFile, faQuestion } from "@fortawesome/free-solid-svg-icons";
import Support from "./Support.jsx";
import Files from "./Files.jsx";
import FileManager from "./FileManager.jsx";
import DashboardNavbar from '../../components/Navbar/DashboardNavbar.jsx';
import './filemanager.css';

const FileManagerContainer = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("File Hosting");

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };

  const renderPage = () => {
    switch (activeMenuItem) {
      case "File Hosting":
        return <FileManager />;
      case "Files":
        return <Files />;
      case "Support":
        return <Support />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex bg-white">
      {/* Sidebar */}
      <aside className="sidebar w-16 md:w-64 bg-white text-indigo-600 rounded-r-xl py-8 shadow-lg p-2 fixed h-full overflow-y-auto transition-all duration-300 top: 60px"> {/* Adjusted position */}
        <nav>
          <ul className="flex flex-col gap-4">
            {[
                { name: "File Hosting", icon: faFolder },
                { name: "Files", icon: faFile },
                { name: "Support", icon: faQuestion },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleMenuClick(item.name)}
                  className={`flex flex-col md:flex-row items-center text-blue font-bold p-2 rounded-lg hover:bg-indigo-100 w-full transition duration-300 ${
                    activeMenuItem === item.name ? "bg-blue-100" : ""
                  }`}
                  aria-label={`Go to ${item.name
                    .replace(/([A-Z])/g, " $1")
                    .trim()}`}
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

      {/* Main Content Area */}
      <main className="flex-1 ml-16 md:ml-64 ">
      <DashboardNavbar />
        {renderPage()}
      </main>
    </div>
  );
};

export default FileManagerContainer;