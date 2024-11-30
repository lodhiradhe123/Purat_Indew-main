import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  TablePagination,
} from "@mui/material";

import {
  handleContactOperations,
  handleGroupOperations,
} from "../../services/api";

const GroupModal = ({ user, onGroupSelect, closeModal }) => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]); // For filtered data
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true); // Loading state

  const fetchGroups = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await handleGroupOperations({
        action: "read",
        username: user,
      });
      const groupData = response?.data || [];
      setGroups(groupData);
      setFilteredGroups(groupData); // Initialize filteredGroups with all data
    } catch (error) {
      toast.error("Error fetching groups");
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  const handleGroupClick = async (groupId) => {
    try {
      const response = await handleContactOperations({
        action: "read",
        username: user,
        Contact_group_id: groupId,
      });

      const contacts = response?.data?.data || [];
      // Extract mobile numbers and filter out invalid ones
      const mobileNumbers = contacts
        .map((contact) => contact.contact_mobile_number)
        .filter((number) => number && /^\d+$/.test(number));

      // Pass the mobile numbers to parent component
      onGroupSelect(mobileNumbers);
      closeModal();
      toast.success("Contacts imported successfully");
    } catch (error) {
      toast.error("Error fetching contacts");
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = groups.filter((group) =>
      group.Group_name.toLowerCase().includes(value)
    );
    setFilteredGroups(filtered);

    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <Box>
      <Typography variant="h6" mb={3}>
        Import Contacts From Group
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TextField
            label="Search Group"
            variant="outlined"
            fullWidth
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            margin="normal"
          />

          <TableContainer component={Paper} className="shadow-sm my-6">
            <Table className="min-w-full">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "25%", textAlign: "center" }}>
                    Group Name
                  </TableCell>

                  <TableCell style={{ width: "25%", textAlign: "center" }}>
                    Contacts Count
                  </TableCell>

                  <TableCell style={{ width: "25%", textAlign: "center" }}>
                    Created at
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredGroups
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((group) => (
                    <TableRow
                      key={group.id}
                      hover
                      className="cursor-pointer"
                      onClick={() => handleGroupClick(group.id)}
                    >
                      <TableCell style={{ textAlign: "center" }}>
                        {group.Group_name}
                      </TableCell>

                      <TableCell style={{ textAlign: "center" }}>
                        {group.count || "N/A"}
                      </TableCell>

                      <TableCell style={{ textAlign: "center" }}>
                        {new Date(group.created_at).toLocaleDateString("en-GB")}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={filteredGroups.length} // Use filteredGroups count
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per page:"
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default GroupModal;
