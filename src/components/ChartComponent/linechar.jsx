// import React, { useState, useEffect } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import { fetchChartdata } from '../../services/api';

// const DualAxisLineChart = () => {
//     const [data, setData] = useState([]);
//     const [startDate, setStartDate] = useState(new Date('2024-07-13'));
//     const [endDate, setEndDate] = useState(new Date('2024-07-24'));

//     useEffect(() => {
//         // Fetch data from API
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(fetchChartdata);
//                 if (response.data.success) {
//                     setData(response.data.data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data', error);
//             }
//         };
//         fetchData();
//     }, []);

//     const filteredData = data.filter(item => {
//         const date = new Date(item.date);
//         return date >= startDate && date <= endDate;
//     });

//     const chartData = {
//         series: [{
//             name: 'Numbers',
//             data: filteredData.map(item => parseInt(item.numbers))
//         }],
//         options: {
//             chart: {
//                 type: 'line',
//                 height: 350
//             },
//             xaxis: {
//                 categories: filteredData.map(item => item.date)
//             }
//         }
//     };

//     return (
//         <div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//                 <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
//                 <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
//             </div>
//             <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
//         </div>
//     );
// };

// export default DualAxisLineChart;



