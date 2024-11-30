
// import React, { useState, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Modal,
//   Backdrop,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   CircularProgress,
//   Button,
//   TableSortLabel,
//   TablePagination,
// } from '@material-ui/core';
// import { Close as CloseIcon, GetApp as GetAppIcon } from '@material-ui/icons';
// import 'tailwindcss/tailwind.css';
// import { makeStyles } from '@material-ui/core/styles';
// import StatusPieChart from './StatusPieChart.jsx';

// // Custom styles for the component
// const useStyles = makeStyles((theme) => ({
//   tableContainer: {
//     marginTop: theme.spacing(3),
//     overflowX: 'auto',
//   },
//   tableHead: {
//     backgroundColor: theme.palette.primary.main,
//   },
//   tableHeadCell: {
//     color: theme.palette.common.white,
//     fontWeight: 600,
//   },
//   tableRow: {
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//     },
//   },
//   pagination: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: theme.spacing(2),
//   },
//   modalContent: {
//     position: 'relative',
//     backgroundColor: theme.palette.background.paper,
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(4),
//     maxWidth: '90vw',
//     maxHeight: '90vh',
//     overflowY: 'auto', // Ensure vertical scrollbar appears when content overflows
//     borderRadius: theme.shape.borderRadius,
//   },
// }));

// // Main component function
// const BroadcastDetailsModal = ({ open, handleClose, requestId, username, name, date, time, broadcastData }) => {
//   const classes = useStyles(); // Using custom styles
//   const [page, setPage] = useState(0); // State for pagination page
//   const [rowsPerPage, setRowsPerPage] = useState(5); // State for rows per page in pagination
//   const [orderBy, setOrderBy] = useState(''); // State for sorting column
//   const [order, setOrder] = useState('asc'); // State for sorting order
//   const [statusCounts, setStatusCounts] = useState({});

//   // Memoized sorted broadcast data
//   const sortedBroadcasts = useMemo(() => {
//     let sorted = [...broadcastData];
//     if (orderBy) {
//       sorted.sort((a, b) => {
//         if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
//         else if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
//         else return 0;
//       });
//     }
//     return sorted;
//   }, [broadcastData, orderBy, order]);

//   // Memoized paginated broadcast data
//   const paginatedBroadcasts = useMemo(() => {
//     const start = page * rowsPerPage;
//     return sortedBroadcasts.slice(start, start + rowsPerPage);
//   }, [sortedBroadcasts, page, rowsPerPage]);

//   // Handle CSV download
//   const handleDownloadCSV = () => {
//     const headers = ['ID', 'Broadcast Name', 'Date', 'Time', 'Template', 'Receiver', 'Status', 'Media1', 'Media2', 'Media3', 'Media4', 'Media5', 'Media6', 'Media7', 'Media8', 'Media9', 'Media10', 'Media11', 'Media12', 'Media13'];
//     const csvContent = [
//       headers.join(','),
//       ...sortedBroadcasts.map((item) =>
//         [item.id, name, date, time, item.template_id, item.receiver, item.status, item.media1, item.media2, item.media3, item.media4, item.media5, item.media6, item.media7, item.media8, item.media9, item.media10, item.media11, item.media12, item.media13].join(',')
//       ),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `broadcast_details_${Date.now()}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   // Handle page change in pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change in pagination
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Handle sorting column change
//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   return (
//     <Modal
//       aria-labelledby="transition-modal-title"
//       aria-describedby="transition-modal-description"
//       open={open}
//       onClose={handleClose}
//       closeAfterTransition
//       BackdropComponent={Backdrop}
//       BackdropProps={{ timeout: 500 }}
//       className="flex items-center justify-center"
//     >
//       <div className={`${classes.modalContent} bg-white rounded-lg p-6 max-w-4xl shadow-lg transition-transform duration-300 ease-in-out`}>
//         <div className="flex justify-between  mb-4">
//           <h2 id="transition-modal-title" className="text-2xl font-bold">Broadcast Details</h2>
          
//           <div>
//             <StatusPieChart data={statusCounts} />
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button variant="contained" color="primary" onClick={handleDownloadCSV} startIcon={<GetAppIcon />}>
//               Download CSV
//             </Button>
//             <IconButton onClick={handleClose} aria-label="close">
//               <CloseIcon />
//             </IconButton>
//           </div>
//         </div>
        
