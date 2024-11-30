// src/pages/Analytics/AnalyticsPage.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";  // Import motion here
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DualAxisLineChart from "../../components/ChartComponent/DualAxisLineChart";
import Footer from "../../components/Footer/Footer";
import TemplateMessages from "../Broadcast/TemplateMessages.jsx";
import ScheduledBroadcasts from "../Broadcast/ScheduledBroadcasts.jsx";
import { CircularProgress } from "@material-ui/core";

const AnalyticsPage = ({ user, navigate }) => {
  const [activeMenuItem, setActiveMenuItem] = useState("BroadcastHistory");
  const [loading, setLoading] = useState(false);

  const handleMenuClick = (menuItem) => setActiveMenuItem(menuItem);

  const handleBack = () => {
    if (activeMenuItem !== "BroadcastHistory") {
      setActiveMenuItem("BroadcastHistory");
    } else {
      navigate(-1);
    }
  };

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  return (
    <>
      <main className="">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="bg-white rounded-xl shadow-md">
            <div className="bg-white p-6 m-3.5 shadow-md mb-5 rounded-xl">
              <div className="flex justify-between items-center">
                {/* <button
                  onClick={handleBack}
                  className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                  aria-label="Go back"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Back
                </button> */}

                <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
                Analytics
                </h1>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-full">
                <CircularProgress />
              </div>
            ) : (
              <>
                {activeMenuItem === "BroadcastHistory" && (
                  <div className="bg-white rounded-xl shadow-md">
                    <DualAxisLineChart user={user} startDate={startDate} endDate={endDate} />
                    <Footer />
                  </div>
                )}

                {activeMenuItem === "TemplateMessages" && (
                  <TemplateMessages user={user} onBack={handleBack} />
                )}

                {activeMenuItem === "ScheduledBroadcasts" && (
                  <ScheduledBroadcasts user={user} onBack={handleBack} />
                )}
              </>
            )}
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default AnalyticsPage;
