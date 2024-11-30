import React, { useState, useEffect } from 'react';
import { fetchbroadcast } from '../../services/api';
import BroadcastList from '../Broadcast/BroadcastList';
// import ManageClientss from '../ManageClientss/ClientsBoard';
import './Overview.css';

const OverviewComponent = ({ user, startDate, endDate }) => {
  const [stats, setStats] = useState([
    { label: 'Sending', value: 0, icon: '▶️' },
    { label: 'Pending', value: 0, icon: '📋' },
    { label: 'Delivered', value: 0, icon: '✔️' },
    { label: 'Failed', value: 0, icon: '❌' },
    { label: 'Read', value: 0, icon: '👁️' },
    { label: 'Sent', value: 0, icon: '✔️' },
    { label: 'Invalid', value: 0, icon: '❗' },
    { label: 'Stopped', value: 0, icon: '🚫' },
    { label: 'Blocked', value: 0, icon: '🚫' },
    { label: 'Receiver incapable', value: 0, icon: '🚫' },
  ]);

  const [broadcastData, setBroadcastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchbroadcast({
          action: 'read',
          username: user.username,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        });
  
        const data = response.data.data;
        setBroadcastData(response?.data?.campaign_details);
  
        // Only update stats after receiving the response
        const updatedStats = stats.map(stat => {
          const apiStat = data.find(item => {
            switch (stat.label) {
              case 'Sending':
                return item.status === '1';
              case 'Pending':
                return item.status.startsWith('PP');
              case 'Delivered':
                return item.status === 'delivered';
              case 'Failed':
                return item.status === 'failed';
              case 'Read':
                return item.status === 'read';
              case 'Sent':
                return item.status === 'sent';
              case 'Invalid':
                return item.status === 'Invalid';
              case 'Stopped':
                return item.status === 'Stopped';
              case 'Blocked':
                return item.status === 'Blocked';
              case 'Receiver incapable':
                return item.status === 'Incapable';
              default:
                return false;
            }
          });
  
          return {
            ...stat,
            value: apiStat ? apiStat.count : 0,
          };
        });
  
        setStats(updatedStats);
      } catch (error) {
        console.error('Error fetching data', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    // Only run this effect when user, startDate, or endDate change
  }, [user, startDate, endDate]);
  
  
  

  return (
    <div className="overview-container bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold text-black py-6">Overview</h1>
      {error && <div className="text-red-600 mb-4">Error: {error.message}</div>}
      <div className="overview-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="overview-item flex flex-col items-center justify-center bg-gray-100 p-2 rounded-lg shadow-md">
            <div className="overview-value text-xl md:text-2xl font-bold text-indigo-600 mb-1">{stat.value}</div>
            <div className="overview-icon text-lg md:text-xl">{stat.icon}</div>
            <div className="overview-label text-sm md:text-md text-gray-700 text-center">{stat.label}</div>
          </div>
        ))}
      </div>
     
      <div>
        <BroadcastList broadcastData={broadcastData} user={user} loading={loading} />
      
      </div>
    </div>
  );
};

export default OverviewComponent;






// import React, { useState } from 'react';
// import ClientBoard from '../ManageClientss/ClientsBoard';
// import DashboardNavbar from '../Navbar/DashboardNavbar';


// const OverviewComponent = ({ user, startDate, endDate, broadcastData }) => {
//   const [stats, setStats] = useState([
//     { label: 'WHATSAPP', value: 0, icon: '▶️' },
//     { label: 'VOICE CALL', value: 0, icon: '📋' },
//     { label: 'WHATSAPP BUTTON', value: 0, icon: '✔️' },
//     { label: 'TRANSACTIONAL SMS', value: 0, icon: '❌' },
//     { label: 'PROMOTIONAL SMS', value: 0, icon: '👁️' },
//     { label: 'GSM SMS', value: 0, icon: '✔️' },
//     { label: 'GLOBAL SMS', value: 0, icon: '❗' },
//     { label: 'BUSINESS WHATSAPP', value: 0, icon: '🚫' },
//     { label: 'TELEGRAM', value: 0, icon: '🚫' },
//     { label: 'WHATSAPP SCRUB', value: 0, icon: '🚫' },
//     { label: 'WHATSAPP VOICE CALLS', value: 0, icon: '🚫' },
//     { label: 'DYANMIC WHATSAPP API', value: 0, icon: '🚫' },
//   ]);

//   const [loading] = useState(false);
//   const [error] = useState(null);

//   return (
   
//     <div className="overview-container bg-white rounded-xl shadow-lg p-6">
//       <h1 className="text-2xl font-bold text-black py-6">Overview</h1>
//       {error && <div className="text-red-600 mb-4">Error: {error.message}</div>}
//       <div className="overview-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//         {stats.map((stat, index) => (
//           <div key={index} className="overview-item flex flex-col items-center justify-center bg-gray-100 p-2 rounded-lg shadow-md">
//             <div className="overview-value text-xl md:text-2xl font-bold text-indigo-600 mb-1">{stat.value}</div>
//             <div className="overview-icon text-lg md:text-xl">{stat.icon}</div>
//             <div className="overview-label text-sm md:text-md text-gray-700 text-center">{stat.label}</div>
//           </div>
//         ))}
//       </div>
     
//       <div>
//         <ClientBoard broadcastData={broadcastData} user={user} loading={loading} />
//       </div>
//     </div>
//   );
// };

// export default OverviewComponent;
