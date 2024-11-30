import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
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
  useMediaQuery,
  TablePagination,
  Grid,
  TableSortLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  GetApp as GetAppIcon,
} from '@material-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BroadcastDetailsModal from './BroadcastDetailsModal';
import RepeatIcon from '@mui/icons-material/Repeat';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: 'white',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
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
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
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
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  actionButton: {
    padding: theme.spacing(1),
  },
  backButton: {
    marginBottom: theme.spacing(2),
  },
}));

const BroadcastList = ({ broadcastData, loading, user }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('dat');
  const [order, setOrder] = useState('desc');
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState('newest');

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
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleView = (broadcast) => {
    setSelectedBroadcast(broadcast);
    setModalOpen(true);
  };

  const handleRepeat = (id) => toast.info(`Repeat broadcast ${id}`);

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Name', 'Date', 'Time', 'Request ID', 'Count'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedBroadcasts.map((broadcast) =>
        [
          broadcast.id,
          broadcast.senderid,
          broadcast.dat,
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
      <Grid container spacing={3} className={classes.header}>
        <Grid item xs={12} sm={6}>
          
          <h1 className="text-2xl font-bold text-black py-6">Broadcast List</h1>
        </Grid>
      </Grid>

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
                    <TableCell>{broadcast.dat}</TableCell>
                    <TableCell>{broadcast.estimated_time}</TableCell>
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
        date={selectedBroadcast ? selectedBroadcast.dat : ''}
        time={selectedBroadcast ? selectedBroadcast.estimated_time : ''}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </motion.div>
  );
};

BroadcastList.propTypes = {
  broadcastData: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
};

export default BroadcastList;
