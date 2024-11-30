// src/pages/Broadcast/Broadcast.jsx

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHistory, faCalendarAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal";
import NewBroadcast from "../New-Broadcast";
import OverviewComponent from "../../components/OverviewComponent/OverviewComponet";
// import Overviews from "../../components/ManageClientsOverview/Overviews";
import DatePickerComponent from "../../components/DatePickerComponent/DatePickerComponent";

const Broadcast = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());
  const resetForm = useRef(null);
  const navigate = useNavigate();

  const handleModal = () => setIsModalOpen(!isModalOpen);
  const closeModal = () => {
    if (resetForm.current) resetForm.current();
    setIsModalOpen(false);
  };

  const BroadcastHistoryRedirect = () => navigate("/dashboard/whatsapp/broadcast");
  const ScheduledBroadcastsRedirect = () => navigate("/dashboard/whatsapp/scheduledbroadcasts");
  const TemplateMessagesRedirect = () => navigate("/dashboard/whatsapp/templates");

  return (
    <>
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-white text-gray-800 rounded-r-3xl py-7 shadow-xl fixed h-full overflow-y-auto transition-all duration-300">
        <nav className="px-2 md:px-4">
          <ul className="flex flex-col gap-2">
            {[
              { name: "BroadcastHistory", icon: faHistory, onClick: BroadcastHistoryRedirect },
              { name: "ScheduledBroadcasts", icon: faCalendarAlt, onClick: ScheduledBroadcastsRedirect },
              { name: "TemplateMessages", icon: faEnvelope, onClick: TemplateMessagesRedirect },
            ].map((item) => (
              <li key={item.name}>
                <button
                  onClick={item.onClick}
                  className="flex flex-col md:flex-row items-center justify-center md:justify-start w-full p-3 rounded-xl transition-all duration-300 text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                  aria-label={`Go to ${item.name.replace(/([A-Z])/g, " $1").trim()}`}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-6 h-6 md:mr-3 text-gray-400" />
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
      <main className="flex-1 ml-16 md:ml-64 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-md">
          {/* Header */}
          <div className="bg-white p-6 m-3.5 shadow-md mb-5 rounded-xl">
            <div className="flex justify-between items-center">
               <button
                onClick={() => navigate(-1)}
                className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
              </button>

              <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
                Campaign Details
              </h1>

              <button
                className="bg-white text-indigo-600 py-2 px-6 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
                onClick={handleModal}
                aria-label="Start a new broadcast"
              >
                New Broadcast →
              </button>
            </div>
          </div>

          {/* Overview and Date Picker */}
          <div className="overview-container bg-white rounded-xl shadow-lg p-6">
            <div className="w-full md:w-1/2 mb-6">
              <h1 className="text-2xl font-bold text-black py-6">Date Range Filter</h1>
              <div className="flex flex-col md:flex-row items-center mb-6 space-y-2 md:space-y-0 md:space-x-2">
                <DatePickerComponent onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
              </div>
            </div>
          </div>

          {/* <Overviews user={user} startDate={startDate} endDate={endDate} /> */}
          <OverviewComponent user={user} startDate={startDate} endDate={endDate} />
        </div>
      </main>

      {/* Modal for New Broadcast */}
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
          <NewBroadcast closeModal={closeModal} resetForm={resetForm} user={user} />
        </Modal>
      )}
    </>
  );
};

export default Broadcast;
