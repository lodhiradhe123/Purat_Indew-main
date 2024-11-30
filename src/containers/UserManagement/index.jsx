import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Modal1 from "../../components/UserManagement/Modal";
import AddUserForm from "../../components/UserManagement/AddUserForm";
import AddTeamForm from "../../components/UserManagement/AddTeamForm";
import UsersTable from "../../components/UserManagement/UsersTable";
import TeamsTable from "../../components/UserManagement/TeamsTable";

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUserPlus,
  faUsers,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

const UserManagement = ({ active, onClick, user }) => {
  const [activeTable, setActiveTable] = useState("users");
  const [notification, setNotification] = useState(null);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const navigate = useNavigate();
  const openUserModal = () => setIsUserModalOpen(true);
  const closeUserModal = () => setIsUserModalOpen(false);
  const openTeamModal = () => setIsTeamModalOpen(true);
  const closeTeamModal = () => setIsTeamModalOpen(false);

  const handleTabChange = (newValue) => {
    setActiveTable(newValue);
    setPage(0);
    setNotification(
      `Switched to ${newValue === "users" ? "Users" : "Teams"} view`
    );
    setTotalRows(newValue === "users" ? users.length : teams.length);
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  const handleAddClick = () => {
    if (activeTable === "users") {
      openUserModal();
    } else {
      openTeamModal();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API calls
        const usersData = []; // await fetch('users-api-endpoint').then(res => res.json());
        const teamsData = []; // await fetch('teams-api-endpoint').then(res => res.json());

        setUsers(usersData);
        setTeams(teamsData);
        setTotalRows(
          activeTable === "users" ? usersData.length : teamsData.length
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotification("Error fetching data. Please try again.");
      }
    };

    fetchData();
  }, [activeTable]);

  const displayedItems =
    activeTable === "users"
      ? users.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
      : teams.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg m-6 p-6">
        <div className="flex justify-between items-center bg-white p-6 m-3.5 shadow-md mb-5 rounded-xl">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-indigo-600 hover:text-indigo-800 transition duration-300 flex items-center"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back
          </button>

          <h1 className="text-3xl font-bold text-indigo-800">
            User Management
          </h1>

          <button
            onClick={handleAddClick}
            className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition duration-300 flex items-center"
            aria-label={activeTable === "users" ? "Add User" : "Add Team"}
          >
            <FontAwesomeIcon
              icon={activeTable === "users" ? faUserPlus : faUserGroup}
              className="mr-2"
            />
            {activeTable === "users" ? "Add User" : "Add Team"}
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => handleTabChange("users")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTable === "users"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Users
            </button>
            <button
              onClick={() => handleTabChange("teams")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTable === "teams"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
              Teams
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTable}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTable === "users" ? (
              <UsersTable users={displayedItems} user={user} />
            ) : (
              <TeamsTable teams={displayedItems} user={user} />
            )}
          </motion.div>
        </AnimatePresence>

        <Modal1 isOpen={isUserModalOpen} onClose={closeUserModal}>
          <AddUserForm onClose={closeUserModal} user={user} />
        </Modal1>
        <Modal1 isOpen={isTeamModalOpen} onClose={closeTeamModal}>
          <AddTeamForm onClose={closeTeamModal} user={user} />
        </Modal1>
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-6 py-3 rounded-md shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
