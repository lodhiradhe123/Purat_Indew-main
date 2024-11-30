import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../../services/api";

const MENU_ITEMS = [
  { name: "TeamInbox", icon: "inbox", path: "/dashboard/bulkwhatsapp/teamInbox" },
  { name: "Broadcast", icon: "broadcast-tower", path: "/dashboard/bulkwhatsapp/broadcast" },
  { name: "Chatbots", icon: "robot", path: "/dashboard/bulkwhatsapp/chatbots" },
  { name: "CRM", icon: "address-book", path: "/dashboard/bulkwhatsapp/crm" },
  { name: "Contacts", icon: "address-book", path: "/dashboard/bulkwhatsapp/contacts" },
  { name: "Automations", icon: "cogs", path: "/dashboard/bulkwhatsapp/automations" },
];

const DROPDOWN_ITEMS = [
  { name: "Analytics", icon: "chart-bar", path: "/dashboard/bulkwhatsapp/analytics" },
  { name: "API docs", icon: "code", path: "/dashboard/bulkwhatsapp/api-docs" },
  { name: "User Management", icon: "users", path: "/dashboard/bulkwhatsapp/user-management" },
  { name: "Integration", icon: "plug", path: "/dashboard/bulkwhatsapp/integration" },
  { name: "Web Hooks", icon: "exchange-alt", path: "/dashboard/bulkwhatsapp/webhooks" },
  { name: "Commerce", icon: "shopping-cart", path: "/dashboard/bulkwhatsapp/commerce" },
];

const bulkwhatsapp = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleUserSidebar = useCallback(() => setUserSidebarOpen(prev => !prev), []);
  const toggleDropdown = useCallback(() => setDropdownOpen(prev => !prev), []);

  const handleMenuItemClick = useCallback((path) => {
    navigate(path);
    setSidebarOpen(false);
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [setUser, navigate]);

  const renderMenuItem = useCallback((item) => (
    <motion.li key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <button
        onClick={() => handleMenuItemClick(item.path)}
        className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.path
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-700 hover:bg-gray-100"
          }`}
      >
        <i className={`fas fa-${item.icon} mr-3 text-lg`}></i>
        <span>{item.name}</span>
      </button>
    </motion.li>
  ), [handleMenuItemClick, location.pathname]);

  const renderBreadcrumb = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return (
      <nav className="text-sm font-medium" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          {paths.map((path, index) => (
            <li key={path} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              <Link to={`/${paths.slice(0, index + 1).join('/')}`} className="capitalize text-gray-600 hover:text-indigo-600">
                {path}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Open menu"
            >
              <i className="fas fa-bars"></i>
            </button>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <button
                className="text-4xl font-bold text-indigo-600"
                onClick={() => navigate("/dashboard")}
              >
                PuRat
              </button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-8 items-center justify-center flex-1">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMenuItemClick(item.path)}
                  className={`text-lg font-medium transition-colors ${location.pathname === item.path
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="relative group" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-lg font-medium text-gray-500 hover:text-gray-900 transition-colors focus:outline-none"
                >
                  More <i className="fas fa-chevron-down ml-1"></i>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 list-none"
                    >
                      {DROPDOWN_ITEMS.map(renderMenuItem)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Notifications"
              >
                <i className="fas fa-bell"></i>
              </button>
              <button
                onClick={toggleUserSidebar}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="User menu"
              >
                <i className="fas fa-user"></i>
              </button>
            </div>
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm fixed top-16 left-0 right-0 z-10 py-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
            {renderBreadcrumb()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 p-0">
        <Outlet />
      </main>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 md:hidden list-none"
              onClick={toggleSidebar}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-40 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4">
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <button
                    className="text-2xl font-bold text-indigo-600"
                    onClick={() => {
                      navigate("/dashboard");
                      setSidebarOpen(false);
                    }}
                  >
                    PuRat
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ul className="p-2 space-y-2">{MENU_ITEMS.map(renderMenuItem)}</ul>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* User Sidebar */}
      <AnimatePresence>
        {userSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 md:hidden list-none"
              onClick={toggleUserSidebar}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-40 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4">
                  <button
                    onClick={toggleUserSidebar}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <button
                    className="text-2xl font-bold text-indigo-600"
                    onClick={() => {
                      navigate("/dashboard");
                      setUserSidebarOpen(false);
                    }}
                  >
                    PuRat
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ul className="p-2 space-y-2">
                    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors text-red-600 hover:bg-red-100"
                      >
                        <i className="fas fa-sign-out-alt mr-3 text-lg"></i>
                        <span>Logout</span>
                      </button>
                    </motion.li>
                  </ul>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default bulkwhatsapp;
