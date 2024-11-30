import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal";
import NewBroadcast from "./New-Broadcast.jsx";
// import OverviewComponet from "../../components/OverviewComponent/OverviewComponet.jsx";
import Overviews from "../../components/ManageClientsOverview/Overviews.jsx";
import DashboardNavbar from "../../components/Navbar/DashboardNavbar.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clients } from "../../services/api.js";

const Clients = ({ user }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBroadcasts = async () => {
    try {
      const response = await clients({
        action: "read", // Payload to send
        username: user, // Assuming username is 'user' as per your example
      });

      console.log("data", response);

      if (response.data && Array.isArray(response.data.data)) {
        setBroadcastData(response.data.data); // Store the fetched data
      } else {
        toast.error("Failed to fetch broadcast data");
      }
    } catch (error) {
      toast.error("Error fetching broadcast data");
      toast.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle modal opening
  const handleModal = () => {
    setIsModalOpen(true);
  };

  const backlogic = () => {
    navigate("/dashboard");
  };

  // Function to handle modal closing
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchBroadcasts();
  }, [user]);

  return (
    <div>
      <DashboardNavbar />

      <div className="p-10">
        {/* Header with Back Button and Heading */}
        <div className="flex w-full mr">
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl w-full">
            <div className="flex justify-between items-center">
              <button
                // Placeholder for back logic
                onClick={backlogic}
                className="bg-white text-indigo-600 py-2 px-2 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
              </button>

              <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
                Manage Clients
              </h1>

              <button
                className="bg-white text-indigo-600 py-2 px-6 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
                onClick={handleModal}
                aria-label="Start a new broadcast"
              >
                Add New Client +
              </button>
            </div>
          </div>


          {/* Modal Logic */}
          {isModalOpen && (
            <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
              <NewBroadcast
                closeModal={closeModal}
                user={user}
                refetchData={fetchBroadcasts}
              />
            </Modal>
          )}
        </div>

        <Overviews
          user={user}
          broadcastData={broadcastData}
          loading={loading}
          setBroadcastData={setBroadcastData} 
        />
      </div>
    </div>
  );
};

export default Clients;
