import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Removed useLocation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal";
import NewBroadcast from "../New-Broadcast";
import OverviewComponent from "../../components/OverviewComponent/OverviewComponet";
// import Overviews from "../../components/ManageClientsOverview/Overviews"
import DatePickerComponent from "../../components/DatePickerComponent/DatePickerComponent";
import IncomeCard from '../../components/Broadcast/Credits'; // IncomeCard now fetches its own data

const BroadcastHistory = ({ user }) => {
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

  return (
    <div className="p-6">
      {/* Main Content */}
      <>
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
            <div className="w-full mb-6">
              <h1 className="text-2xl font-bold text-black py-6">Date Range Filter</h1>
              <div className="flex flex-col md:flex-row items-center mb-6 space-y-2 md:space-y-0 md:space-x-2">
                <div>
                  <DatePickerComponent onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
                </div>

                <div className="my-6">
                  {/* Now, IncomeCard fetches the credits on its own */}
                  <IncomeCard user={user} title="WhatsApp Credits" />
                </div>

              </div>
            </div>
          </div>

          <OverviewComponent user={user} startDate={startDate} endDate={endDate} />
          {/* <Overviews user={user} startDate={startDate} endDate={endDate} /> */}
        </div>
      </>
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
          <NewBroadcast closeModal={closeModal} resetForm={resetForm} user={user} />
        </Modal>
      )}
    </div>
  );
};

export default BroadcastHistory;
