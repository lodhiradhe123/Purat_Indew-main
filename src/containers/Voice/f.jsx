import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/Modal";
import NewBroadcast from "./New-Broadcast.jsx";
import IncomeCard from "../../components/Broadcast/Credits";
import DatePickerComponent from "../../components/DatePickerComponent/DatePickerComponent";
import { useNavigate } from "react-router-dom";
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
} from "@material-ui/core";
import { GetApp as GetAppIcon, Search as SearchIcon } from "@material-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BroadcastVoice = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("dateTime");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("newest");

  // Dummy data for the table
  const data = [
    {
      campaignName: "Test Campaign",
      userName: "demoaug",
      dateTime: "13 Jun 2024 13:34:31",
      requestId: 9832174,
      callerId: "9999999999",
      noOfMsg: 1,
      content: "757e9985-2378-4a78-a461-bb5b5fa3011c1.mp3",
      dlr: "WORK",
      reportingCode: "WORK",
      status: "Pending",
    },
    {
      campaignName: "Test Campaign",
      userName: "demoaug",
      dateTime: "13 Jun 2024 13:34:06",
      requestId: 9832173,
      callerId: "9999999999",
      noOfMsg: 1,
      content: "757e9985-2378-4a78-a461-bb5b5fa3011c1.mp3",
      dlr: "WORK",
      reportingCode: "WORK",
      status: "Pending",
    },
    // More data entries...
  ];

  const handleModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const navigate = useNavigate();

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
    const headers = ["Campaign Name", "User Name", "Date Time", "Request ID", "Caller ID", "No Of MSG", "Content", "DLR", "Reporting Code", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.campaignName,
          row.userName,
          row.dateTime,
          row.requestId,
          row.callerId,
          row.noOfMsg,
          row.content,
          row.dlr,
          row.reportingCode,
          row.status,
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
    let filtered = data.filter((item) =>
      Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (filter === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    } else {
      filtered = filtered.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    }

    return filtered;
  }, [data, searchTerm, filter]);

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
      <div className="overview-container bg-white rounded-xl shadow-lg p-6">
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold text-black py-6">Date Range Filter</h1>
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

      {/* Search, Filter, and Download */}
      <div className="flex flex-col md:flex-row mb-4 justify-between">
        <TextField
          label="Search Campaign"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 md:mb-0 md:w-1/3"
          InputProps={{ startAdornment: <SearchIcon /> }}
        />
        <FormControl variant="outlined" size="small" className="md:w-1/3">
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
        <Button
          variant="outlined"
          color="primary"
          startIcon={<GetAppIcon />}
          onClick={handleDownloadCSV}
          className="mt-2 md:mt-0"
        >
          Download CSV
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
        <TableContainer component={Paper} className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHead className="bg-indigo-600">
              <TableRow>
                {[
                  "Campaign Name",
                  "User Name",
                  "Date Time",
                  "Request ID",
                  "Caller ID",
                  "No Of MSG",
                  "Content",
                  "DLR",
                  "Reporting Code",
                  "Status",
                ].map((headCell) => (
                  <TableCell key={headCell} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
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
                  ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredData
                ).map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="px-6 py-4">{row.campaignName}</TableCell>
                    <TableCell className="px-6 py-4">{row.userName}</TableCell>
                    <TableCell className="px-6 py-4">{row.dateTime}</TableCell>
                    <TableCell className="px-6 py-4">{row.requestId}</TableCell>
                    <TableCell className="px-6 py-4">{row.callerId}</TableCell>
                    <TableCell className="px-6 py-4">{row.noOfMsg}</TableCell>
                    <TableCell className="px-6 py-4">
                      <a href={row.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {row.content}
                      </a>
                    </TableCell>
                    <TableCell className="px-6 py-4">{row.dlr}</TableCell>
                    <TableCell className="px-6 py-4">{row.reportingCode}</TableCell>
                    <TableCell className="px-6 py-4">{row.status}</TableCell>
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
        <Modal isModalOpen={isModalOpen} closeModal={closeModal}>
          <NewBroadcast closeModal={closeModal} user={user} />
        </Modal>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default BroadcastVoice;
