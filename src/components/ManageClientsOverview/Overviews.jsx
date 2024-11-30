import React, { useState } from "react";
import DashboardNavbar from "../Navbar/DashboardNavbar";
// import BroadcastList from '../ManageClientss/ClientsBoard';

import ClientsBoard from "../ManageClientss/ClientsBoard";

const Overviews = ({ user, setUser, broadcastData, setBroadcastData, loading }) => {
  const [stats, setStats] = useState([
    { label: "WHATSAPP", value: 0, icon: "▶️" },
    { label: "VOICE CALL", value: 0, icon: "📋" },
    { label: "WHATSAPP BUTTON", value: 0, icon: "✔️" },
    { label: "TRANSACTIONAL SMS", value: 0, icon: "❌" },
    { label: "PROMOTIONAL SMS", value: 0, icon: "👁️" },
    { label: "GSM SMS", value: 0, icon: "✔️" },
    { label: "GLOBAL SMS", value: 0, icon: "❗" },
    { label: "BUSINESS WHATSAPP", value: 0, icon: "🚫" },
    { label: "TELEGRAM", value: 0, icon: "🚫" },
    { label: "WHATSAPP SCRUB", value: 0, icon: "🚫" },
    { label: "WHATSAPP VOICE CALLS", value: 0, icon: "🚫" },
    { label: "DYANMIC WHATSAPP API", value: 0, icon: "🚫" },
  ]);

  const [error] = useState(null);
  console.log('setUser in Overviews:', setUser);

  return (
    <div className="overview-container bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-black py-6">Overview</h1>
      {error && <div className="text-red-600 mb-4">Error: {error.message}</div>}
      <div className="overview-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="overview-item flex flex-col items-center justify-center bg-gray-100 p-2 rounded-lg shadow-md"
          >
            <div className="overview-value text-xl md:text-2xl font-bold text-indigo-600 mb-1">
              {stat.value}
            </div>
            <div className="overview-icon text-lg md:text-xl">{stat.icon}</div>
            <div className="overview-label text-sm md:text-md text-gray-700 text-center">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div>
        <ClientsBoard
          user={user}
          setUser={setUser}
          broadcastData={broadcastData}
          setBroadcastData={setBroadcastData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Overviews;