//         {broadcastData.length === 0 ? (
//           <div className="flex justify-center items-center h-full">
//             <CircularProgress />
//           </div>
//         ) : (
//           <>
//             <TableContainer component={Paper} className={classes.tableContainer}>
//               <Table aria-label="broadcast details table">
//                 <TableHead className={classes.tableHead}>
//                   <TableRow>
//                     {['ID', 'Broadcast Name', 'Date', 'Time', 'Template', 'Receiver', 'Status', 'Media1', 'Media2', 'Media3', 'Media4', 'Media5', 'Media6', 'Media7', 'Media8', 'Media9', 'Media10', 'Media11', 'Media12', 'Media13'].map((headCell) => (
//                       <TableCell
//                         key={headCell}
//                         className={classes.tableHeadCell}
//                         sortDirection={orderBy === headCell.toLowerCase() ? order : false}
//                       >
//                         <TableSortLabel
//                           active={orderBy === headCell.toLowerCase()}
//                           direction={orderBy === headCell.toLowerCase() ? order : 'asc'}
//                           onClick={() => handleRequestSort(headCell.toLowerCase())}
//                         >
//                           {headCell}
//                         </TableSortLabel>
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {paginatedBroadcasts.map((item) => (
//                     <TableRow key={item.id} className={classes.tableRow}>
//                       <TableCell>{item.id}</TableCell>
//                       <TableCell>{name}</TableCell>
//                       <TableCell>{date}</TableCell>
//                       <TableCell>{time}</TableCell>
//                       <TableCell>{item.template_id}</TableCell>
//                       <TableCell>{item.receiver}</TableCell>
//                       <TableCell>{item.status}</TableCell>
//                       <TableCell>{item.media1}</TableCell>
//                       <TableCell>{item.media2}</TableCell>
//                       <TableCell>{item.media3}</TableCell>
//                       <TableCell>{item.media4}</TableCell>
//                       <TableCell>{item.media5}</TableCell>
//                       <TableCell>{item.media6}</TableCell>
//                       <TableCell>{item.media7}</TableCell>
//                       <TableCell>{item.media8}</TableCell>
//                       <TableCell>{item.media9}</TableCell>
//                       <TableCell>{item.media10}</TableCell>
//                       <TableCell>{item.media11}</TableCell>
//                       <TableCell>{item.media12}</TableCell>
//                       <TableCell>{item.media13}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={sortedBroadcasts.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </>
//         )}
//       </div>
//     </Modal>
//   );
// };

// // Prop types for type checking
// BroadcastDetailsModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   requestId: PropTypes.string.isRequired,
//   username: PropTypes.string.isRequired,
//   name: PropTypes.string,
//   date: PropTypes.string,
//   time: PropTypes.string,
//   broadcastData: PropTypes.array.isRequired,
// };

// export default BroadcastDetailsModal;
































































// import React, { useState, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import StatusPieChart from './StatusPieChart.jsx';

// // Main component function
// const BroadcastDetailsModal = ({ open, handleClose, requestId, username, name, date, time, broadcastData = [] }) => {  // Set default value for broadcastData as an empty array
//   const [page, setPage] = useState(0); // State for pagination page
//   const [rowsPerPage, setRowsPerPage] = useState(5); // State for rows per page in pagination
//   const [orderBy, setOrderBy] = useState(''); // State for sorting column
//   const [order, setOrder] = useState('asc'); // State for sorting order
//   const [statusCounts, setStatusCounts] = useState({});

//   // Memoized sorted broadcast data
//   const sortedBroadcasts = useMemo(() => {
//     let sorted = Array.isArray(broadcastData) ? [...broadcastData] : [];  // Ensure broadcastData is an array
//     if (orderBy) {
//       sorted.sort((a, b) => {
//         if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
//         else if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
//         else return 0;
//       });
//     }
//     return sorted;
//   }, [broadcastData, orderBy, order]);

//   // Memoized paginated broadcast data
//   const paginatedBroadcasts = useMemo(() => {
//     const start = page * rowsPerPage;
//     return sortedBroadcasts.slice(start, start + rowsPerPage);
//   }, [sortedBroadcasts, page, rowsPerPage]);

//   // Handle CSV download
//   const handleDownloadCSV = () => {
//     const headers = ['ID', 'Broadcast Name', 'Date', 'Time', 'Template', 'Receiver', 'Status', 'Media1', 'Media2', 'Media3', 'Media4', 'Media5', 'Media6', 'Media7', 'Media8', 'Media9', 'Media10', 'Media11', 'Media12', 'Media13'];
//     const csvContent = [
//       headers.join(','),
//       ...sortedBroadcasts.map((item) =>
//         [item.id, name, date, time, item.template_id, item.receiver, item.status, item.media1, item.media2, item.media3, item.media4, item.media5, item.media6, item.media7, item.media8, item.media9, item.media10, item.media11, item.media12, item.media13].join(',')
//       ),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `broadcast_details_${Date.now()}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   // Handle page change in pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change in pagination
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Handle sorting column change
//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   if (!open) return null; // Prevents rendering when modal is closed

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mb-80">
//       <div className="bg-white rounded-lg p-6 max-w-4xl shadow-lg overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Broadcast Details</h2>
//           <div className="flex space-x-2">
//             <button
//               className="px-4 py-2 bg-blue-500 text-white rounded"
//               onClick={handleDownloadCSV}
//             >
//               Download CSV
//             </button>
//             <button
//               className="text-xl text-gray-600"
//               onClick={handleClose}
//             >
//               ✖️
//             </button>
//           </div>
//         </div>

//         <div className="mb-4">
//           <StatusPieChart data={statusCounts} />
//         </div>

//         {broadcastData.length === 0 ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="text-xl">Loading...</div>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border">
//                 <thead>
//                   <tr className="bg-gray-800 text-white">
//                     {['ID', 'Broadcast Name', 'Date', 'Time', 'Template', 'Receiver', 'Status', 'Media1', 'Media2', 'Media3', 'Media4', 'Media5', 'Media6', 'Media7', 'Media8', 'Media9', 'Media10', 'Media11', 'Media12', 'Media13'].map((headCell) => (
//                       <th
//                         key={headCell}
//                         className="py-2 px-4 cursor-pointer"
//                         onClick={() => handleRequestSort(headCell.toLowerCase())}
//                       >
//                         {headCell}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedBroadcasts.map((item) => (
//                     <tr key={item.id} className="border-t">
//                       <td className="py-2 px-4">{item.id}</td>
//                       <td className="py-2 px-4">{name}</td>
//                       <td className="py-2 px-4">{date}</td>
//                       <td className="py-2 px-4">{time}</td>
//                       <td className="py-2 px-4">{item.template_id}</td>
//                       <td className="py-2 px-4">{item.receiver}</td>
//                       <td className="py-2 px-4">{item.status}</td>
//                       {/* Media columns */}
//                       {Array(13)
//                         .fill()
//                         .map((_, idx) => (
//                           <td key={idx} className="py-2 px-4">{item[`media${idx + 1}`]}</td>
//                         ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <button onClick={(e) => handleChangePage(e, Math.max(page - 1, 0))} className="px-4 py-2 bg-gray-300 rounded">
//                 Previous
//               </button>
//               <button onClick={(e) => handleChangePage(e, page + 1)} className="px-4 py-2 bg-gray-300 rounded">
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // Prop types for type checking
// BroadcastDetailsModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   requestId: PropTypes.string.isRequired,
//   username: PropTypes.string.isRequired,
//   name: PropTypes.string,
//   date: PropTypes.string,
//   time: PropTypes.string,
//   broadcastData: PropTypes.array.isRequired,
// };

// export default BroadcastDetailsModal;



































// import React, { useState, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import StatusPieChart from './StatusPieChart.jsx';

// // Main component function
// const BroadcastDetailsModal = ({
//   open,
//   handleClose,
//   requestId,
//   username,
//   name = "Sample Broadcast",
//   date = "2023-10-01",
//   time = "12:00 PM",
//   broadcastData = [
//     {
//       id: 1,
//       template_id: "Template 1",
//       receiver: "+1234567890",
//       status: "Delivered",
//       media1: "Image1.jpg",
//       media2: "Video1.mp4",
//       media3: "",
//       media4: "",
//       media5: "",
//       media6: "",
//       media7: "",
//       media8: "",
//       media9: "",
//       media10: "",
//       media11: "",
//       media12: "",
//       media13: "",
//     },
//     {
//       id: 2,
//       template_id: "Template 2",
//       receiver: "+0987654321",
//       status: "Pending",
//       media1: "Image2.jpg",
//       media2: "",
//       media3: "Audio1.mp3",
//       media4: "",
//       media5: "",
//       media6: "",
//       media7: "",
//       media8: "",
//       media9: "",
//       media10: "",
//       media11: "",
//       media12: "",
//       media13: "",
//     },
//     {
//       id: 3,
//       template_id: "Template 3",
//       receiver: "+1122334455",
//       status: "Failed",
//       media1: "",
//       media2: "",
//       media3: "",
//       media4: "",
//       media5: "Document1.pdf",
//       media6: "",
//       media7: "",
//       media8: "",
//       media9: "",
//       media10: "",
//       media11: "",
//       media12: "",
//       media13: "",
//     },
//   ],
 
// }) => {
//   console.log(broadcastData);
//   const [page, setPage] = useState(0); // State for pagination page
//   const [rowsPerPage, setRowsPerPage] = useState(5); // State for rows per page in pagination
//   const [orderBy, setOrderBy] = useState(''); // State for sorting column
//   const [order, setOrder] = useState('asc'); // State for sorting order
//   const [statusCounts, setStatusCounts] = useState({});

//   // Memoized sorted broadcast data
//   const sortedBroadcasts = useMemo(() => {
//     let sorted = Array.isArray(broadcastData) ? [...broadcastData] : [];  // Ensure broadcastData is an array
//     if (orderBy) {
//       sorted.sort((a, b) => {
//         if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
//         else if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
//         else return 0;
//       });
//     }
//     return sorted;
//   }, [broadcastData, orderBy, order]);

//   // Memoized paginated broadcast data
//   const paginatedBroadcasts = useMemo(() => {
//     const start = page * rowsPerPage;
//     return sortedBroadcasts.slice(start, start + rowsPerPage);
//   }, [sortedBroadcasts, page, rowsPerPage]);

//   // Handle CSV download
//   const handleDownloadCSV = () => {
//     const headers = [
//       'ID', 'Broadcast Name', 'Date', 'Time', 'Template', 'Receiver', 'Status', 
//       'Media1', 'Media2', 'Media3', 'Media4', 'Media5', 'Media6', 'Media7', 
//       'Media8', 'Media9', 'Media10', 'Media11', 'Media12', 'Media13'
//     ];
//     const csvContent = [
//       headers.join(','),
//       ...sortedBroadcasts.map((item) =>
//         [
//           item.id, name, date, time, item.template_id, item.receiver, item.status, 
//           item.media1, item.media2, item.media3, item.media4, item.media5, item.media6, 
//           item.media7, item.media8, item.media9, item.media10, item.media11, item.media12, 
//           item.media13,
//         ].join(',')
//       ),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `broadcast_details_${Date.now()}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   // Handle page change in pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change in pagination
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Handle sorting column change
//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   if (!open) return null; // Prevents rendering when modal is closed

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mb-80">
//       <div className="bg-white rounded-lg p-6 max-w-4xl shadow-lg overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">Broadcast Details</h2>
//           <div className="flex space-x-2">
//             <button
//               className="px-4 py-2 bg-blue-500 text-white rounded"
//               onClick={handleDownloadCSV}
//             >
//               Download CSV
//             </button>
//             <button
//               className="text-xl text-gray-600"
//               onClick={handleClose}
//             >
//               ✖️
//             </button>
//           </div>
//         </div>

//         <div className="mb-4">
//           <StatusPieChart data={statusCounts} />
//         </div>

//         {broadcastData.length === 0 ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="text-xl">Loading...</div>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border">
//                 <thead>
//                   <tr className="bg-gray-800 text-white">
//                     {[
//                       'ID', 'Broadcast Name', 'Date', 'Time', 'Template', 'Receiver', 'Status', 
//                       'Media1', 'Media2', 'Media3', 'Media4', 'Media5', 'Media6', 'Media7', 
//                       'Media8', 'Media9', 'Media10', 'Media11', 'Media12', 'Media13',
//                     ].map((headCell) => (
//                       <th
//                         key={headCell}
//                         className="py-2 px-4 cursor-pointer"
//                         onClick={() => handleRequestSort(headCell.toLowerCase())}
//                       >
//                         {headCell}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {paginatedBroadcasts.map((item) => (
//                     <tr key={item.id} className="border-t">
//                       <td className="py-2 px-4">{item.id}</td>
//                       <td className="py-2 px-4">{name}</td>
//                       <td className="py-2 px-4">{date}</td>
//                       <td className="py-2 px-4">{time}</td>
//                       <td className="py-2 px-4">{item.template_id}</td>
//                       <td className="py-2 px-4">{item.receiver}</td>
//                       <td className="py-2 px-4">{item.status}</td>
//                       {/* Media columns */}
//                       {Array(13)
//                         .fill()
//                         .map((_, idx) => (
//                           <td key={idx} className="py-2 px-4">{item[`media${idx + 1}`]}</td>
//                         ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <button onClick={(e) => handleChangePage(e, Math.max(page - 1, 0))} className="px-4 py-2 bg-gray-300 rounded">
//                 Previous
//               </button>
//               <button onClick={(e) => handleChangePage(e, page + 1)} className="px-4 py-2 bg-gray-300 rounded">
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // Prop types for type checking
// BroadcastDetailsModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   handleClose: PropTypes.func.isRequired,
//   requestId: PropTypes.string.isRequired,
//   username: PropTypes.string.isRequired,
//   name: PropTypes.string,
//   date: PropTypes.string,
//   time: PropTypes.string,
//   broadcastData: PropTypes.array.isRequired,
// };

// export default BroadcastDetailsModal;
























import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import StatusPieChart from './StatusPieChart.jsx';

const BroadcastDetailsModal = ({
  open,
  handleClose,
  requestId,
  username,
  name = "Sample Broadcast",
  date = "2023-10-01",
  time = "12:00 PM",
  broadcastData = [
    {
      id: 1,
      template_id: "Template 1",
      receiver: "+1234567890",
      status: "Delivered",
      media1: "Image1.jpg",
      media2: "Video1.mp4",
      media3: "",
    },
    {
      id: 2,
      template_id: "Template 2",
      receiver: "+0987654321",
      status: "Pending",
      media1: "Image2.jpg",
      media2: "",
      media3: "Audio1.mp3",
    },
    {
      id: 3,
      template_id: "Template 3",
      receiver: "+1122334455",
      status: "Failed",
      media5: "Document1.pdf",
    },
  ],
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  const sortedBroadcasts = useMemo(() => {
    let sorted = Array.isArray(broadcastData) ? [...broadcastData] : [];
    if (orderBy) {
      sorted.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        else if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        else return 0;
      });
    }
    return sorted;
  }, [broadcastData, orderBy, order]);

  const paginatedBroadcasts = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedBroadcasts.slice(start, start + rowsPerPage);
  }, [sortedBroadcasts, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadCSV = () => {
    const headers = [
      'ID', 'Broadcast Name', 'Date', 'Time', 'Template', 'Receiver', 'Status',
      'Media1', 'Media2', 'Media3', 'Media4', 'Media5', 'Media6', 'Media7'
    ];
    const csvContent = [
      headers.join(','),
      ...sortedBroadcasts.map(item =>
        [
          item.id, name, date, time, item.template_id, item.receiver, item.status,
          item.media1, item.media2, item.media3, item.media4, item.media5, item.media6, item.media7
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `broadcast_details_${Date.now()}.csv`;
    link.click();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl shadow-lg overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Broadcast Details</h2>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleDownloadCSV}
            >
              Download CSV
            </button>
            <button
              className="text-xl text-gray-600"
              onClick={handleClose}
            >
              ✖️
            </button>
          </div>
        </div>

        <div className="mb-4">
          <StatusPieChart data={{ delivered: 10, pending: 5, failed: 2 }} />
        </div>

        {paginatedBroadcasts.length === 0 ? (
          <div className="text-center">No Broadcasts</div>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-800 text-white">
                {['ID', 'Template', 'Receiver', 'Status', 'Media1', 'Media2', 'Media3'].map((header) => (
                  <th key={header} className="py-2 px-4">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedBroadcasts.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-4">{item.id}</td>
                  <td className="py-2 px-4">{item.template_id}</td>
                  <td className="py-2 px-4">{item.receiver}</td>
                  <td className="py-2 px-4">{item.status}</td>
                  <td className="py-2 px-4">{item.media1}</td>
                  <td className="py-2 px-4">{item.media2}</td>
                  <td className="py-2 px-4">{item.media3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between items-center mt-4">
          <button onClick={() => handleChangePage(null, page - 1)} disabled={page === 0} className="px-4 py-2 bg-gray-200 rounded">
            Previous
          </button>
          <button onClick={() => handleChangePage(null, page + 1)} className="px-4 py-2 bg-gray-200 rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

BroadcastDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  requestId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
  broadcastData: PropTypes.array.isRequired,
};

export default BroadcastDetailsModal;
