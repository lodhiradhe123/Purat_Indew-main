import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";

import StatusPieChart from "../Broadcast/StatusPieChart";

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
  TablePagination,
} from "@material-ui/core";
import { Close as CloseIcon, GetApp as GetAppIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { voiceDataApi } from "../../services/api";

// Custom styles for the component
const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: theme.spacing(3),
    overflowX: "auto",
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
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  modalContent: {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflowY: "auto", // Ensure vertical scrollbar appears when content overflows
    borderRadius: theme.shape.borderRadius,
  },
}));

// Main component function
const VoiceDetailsModal = ({
  open,
  handleClose,
  requestId,
  username,
  name,
  date,
  time,
}) => {
  const classes = useStyles(); // Using custom styles
  const [data, setData] = useState([]); // State to store broadcast details
  const [loading, setLoading] = useState(false); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [page, setPage] = useState(0); // State for pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // State for rows per page in pagination
  const [orderBy, setOrderBy] = useState(""); // State for sorting column
  const [order, setOrder] = useState("asc"); // State for sorting order
  const [statusCounts, setStatusCounts] = useState({});

  // Fetch broadcast details from the server
  const fetchBroadcastDetails = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Reset error state
    try {
      const response = await voiceDataApi({
        action: "readSpecific",
        request_id: requestId,
        username: username,
      });

      console.log("resD", response);
      const data = response.data;
      if (data) {
        setData(data); // Set broadcast details on success
        const counts = data.reduce((acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        }, {});
        setStatusCounts(counts);
      } else {
        toast.error("Failed to fetch data"); // Show error toast on failure
        setError("Failed to fetch data");
      }
    } catch (error) {
      toast.error("An error occurred while fetching broadcast details"); // Show error toast on catch
      setError("An error occurred while fetching broadcast details");
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
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Memoized sorted broadcast data
  const sortedBroadcasts = useMemo(() => {
    let sorted = [...data];
    if (orderBy) {
      sorted.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
        else if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        else return 0;
      });
    }
    return sorted;
  }, [data, orderBy, order]);

  // Memoized paginated broadcast data
  const paginatedBroadcasts = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedBroadcasts.slice(start, start + rowsPerPage);
  }, [sortedBroadcasts, page, rowsPerPage]);

  // Handle CSV download
  const handleDownloadCSV = () => {
    const headers = [
      "ID",
      "Broadcast Name",
      "Date",
      "Time",
      "Template",
      "Receiver",
      "Status",
      "Media1",
      "Media2",
      "Media3",
      "Media4",
      "Media5",
      "Media6",
      "Media7",
      "Media8",
    ];
    const csvContent = [
      headers.join(","),
      ...sortedBroadcasts.map((item) =>
        [
          item.id || "N/A",
          name || "N/A",
          date || "N/A",
          time || "N/A",
          item.template_id || "N/A",
          item.receiver || "N/A",
          item.status || "N/A",
          item.media1 || "N/A",
          item.media2 || "N/A",
          item.media3 || "N/A",
          item.media4 || "N/A",
          item.media5 || "N/A",
          item.media6 || "N/A",
          item.media7 || "N/A",
          item.media8 || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `broadcast_details_${Date.now()}.csv`);
      link.style.visibility = "hidden";
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
      <div
        className={`${classes.modalContent} bg-white rounded-lg p-6 max-w-4xl shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-between  mb-4">
          <h2 id="transition-modal-title" className="text-2xl font-bold">
            Broadcast Details
          </h2>

          <div>
            <StatusPieChart data={statusCounts} />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadCSV}
              startIcon={<GetAppIcon />}
            >
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
            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table aria-label="broadcast details table">
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    {[
                      "ID",
                      "Broadcast Name",
                      "Date",
                      "Time",
                      "Template",
                      "Receiver",
                      "Status",
                      "Media1",
                      "Media2",
                      "Media3",
                      "Media4",
                      "Media5",
                      "Media6",
                      "Media7",
                      "Media8",
                    ].map((headCell) => (
                      <TableCell
                        key={headCell}
                        className={classes.tableHeadCell}
                        sortDirection={
                          orderBy === headCell.toLowerCase() ? order : false
                        }
                      >
                        <TableSortLabel
                          active={orderBy === headCell.toLowerCase()}
                          direction={
                            orderBy === headCell.toLowerCase() ? order : "asc"
                          }
                          onClick={() =>
                            handleRequestSort(headCell.toLowerCase())
                          }
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
                      <TableCell>{item.id || "N/A"}</TableCell>
                      <TableCell>{name || "N/A"}</TableCell>
                      <TableCell>{date || "N/A"}</TableCell>
                      <TableCell>{time || "N/A"}</TableCell>
                      <TableCell>{item.template_id || "N/A"}</TableCell>
                      <TableCell>{item.receiver || "N/A"}</TableCell>
                      <TableCell>{item.status || "N/A"}</TableCell>
                      <TableCell>{item.media1 || "N/A"}</TableCell>
                      <TableCell>{item.media2 || "N/A"}</TableCell>
                      <TableCell>{item.media3 || "N/A"}</TableCell>
                      <TableCell>{item.media4 || "N/A"}</TableCell>
                      <TableCell>{item.media5 || "N/A"}</TableCell>
                      <TableCell>{item.media6 || "N/A"}</TableCell>
                      <TableCell>{item.media7 || "N/A"}</TableCell>
                      <TableCell>{item.media8 || "N/A"}</TableCell>
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

export default VoiceDetailsModal;
