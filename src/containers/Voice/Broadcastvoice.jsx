import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "../../components/Modal";
import NewBroadcastVoice from "./NewBroadcastVoice.jsx";
import IncomeCard from "../../components/Broadcast/Credits.jsx";
import DatePickerComponent from "../../components/DatePickerComponent/DatePickerComponent.jsx";
import VoiceDetailsModal from "../../components/Voice/VoiceDetailModal.jsx";

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
import { IconButton } from "@mui/material";

import { makeStyles } from "@material-ui/core/styles";
import { motion, AnimatePresence } from "framer-motion";

import handleApiError from "../../utils/errorHandler.js";
import { voiceDataApi } from "../../services/api.js";

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

const BroadcastVoice = ({ user }) => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("dateTime");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("newest");
  const [broadcastData, setBroadcastData] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const navigate = useNavigate();

  const parseDateTimeFromDte = (dateTimeString) => {
    const [dateString, timeString] = dateTimeString.split(" ");
    const [year, month, day] = dateString.split("-");
    const [hour, minute, second] = timeString.split(":");

    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const fetchBroadcastData = async () => {
    try {
      const payload = { action: "read", username: user?.username };
      const response = await voiceDataApi(payload);

      const data = response.data.reverse().map((item) => {
        const { date, time } = parseDateTimeFromDte(item.dte || "");
        return {
          campaignName: item.campaign_name || "N/A",
          userName: item.username || "N/A",
          date,
          time,
          requestId: item.requestid || "N/A",
          callerId: item.user_callerid || "N/A",
          credits: item.deduction * item.contacts,
          content: item.content,
          // dlr: item.sms === "104" ? "Complete" : "Pending", // Status handling
          reportingCode: item.sms,
          // status: item.sms === "104" ? "Complete" : "Pending", // Status based on the reporting code
        };
      });
      setBroadcastData(data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleView = (row) => {
    setSelectedRow(row);
    setIsDataModalOpen(true);
  };

  const handleModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Campaign Name",
      "User Name",
      "Date Time",
      "Request ID",
      "Caller ID",
      "Credits",
      "Content",
      "Reporting Code",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.campaignName,
          row.userName,
          row.dateTime,
          row.requestId,
          row.callerId,
          row.credits,
          row.content,
          row.reportingCode,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `broadcast_list_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Filtered data based on the search term and filter option
  const filteredData = useMemo(() => {
    let filtered = broadcastData.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (filter === "newest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
      );
    } else {
      filtered = filtered.sort(
        (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
      );
    }

    return filtered;
  }, [broadcastData, searchTerm, filter]);

  useEffect(() => {
    fetchBroadcastData();
  }, []);

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
            New Broadcast →
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
                onStartDateChange={(date) => console.log(date)}
                onEndDateChange={(date) => console.log(date)}
              />
            </div>

            <div className="my-6">
              <IncomeCard user={user} title="Voice Credits" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-16">
        <h1 className="text-2xl font-bold text-black py-6">
          Voice Delivery Report
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
                  "Campaign Name",
                  "User Name",
                  "Date",
                  "Time",
                  "Request ID",
                  "Caller ID",
                  "Credits",
                  "Content",
                  "Reporting Code",
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
                    <TableCell>{row.campaignName}</TableCell>
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.requestId}</TableCell>
                    <TableCell>{row.callerId}</TableCell>
                    <TableCell>{row.credits}</TableCell>
                    <TableCell>
                      <a
                        href={row.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {row.content}
                      </a>
                    </TableCell>
                    {/* <TableCell>
                      {row.reportingCode === "104" && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<GetAppIcon />}
                        >
                          Download DLR
                        </Button>
                      )}
                    </TableCell> */}
                    <TableCell>{row.reportingCode}</TableCell>
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
        <Modal isModalOpen={isModalOpen} closeModal={closeModal} height="80vh">
          <NewBroadcastVoice
            closeModal={closeModal}
            user={user?.username}
            reFetchData={fetchBroadcastData}
          />
        </Modal>
      )}

      <VoiceDetailsModal
        open={isDataModalOpen}
        handleClose={() => setIsDataModalOpen(false)}
        requestId={selectedRow ? selectedRow.requestId : ""}
        username={user ? user?.username : ""}
        name={selectedRow ? selectedRow.campaignName : ""}
        date={selectedRow ? selectedRow.date : ""}
        time={selectedRow ? selectedRow.time : ""}
      />
    </div>
  );
};

export default BroadcastVoice;
