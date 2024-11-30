

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  TextField,
  Typography,
  Box,
  TablePagination,
  Grid,
  TableSortLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faCalendarAlt,
  faEnvelope,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  GetApp as GetAppIcon,
  Refresh as RefreshIcon,
  Repeat as RepeatIcon,
} from "@material-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BroadcastDetailsModal from "../../components/Broadcast/BroadcastDetailsModal"; // 
import { fetchbroadcast } from "../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: "white",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  controls: {
    marginBottom: theme.spacing(3),
  },
  searchField: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
  },
  tableHeadCell: {
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const ScheduledBroadcasts = ({ user, onBack }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('schedule_date');
  const [order, setOrder] = useState('desc');
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('newest');
  const [broadcastData, setBroadcastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchbroadcast({
          action: 'schedule',
          username: user.username,
        });

        setBroadcastData(response?.data?.campaign_details || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.username, startDate, endDate]);

  const filteredAndSortedBroadcasts = useMemo(() => {
    let filtered = broadcastData.filter((broadcast) =>
      Object.values(broadcast).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (filter === 'newest') {
      filtered = filtered.sort((a, b) => new Date(b.dat) - new Date(a.dat));
    } else {
      filtered = filtered.sort((a, b) => new Date(a.dat) - new Date(b.dat));
    }

    return filtered;
  }, [broadcastData, searchTerm, filter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleView = (broadcast) => {
    setSelectedBroadcast(broadcast);
    setModalOpen(true);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  const handleRepeat = (id) => toast.info(`Repeat broadcast ${id}`);

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Name', 'Date', 'Time', 'Request ID', 'Count'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedBroadcasts.map((broadcast) =>
        [
          broadcast.id,
          broadcast.senderid,
          broadcast.schedule_date,
          broadcast.estimated_time,
          broadcast.request_id,
          broadcast.numbers,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `broadcast_list_${Date.now()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 bg-white rounded-xl shadow-lg"
    >
      <div className="bg-white p-1  shadow-md mb-5 rounded-xl">
      <Box className={classes.header}>

        <div className='flex justify-between'>
          <button
            onClick={onBack}
            className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
            Scheduled Broadcasts
          </h1>
          <div className="invisible">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back
          </div>
        </div>

      </Box>
      </div>

      <Grid container spacing={2} className={classes.controls}>
        <Grid item xs={12} sm={6}>
          <TextField
            className={classes.searchField}
            variant="outlined"
            size="small"
            placeholder="Search broadcasts"
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              label="Filter"
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={3} container justifyContent="flex-end">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<GetAppIcon />}
            onClick={handleDownloadCSV}
          >
            Download CSV
          </Button>
        </Grid>
      </Grid>


      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshIcon color="primary" style={{ fontSize: 40 }} />
          </motion.div>
        </Box>
      ) : filteredAndSortedBroadcasts.length > 0 ? (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table}>
            <TableHead className={classes.tableHead}>
              <TableRow>
                {['ID', 'Broadcast Name', 'Date', 'Time', 'Request ID', 'Count', 'Actions'].map((headCell) => (
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
              <AnimatePresence>
                {(rowsPerPage > 0
                  ? filteredAndSortedBroadcasts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredAndSortedBroadcasts
                ).map((broadcast) => (
                  <motion.tr
                    key={broadcast.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={classes.tableRow}
                  >
                    <TableCell>{broadcast.id}</TableCell>
                    <TableCell>{broadcast.senderid}</TableCell>
                    <TableCell>{broadcast.mob_no3.schedule_date}</TableCell>
                    <TableCell>{broadcast.mob_no3.schedule_time}</TableCell>
                    <TableCell>{broadcast.request_id}</TableCell>
                    <TableCell>{broadcast.numbers}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleView(broadcast)} aria-label="View broadcast">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleRepeat(broadcast.id)} aria-label="Repeat broadcast">
                        <RepeatIcon />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Typography variant="h6" gutterBottom>
            No broadcasts found
          </Typography>
          <Typography variant="body1">
            There are no broadcasts matching your search criteria. Try adjusting your search or create a new broadcast.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => toast.info('New broadcast feature coming soon!')}
            style={{ marginTop: '20px' }}
          >
            New Broadcast
          </Button>
        </motion.div>
      )}

      {filteredAndSortedBroadcasts.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAndSortedBroadcasts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <BroadcastDetailsModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        requestId={selectedBroadcast ? selectedBroadcast.request_id : ''}
        username={user ? user.username : ''}
        name={selectedBroadcast ? selectedBroadcast.senderid : ''}
        date={selectedBroadcast ? selectedBroadcast.mob_no3.schedule_date : ''}
        time={selectedBroadcast ? selectedBroadcast.mob_no3.schedule_time : ''}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </motion.div>
  );
};

export default ScheduledBroadcasts;
