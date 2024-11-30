import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  TablePagination,
  Paper,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import Modal from "../../components/Modal";
import DeleteConfirmation from "../../components/DeleteConfirmation/DeleteModal";

import handleApiError from "../../utils/errorHandler";
import { handleGroupOperations } from "../../services/api";

const StyledHeaderCell = styled(TableCell)({
  fontWeight: 600,
  textAlign: "center",
  width: "25%",
  fontSize: "18px",
});

const GroupList = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalGroups, setTotalGroups] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null); // To store the selected group for edit/delete
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false); // For "Add Group" modal
  const [newGroupName, setNewGroupName] = useState("");

  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      const response = await handleGroupOperations({
        action: "read",
        username: user,
      });
      setGroups(response?.data?.reverse() || []);
      setTotalGroups(response?.data?.length);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (selectedGroup) {
        await handleGroupOperations({
          action: "delete",
          group_id: selectedGroup.id,
          username: user,
        });
        toast.success("Group deleted successfully!");
        fetchGroups();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditGroup = async () => {
    try {
      if (selectedGroup) {
        await handleGroupOperations({
          action: "update",
          group_id: selectedGroup.id,
          group_name: selectedGroup.Group_name,
        });

        toast.success("Group updated successfully!");
        fetchGroups();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const handleAddGroup = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        action: "create",
        username: user,
        group_name: newGroupName,
        added_by: user,
      };
      await handleGroupOperations(payload);
      toast.success("Group created successfully!");
      setIsAddGroupModalOpen(false);
      setNewGroupName("");
      fetchGroups();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleGroupClick = (groupId, groupName, groups) => {
    navigate(
      `/dashboard/whatsapp/contacts/${groupId}/${encodeURIComponent(
        groupName
      )}`,
      {
        state: {
          groups,
          selectedGroupId: groupId,
          selectedGroupName: groupName,
        },
      }
    );
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
  }, [user]);

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center">
        <Typography variant="h4">Contact Groups</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsAddGroupModalOpen(true)}
        >
          Add Group
        </Button>
      </div>

      <TableContainer component={Paper} className="shadow-sm my-6">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              <StyledHeaderCell>Group Name</StyledHeaderCell>
              <StyledHeaderCell>Contacts Count</StyledHeaderCell>
              <StyledHeaderCell>Date Created</StyledHeaderCell>
              <StyledHeaderCell>Actions</StyledHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {groups
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((group) => (
                <TableRow
                  key={group.id}
                  hover
                  onClick={() => handleGroupClick(group.id, group.Group_name)}
                  className="cursor-pointer"
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

                  <TableCell style={{ textAlign: "center" }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGroup(group);
                        setIsEditModalOpen(true); // Open edit modal
                      }}
                      className="!text-blue-600"
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGroup(group);
                        setIsDeleteModalOpen(true); // Open delete modal
                      }}
                      className="!text-red-600"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalGroups}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          rowsPerPageOptions={[10, 25, 50]}
        />
      </TableContainer>

      <Modal
        isModalOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        width="30%"
        height="30%"
        className="rounded-md"
      >
        <div>
          <Typography variant="h6" className="border-b pb-1">
            Edit Group
          </Typography>

          <TextField
            type="text"
            value={selectedGroup?.Group_name || ""}
            onChange={(e) =>
              setSelectedGroup({ ...selectedGroup, Group_name: e.target.value })
            }
            className="!my-4"
            placeholder="Enter new group name"
            fullWidth
            variant="outlined"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "16px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditGroup}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isModalOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        width="30vw"
        height="30vh"
        className="rounded-lg"
      >
        <DeleteConfirmation
          itemType="group"
          onConfirm={handleDeleteGroup}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </Modal>

      <Modal
        isModalOpen={isAddGroupModalOpen}
        closeModal={() => setIsAddGroupModalOpen(false)}
        width="30vw"
        height="30vh"
        className="rounded p-6"
      >
        <div>
          <Typography variant="h6" className="border-b pb-2">
            Add New Group
          </Typography>

          <form onSubmit={handleAddGroup} className="flex flex-col gap-4 mt-4">
            <TextField
              label="Group Name"
              variant="outlined"
              fullWidth
              required
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="mb-4"
            />

            <div className="flex justify-end">
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default GroupList;
