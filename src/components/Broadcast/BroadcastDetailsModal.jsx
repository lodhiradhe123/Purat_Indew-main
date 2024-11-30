

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Modal,
  Backdrop,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Button,
  TableSortLabel,
  Typography,
  TablePagination,
} from '@material-ui/core';
import { Close as CloseIcon, GetApp as GetAppIcon } from '@material-ui/icons';
import { toast } from 'react-toastify';
import 'tailwindcss/tailwind.css';
import { makeStyles } from '@material-ui/core/styles';
import { broadcastSpecific } from '../../services/api';
import StatusPieChart from './StatusPieChart.jsx';

// Custom styles for the component
const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
  },
  tableHeadCell: {
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  modalContent: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto', // Ensure vertical scrollbar appears when content overflows
    borderRadius: theme.shape.borderRadius,
  },
}));

// Main component function
const BroadcastDetailsModal = ({ open, handleClose, requestId, username, name, date, time }) => {
  const classes = useStyles(); // Using custom styles
  const [broadcast, setBroadcast] = useState([]); // State to store broadcast details
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [page, setPage] = useState(0); // State for pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // State for rows per page in pagination
  const [orderBy, setOrderBy] = useState(''); // State for sorting column
  const [order, setOrder] = useState('asc'); // State for sorting order
  const [statusCounts, setStatusCounts] = useState({});

  // Fetch broadcast details from the server
  const fetchBroadcastDetails = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Reset error state
    try {
      const response = await broadcastSpecific({
        request_id: requestId,
        username: username,
      });
      const data = response.data;
      if (data.status === 1) {
        setBroadcast(data.data); // Set broadcast details on success
        const counts = data.data.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});
        setStatusCounts(counts);
      } else {
        toast.error('Failed to fetch data'); // Show error toast on failure
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching broadcast details:', error);
      toast.error('An error occurred while fetching broadcast details'); // Show error toast on catch
      setError('An error occurred while fetching broadcast details');
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Effect to fetch broadcast details when modal opens
  useEffect(() => {
    if (open) {
      fetchBroadcastDetails();
    }
  }, [open, requestId, username]);

  // Handle page change in pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change in pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sorting column change
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Memoized sorted broadcast data
  const sortedBroadcasts = useMemo(() => {
    let sorted = [...broadcast];
    if (orderBy) {
      sorted.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
        else if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
        else return 0;
      });
    }
    return sorted;
  }, [broadcast, orderBy, order]);

  // Memoized paginated broadcast data
  const paginatedBroadcasts = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedBroadcasts.slice(start, start + rowsPerPage);
  }, [sortedBroadcasts, page, rowsPerPage]);

  // Handle CSV download
  const handleDownloadCSV = () => {
    const headers = ['ID', 'Broadcast Name', 'Date', 'Time', 'Template', 'Receiver', 'Status', 'Media1', 'Media2', 'Media3', 'Media4', 'Media5', 'Media6', 'Media7', 'Media8', 'Media9', 'Media10', 'Media11', 'Media12', 'Media13'];
    const csvContent = [
      headers.join(','),
      ...sortedBroadcasts.map((item) =>
        [item.id, name, date, time, item.template_id, item.receiver, item.status, item.media1, item.media2, item.media3, item.media4, item.media5, item.media6, item.media7, item.media8, item.media9, item.media10, item.media11, item.media12, item.media13].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `broadcast_details_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      className="flex items-center justify-center"
    >
      <div className={`${classes.modalContent} bg-white rounded-lg p-6 max-w-4xl shadow-lg transition-transform duration-300 ease-in-out`}>
        <div className="flex justify-between  mb-4">
          <h2 id="transition-modal-title" className="text-2xl font-bold">Broadcast Details</h2>
          
          <div>
            <StatusPieChart data={statusCounts} />
          </div>
          <div className="flex items-center space-x-2">
            
            <Button variant="contained" color="primary" onClick={handleDownloadCSV} startIcon={<GetAppIcon />}>
              Download CSV
            </Button>
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table aria-label="broadcast details table">
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    {['ID', 'Broadcast Name', 'Date', 'Time', 'Template', 'Receiver', 'Status', 'Media1', 'Media2', 'Media3', 'Media4', 'Media5', 'Media6', 'Media7', 'Media8', 'Media9', 'Media10', 'Media11', 'Media12', 'Media13'].map((headCell) => (
                      <TableCell
                        key={headCell}
                        className={classes.tableHeadCell}
                        sortDirection={orderBy === headCell.toLowerCase() ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === headCell.toLowerCase()}
                          direction={orderBy === headCell.toLowerCase() ? order : 'asc'}
                          onClick={() => handleRequestSort(headCell.toLowerCase())}
                        >
                          {headCell}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBroadcasts.map((item) => (
                    <TableRow key={item.id} className={classes.tableRow}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{date}</TableCell>
                      <TableCell>{time}</TableCell>
                      <TableCell>{item.template_id}</TableCell>
                      <TableCell>{item.receiver}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.media1}</TableCell>
                      <TableCell>{item.media2}</TableCell>
                      <TableCell>{item.media3}</TableCell>
                      <TableCell>{item.media4}</TableCell>
                      <TableCell>{item.media5}</TableCell>
                      <TableCell>{item.media6}</TableCell>
                      <TableCell>{item.media7}</TableCell>
                      <TableCell>{item.media8}</TableCell>
                      <TableCell>{item.media9}</TableCell>
                      <TableCell>{item.media10}</TableCell>
                      <TableCell>{item.media11}</TableCell>
                      <TableCell>{item.media12}</TableCell>
                      <TableCell>{item.media13}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sortedBroadcasts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

// Prop types for type checking
BroadcastDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  requestId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  name: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
};

export default BroadcastDetailsModal;