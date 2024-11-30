import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  TablePagination,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FiberManualRecord as StatusIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { agentsdata } from "../../services/api";
import { blue, grey } from "@mui/material/colors";
import { format } from "date-fns";

// START POINT: UsersTable Component
const UsersTable = ({ user }) => {
  // LOGIC: State for pagination and fetched data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await agentsdata({
          action: "read",
          username: user.username,
        });

        if (response.status >= 200 && response.status < 300 && response.data) {
          setUsers(response?.data?.data); // Storing users data from API response
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        setError("Error fetching users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchUsers();
  }, [user]);

  // LOGIC: Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // LOGIC: Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // LOGIC: Get status color for online/offline
  const getStatusColor = (status) => {
    return status === "1" ? "success" : "error"; // Assuming '1' is online and '0' is offline
  };

  // LOGIC: Format Date
  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    try {
      return format(new Date(dateString), "PPpp"); // Example: Jul 31, 2024, 12:39 AM
    } catch (error) {
      console.error("Invalid date value:", dateString);
      return "N/A";
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden", bgcolor: grey[50], p: 2 }}>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, border: `1px solid ${blue[100]}` }}
      >
        <Table stickyHeader aria-label="users table">
          <TableHead>
            <TableRow sx={{ bgcolor: blue[50] }}>
              <TableCell>
                <Typography color={blue[800]}>User</Typography>
              </TableCell>
              <TableCell>
                <Typography color={blue[800]}>Online Status</Typography>
              </TableCell>
              <TableCell>
                <Typography color={blue[800]}>Name</Typography>
              </TableCell>
              <TableCell>
                <Typography color={blue[800]}>Email/Phone</Typography>
              </TableCell>
              <TableCell>
                <Typography color={blue[800]}>Last Login</Typography>
              </TableCell>
              <TableCell>
                <Typography color={blue[800]}>Login IP</Typography>
              </TableCell>
              <TableCell>
                <Typography color={blue[800]}>Teams</Typography>
              </TableCell>
              <TableCell>
                <Typography color={blue[800]}>Created At</Typography>
              </TableCell>
              <TableCell>
                <Typography color={blue[800]}>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <AnimatePresence>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data) => (
                  <motion.tr
                    key={data.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#fff",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = blue[50])
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                  >
                    <TableCell>{data.assign_user || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<StatusIcon />}
                        label={
                          data.online_status === "1" ? "Online" : "Offline"
                        }
                        color={getStatusColor(data.online_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{data.first_name || "N/A"}</TableCell>
                    <TableCell>
                      {data.agent_email || "N/A"}
                      <br />
                      {data.agent_mobile || "N/A"}
                    </TableCell>
                    <TableCell>
                      {formatDate(data.verify_loggedin_users?.last_login_at)}
                    </TableCell>
                    <TableCell>
                      {data.verify_loggedin_users?.last_login_IP || "N/A"}
                    </TableCell>
                    <TableCell>
                      {data.teams?.length
                        ? data.teams.map((teamObj, index) => (
                            <span key={teamObj.id}>
                              {teamObj.team || "N/A"}
                              {index < data?.teams?.length - 1 ? ", " : ""}
                            </span>
                          ))
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {formatDate(data.verify_loggedin_users?.created_at)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove">
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </motion.tr>
                ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

// CHANGE: Exported as default
export default UsersTable;
