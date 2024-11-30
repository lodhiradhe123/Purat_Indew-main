import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { logout } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faUser,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ProfileIcon from "../../../public/assets/images/svg/user-profile.svg";
// Load Google Font (use Poppins or Montserrat for a clean look)

const MENU_ITEMS = [
  { name: "IBR", icon: "address-book", path: "/dashboard/voice/crm" },
  {
    name: "Broadcast",
    icon: "broadcast-tower",
    path: "/dashboard/voice/broadcast",
  },
  { name: "Contacts", icon: "address-book", path: "/dashboard/voice/contacts" },
  { name: "Automations", icon: "cogs", path: "/dashboard/voice/automations" },
  { name: "API", icon: "code", path: "/dashboard/voice/api" },
];

const VoiceNavbar = ({ user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const toggleUserSidebar = useCallback(
    () => setUserSidebarOpen((prev) => !prev),
    []
  );

  const handleMenuItemClick = useCallback(
    (path) => {
      navigate(path);
      setSidebarOpen(false);
    },
    [navigate]
  );

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

  const renderMenuItem = useCallback(
    (item) => (
      <motion.li
        key={item.name}
        whileHover={{ scale: 1.05, backgroundColor: "#E0F7FF" }} // Light hover effect
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={() => handleMenuItemClick(item.path)}
          className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors 
          ${
            location.pathname === item.path
              ? "bg-blue-100 text-blue-600" // Active state with royal blue
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <i className={`fas fa-${item.icon} mr-3 text-lg`}></i>
          <span>{item.name}</span>
        </button>
      </motion.li>
    ),
    [handleMenuItemClick, location.pathname]
  );

  const renderBreadcrumb = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    return (
      <nav
        className="text-sm font-medium text-gray-500"
        aria-label="Breadcrumb"
      >
        <ol className="list-none p-0 inline-flex">
          {paths.map((path, index) => (
            <li key={path} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              <Link
                to={`/${paths.slice(0, index + 1).join("/")}`}
                className="capitalize text-gray-600 hover:text-blue-500"
              >
                {path}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top bar */}
      <header className="bg-white shadow fixed top-0 left-0 right-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                className="text-4xl font-semibold text-blue-600 tracking-tight"
                onClick={() => navigate("/dashboard")}
              >
                PuRat
              </button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-6">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMenuItemClick(item.path)}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-blue-600 border-b-2 border-blue-500"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  <i className={`fas fa-${item.icon} mr-2`}></i>
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Notifications"
              >
                <FontAwesomeIcon icon={faBell} />
              </button>
              <button
                onClick={toggleUserSidebar}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="User menu"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white py-2">
          <div className="max-w-screen-2xl mx-auto px-8">
            {renderBreadcrumb()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24  bg-white">
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
              className="fixed inset-0 bg-gray-600 bg-opacity-50 z-30"
              onClick={toggleSidebar}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-40"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <button
                    className="text-2xl font-semibold text-blue-600 tracking-tight"
                    onClick={() => {
                      navigate("/dashboard");
                      setSidebarOpen(false);
                    }}
                  >
                    Purat
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <ul>{MENU_ITEMS.map(renderMenuItem)}</ul>
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
              className="fixed inset-0 bg-gray-600 bg-opacity-50 z-30"
              onClick={toggleUserSidebar}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-40"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    User Profile
                  </h2>
                  <button
                    onClick={toggleUserSidebar}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close sidebar"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <div className="mb-6 text-center">
                  <img
                    src={ProfileIcon}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full mx-auto"
                  />
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">
                    {user?.username}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </button>
                  <button
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => navigate("userprofile/settings")}
                  >
                    Settings
                  </button>
                  <button
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => navigate("userprofile/ProfileSettings")}
                  >
                    Profile Settings
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceNavbar;
