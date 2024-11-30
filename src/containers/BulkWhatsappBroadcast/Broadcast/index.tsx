import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faCalendarAlt,
  faEnvelope,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import NewBroadcast from "../New-Broadcast";
import Modal from "../../components/Modal";
import SuccessModal from "../../components/Modal/SuccessModal";
import DualAxisLineChart from "../../components/ChartComponent/DualAxisLineChart";
import Footer from "../../components/Footer/Footer";
import OverviewComponent from "../../../components/OverviewComponent/OverviewComponet.jsx";
import DatePickerComponent from "../../components/DatePickerComponent/DatePickerComponent";
import ScheduledBroadcasts from "./ScheduledBroadcasts.jsx";
import { CircularProgress } from "@material-ui/core";

const Broadcast = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("BroadcastHistory");
  const [isWhatsAppOfficial, setIsWhatsAppOfficial] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [applyClicked, setApplyClicked] = useState(true);
  const [loading, setLoading] = useState(false);

  const resetForm = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveMenuItem("BroadcastHistory");
  }, []);

  const handleModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => {
    if (resetForm.current) resetForm.current();
    setIsModalOpen(false);
  };
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    setIsWhatsAppOfficial(false);
  };

  const handleWhatsAppClick = () => setIsWhatsAppOfficial(true);

  const handleBack = () => {
    if (isWhatsAppOfficial) {
      setIsWhatsAppOfficial(false);
    } else if (activeMenuItem !== "BroadcastHistory") {
      setActiveMenuItem("BroadcastHistory");
    } else {
      navigate(-1);
    }
  };

  const handleApplyClick = () => {
    setApplyClicked(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulating loading state
  };

  return (
    <div className="flex bg-white">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-white text-indigo-600 rounded-r-xl py-7 shadow-lg p-2 fixed h-full overflow-y-auto transition-all duration-300">
        <nav>
          <ul className="flex flex-col gap-4">
            {[
              { name: "BroadcastHistory", icon: faHistory },
              { name: "ScheduledBroadcasts", icon: faCalendarAlt },
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
      <main className="flex-1 ml-16 md:ml-64 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl px-3"
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          ) : (
            <>
              {!isWhatsAppOfficial ? (
                <>
                  {activeMenuItem === "BroadcastHistory" && (
                    <div className="bg-white rounded-xl shadow-md">
                      <div className="bg-white p-6 m-3.5 shadow-md mb-5 rounded-xl">
                        <div className="flex justify-between items-center">
                          {/* Back Button */}
                          <button
                            onClick={handleBack}
                            className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                            aria-label="Go back"
                          >
                            <FontAwesomeIcon
                              icon={faArrowLeft}
                              className="mr-2"
                            />
                            Back
                          </button>

                          {/* Centered Title */}
                          <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
                            Manage Broadcast Services
                          </h1>

                          {/* WhatsApp Official Button */}
                          <button
                            className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                            onClick={handleWhatsAppClick}
                            aria-label="Start a new campaign"
                          >
                            New campaign →
                          </button>
                        </div>
                      </div>
                      <DualAxisLineChart
                        user={user}
                        startDate={startDate}
                        endDate={endDate}
                      />
                      <Footer />
                    </div>
                  )}

                
                  {activeMenuItem === "ScheduledBroadcasts" && (
                    <ScheduledBroadcasts user={user} onBack={handleBack} />
                  )}
                </>
              ) : (
                // WhatsApp official page content
                <div className="bg-white rounded-xl shadow-md">
                  {/* header */}
                  <div className="bg-white p-6 m-3.5 shadow-md mb-5 rounded-xl">
                    <div className="flex justify-between items-center">
                      {/* Back Button */}
                      <button
                        onClick={handleBack}
                        className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                        aria-label="Go back"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Back
                      </button>

                      {/* Centered Title */}
                      <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
                        Campaign Details
                      </h1>

                      {/* WhatsApp Official Button */}
                      <button
                        className="bg-white text-indigo-600 py-2 px-6 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
                        onClick={handleModal}
                        aria-label="Start a new broadcast"
                      >
                        New Broadcast →
                      </button>
                    </div>
                  </div>
                  {/* header */}
                  <div className="overview-container bg-white rounded-xl shadow-lg p-6">
                    <div className="w-full md:w-1/2 mb-6">
                      <h1 className="text-2xl font-bold text-black py-6">
                        Date Range Filter
                      </h1>
                      <div className="flex flex-col md:flex-row items-center mb-6 space-y-2 md:space-y-0 md:space-x-2">
                        <DatePickerComponent
                          // startDate={startDate}
                          // endDate={endDate}
                          onStartDateChange={setStartDate}
                          onEndDateChange={setEndDate}
                        />
                        <button
                          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          onClick={handleApplyClick}
                          aria-label="Apply date range filter"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>

                  <OverviewComponent
                    user={user}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>

      {/* Modals */}
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
          <NewBroadcast
            closeModal={closeModal}
            resetForm={resetForm}
            user={user}
          />
        </Modal>
      )}
      {isSuccessModalOpen && (
        <SuccessModal
          isSuccessModalOpen={isSuccessModalOpen}
          closeSuccessModal={closeSuccessModal}
        />
      )}
    </div>
  );
};

export default Broadcast;
