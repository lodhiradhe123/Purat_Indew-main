import React, { useState } from "react";
import ApexCharts from "react-apexcharts"; // Import ApexCharts
import { motion } from "framer-motion"; // For smooth animations

const StatsModal = ({ statsData, baseUrl, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Hours");

  // Function to format the chart data based on the active tab (Hours, Days, Months)
  const formatChartData = (clicksData, type) => {
    const categories = [];
    const dataSeries = [];

    if (type === "Hours") {
      for (const [time, clicks] of Object.entries(clicksData)) {
        let hour = parseInt(time.split(" - ")[0], 10);
        let period = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12; // Convert to 12-hour format
        categories.push(`${hour} ${period}`);
        dataSeries.push(clicks);
      }
    } else if (type === "Days") {
      for (const [date, clicks] of Object.entries(clicksData)) {
        const [year, month, day] = date.split("-");
        categories.push(`${day}/${month}`);
        dataSeries.push(clicks);
      }
    } else if (type === "Months") {
      for (const [month, clicks] of Object.entries(clicksData)) {
        const monthName = new Date(0, parseInt(month.split("-")[1]) - 1).toLocaleString("default", {
          month: "short",
        });
        categories.push(monthName);
        dataSeries.push(clicks);
      }
    }

    return {
      categories,
      series: [
        {
          name: "Clicks",
          data: dataSeries,
        },
      ],
    };
  };

  // ApexCharts options for the chart
  const chartOptions = {
    chart: {
      id: "clicks-chart",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 500,
      },
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: "#555", // Darker labels for readability
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: { text: "Clicks", style: { color: "#555", fontSize: "14px" } },
    },
    dataLabels: { enabled: false },
    colors: ["#1e88e5"], // A modern blue color
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: ["#81d4fa"], // Soft gradient for bars
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
      },
    },
    tooltip: {
      theme: "dark", // Dark theme for tooltips
    },
  };

  // Don't render the modal if `isOpen` is false
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-800">URL Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* URL Details */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            <strong>Short URL:</strong> {`${baseUrl}${statsData.s_url}`}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Long URL:</strong>{" "}
            <a href={statsData.l_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {`${statsData.l_url.substring(0, 50)}...`}
            </a>
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Created At:</strong> {new Date(statsData.created_at).toLocaleString()}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Total Clicks:</strong>{" "}
            {Object.values(statsData.clicks_count.last_24_hours).reduce((sum, clicks) => sum + clicks, 0)}
          </p>
          <p className="text-gray-600">
            <strong>Last Click:</strong> {new Date(statsData.updated_at).toLocaleString()}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex space-x-6 mb-6 border-b pb-2">
          <button
            onClick={() => setActiveTab("Hours")}
            className={`pb-2 transition-all duration-300 ${
              activeTab === "Hours"
                ? "text-blue-500 border-b-4 border-blue-500 font-bold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Hours
          </button>
          <button
            onClick={() => setActiveTab("Days")}
            className={`pb-2 transition-all duration-300 ${
              activeTab === "Days"
                ? "text-blue-500 border-b-4 border-blue-500 font-bold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Days
          </button>
          <button
            onClick={() => setActiveTab("Months")}
            className={`pb-2 transition-all duration-300 ${
              activeTab === "Months"
                ? "text-blue-500 border-b-4 border-blue-500 font-bold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Months
          </button>
        </div>

        {/* Apex Chart Display */}
        <div className="mt-4">
          <ApexCharts
            options={{
              ...chartOptions,
              xaxis: {
                ...chartOptions.xaxis,
                categories: formatChartData(
                  activeTab === "Hours"
                    ? statsData.clicks_count.last_24_hours
                    : activeTab === "Days"
                    ? statsData.clicks_count.last_30_days
                    : statsData.clicks_count.last_12_months,
                  activeTab
                ).categories,
              },
            }}
            series={formatChartData(
              activeTab === "Hours"
                ? statsData.clicks_count.last_24_hours
                : activeTab === "Days"
                ? statsData.clicks_count.last_30_days
                : statsData.clicks_count.last_12_months,
              activeTab
            ).series}
            type="bar"
            height="300"
          />
        </div>

        {/* Close Button */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsModal;
