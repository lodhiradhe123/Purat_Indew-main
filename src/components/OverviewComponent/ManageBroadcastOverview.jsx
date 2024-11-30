import React from 'react';
import {
  FaTicketAlt, FaClock, FaCheckCircle, FaRobot, FaUserCheck, FaTimesCircle, FaUserTimes
} from 'react-icons/fa';


const Overview = () => {
  const data = [
    { label: 'Open Ticket', count: 10, icon: <FaTicketAlt /> },
    { label: 'Pending', count: 5, icon: <FaClock /> },
    { label: 'Solved', count: 25, icon: <FaCheckCircle /> },
    { label: 'Solved by Bot', count: 15, icon: <FaRobot /> },
    { label: 'Solved by User', count: 30, icon: <FaUserCheck /> },
    { label: 'Expired', count: 3, icon: <FaTimesCircle /> },
    { label: 'Expired without User Reply', count: 1, icon: <FaUserTimes /> },
  ];

  return (
    <div className="overview-container bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Overview</h1>
      <div className="overview-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="overview-item bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="icon text-indigo-500 text-5xl mb-4">
              {item.icon}
            </div>
            <span className="count text-4xl font-bold text-indigo-600">{item.count}</span>
            <span className="label text-sm text-gray-500 mt-2">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
