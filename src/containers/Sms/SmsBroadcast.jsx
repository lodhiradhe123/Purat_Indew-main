import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Modal from "../../components/Modal";
import SmsModal from "../../components/Sms/SmsModal.jsx";
import SmsDetailsModal from "../../components/Sms/SmsDetailModal.jsx";
import IncomeCard from "../../components/Broadcast/Credits.jsx";
import DatePickerComponent from "../../components/DatePickerComponent/DatePickerComponent.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  TablePagination,
  TableSortLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Grid,
} from "@material-ui/core";
import {
  GetApp as GetAppIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@mui/material";

import handleApiError from "../../utils/errorHandler.js";
import { gsmRead } from "../../services/api.js";

const useStyles = makeStyles((theme) => ({
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

const SmsBroadcast = ({ user }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("dateTime");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("newest");
  const [broadcastData, setBroadcastData] = useState([]); // To store API response data
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Default to last 7 days
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // Handle DatePickerComponent start date change
  const handleStartDateChange = (date) => {
    setStartDate(date.toISOString().split("T")[0]);
  };

  // Handle DatePickerComponent end date change
  const handleEndDateChange = (date) => {
    setEndDate(date.toISOString().split("T")[0]);
  };

  const handleModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Utility function to add one day to a date
  const addOneDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "ID",
      "Campaign Name",
      "User Name",
      "Date",
      "Time",
      "Request ID",
      "Sender ID",
      "Count",
      "Contacts",
      "Route",
    ];

    // Map the filteredData to extract the same fields used in the table
    const csvContent = [
      headers.join(","), // Join headers with a comma
      ...filteredData.map((row) =>
        [
          row.id, // ID
          row.broadcast_name || "N/A",
          row.username || "N/A",
          row.schedule_date || "N/A",
          row.schedule_time || "N/A",
          row.requestid || "N/A",
          row.senderid || "N/A",
          row.deduction_sum || "N/A",
          row.contacts || "N/A",
          row.route || "N/A",
        ].join(",")
      ),
    ].join("\n");

    // Create a Blob for the CSV file and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `broadcast_list_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (row) => {
    setSelectedRow(row);
    setIsDataModalOpen(true);
  };

  const fetchBroadcastData = async () => {
    if (!user) {
      toast.error("User information is missing");
      return;
    }

    const payload = {
      action: "read",
      username: user?.username,
      start_date: startDate,
      end_date: addOneDay(endDate), // Add one day to end date
    };

    try {
      const response = await gsmRead(payload);
      setBroadcastData(response?.data?.campaign_details); // Assuming response.data contains broadcast data
    } catch (error) {
      handleApiError(error);
    }
  };

  // Filtered data based on the search term and filter option
  const filteredData = useMemo(() => {
    if (!broadcastData) return [];

    // Normalize search term to lowercase
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const filtered = broadcastData.filter((item) => {
      const fieldsToSearch = [
        item.broadcast_name,
        item.requestid,
        item.senderid,
        item.username,
      ];

      return fieldsToSearch.some((field) =>
        field
          ? field.toString().toLowerCase().includes(lowerCaseSearchTerm)
          : false
      );
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.dte);
      const dateB = new Date(b.dte);

      return filter === "newest"
        ? dateB - dateA // Newest first
        : dateA - dateB; // Oldest first
    });
  }, [broadcastData, searchTerm, filter]);

  useEffect(() => {
    if (user?.username && startDate && endDate) {
      fetchBroadcastData();
    }
  }, [user, startDate, endDate]);

  return (
    <div className="p-6">
      {/* Header with Back Button and Heading */}
      <div className="bg-white p-6 m-3.5 shadow-md mb-5 rounded-xl">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
            Campaign Details
          </h1>

          <button
            className="bg-white text-indigo-600 py-2 px-6 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
            onClick={handleModal}
            aria-label="Start a new broadcast"
          >
            New SMS →
          </button>
        </div>
      </div>

      {/* Overview and Date Picker */}
      <div className="overview-container bg-white rounded-xl shadow-lg p-6 mb-16">
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold text-black py-6">
            Date Range Filter
          </h1>
          <div className="flex flex-col md:flex-row items-center mb-6 space-y-2 md:space-y-0 md:space-x-2">
            <div>
              <DatePickerComponent
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
            </div>

            <div className="my-6">
              <IncomeCard user={user} title="SMS Credits" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-16">
        <h1 className="text-2xl font-bold text-black py-6">
          SMS Delivery Report
        </h1>
        {/* Table Section */}
        <Grid container spacing={2} className="my-4">
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

        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table}>
            <TableHead className={classes.tableHead}>
              <TableRow>
                {[
                  "id",
                  "Campaign Name",
                  "User Name",
                  "Date",
                  "Time",
                  "Request ID",
                  "Sender ID",
                  "Count",
                  "Contacts",
                  "Route",
                  "Action",
                ].map((headCell) => (
                  <TableCell key={headCell} className={classes.tableHeadCell}>
                    <TableSortLabel
                      active={orderBy === headCell}
                      direction={orderBy === headCell ? order : "asc"}
                      onClick={() => handleRequestSort(headCell)}
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
                  ? filteredData.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredData
                ).map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={classes.tableRow}
                  >
                    <TableCell>{row.id || "N/A"}</TableCell>
                    <TableCell>{row.broadcast_name || "N/A"}</TableCell>
                    <TableCell>{row.username || "N/A"}</TableCell>
                    <TableCell>{row.schedule_date || "N/A"}</TableCell>
                    <TableCell>{row.schedule_time || "N/A"}</TableCell>
                    <TableCell>{row.requestid || "N/A"}</TableCell>
                    <TableCell>{row.senderid || "N/A"}</TableCell>
                    <TableCell>
                      {row.deduction && row.contacts
                        ? row.deduction * row.contacts
                        : "N/A"}
                    </TableCell>
                    <TableCell>{row.contacts || "N/A"}</TableCell>
                    <TableCell>{row.route}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleView(row)}
                        aria-label="View broadcast"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {/* Modal Logic */}
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          className="rounded-lg"
        >
          <SmsModal
            closeModal={closeModal}
            user={user}
            refetchData={fetchBroadcastData}
          />
        </Modal>
      )}

      <SmsDetailsModal
        open={isDataModalOpen}
        handleClose={() => setIsDataModalOpen(false)}
        requestId={selectedRow ? selectedRow.requestid : ""}
        username={user ? user?.username : ""}
        name={selectedRow ? selectedRow.broadcast_name : ""}
        date={selectedRow ? selectedRow.schedule_date : ""}
        time={selectedRow ? selectedRow.schedule_time : ""}
      />
    </div>
  );
};

export default SmsBroadcast;
