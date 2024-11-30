import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import Modal from "../Modal";
import DeleteConfirmation from "../DeleteConfirmation/DeleteModal";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Box,
  TablePagination,
} from "@mui/material";
import { Search, ContentCopy, Edit, Delete } from "@mui/icons-material";

import handleApiError from "../../utils/errorHandler";
import { chatbotFlow } from "../../services/api";

const ChatbotRecord = ({ user }) => {
  const navigate = useNavigate();

  const [chatBots, setChatBots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatbotToDelete, setChatbotToDelete] = useState(null);

  const fetchChatBots = async () => {
    const payload = { action: "read", username: user };
    try {
      const response = await chatbotFlow(payload);

      setChatBots(response?.data?.data?.reverse() || []);
    } catch (error) {
      handleApiError(error);
      setChatBots([]);
    }
  };

  const handleDeleteChatBot = async (id) => {
    const payload = { action: "delete", flow_id: id };
    try {
      await chatbotFlow(payload);
      toast.success("Chatbot Deleted Successfully");
      setChatBots((prev) => prev.filter((chatbot) => chatbot.id !== id)); // Remove chatbot from state after deletion
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsDeleteModalOpen(false); // Close the modal after deletion
    }
  };

  const handleDeleteClick = (chatbot) => {
    setChatbotToDelete(chatbot); // Store the chatbot to be deleted
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  const handleClick = () => {
    navigate("/dashboard/whatsapp/chatbotBuilder");
  };

  const filteredChatBots = chatBots.filter((chatbot) =>
    chatbot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchChatBots();
  }, [user]);

  return (
    <div className="bg-slate-50 p-4">
      <ToastContainer />

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-2xl">Chatbots</h3>

        <Box className="flex flex-col items-end gap-2">
          <Button variant="contained" color="primary" onClick={handleClick}>
            Add Chatbot
          </Button>

          <TextField
            variant="outlined"
            placeholder="Search Your Bots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />,
              style: { backgroundColor: "white" },
            }}
            size="small"
          />
        </Box>
      </div>

      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Triggered</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Steps Finished</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Finished</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Modified on</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredChatBots
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((chatbot, index) => (
                <TableRow key={index}>
                  <TableCell>{chatbot.name}</TableCell>
                  <TableCell>{chatbot.trigger_key}</TableCell>
                  <TableCell>{chatbot.stepsFinished}</TableCell>
                  <TableCell>{chatbot.finished}</TableCell>
                  <TableCell></TableCell>

                  <TableCell>
                    <IconButton
                      sx={{
                        color: "rgb(59 130 246)",
                        "&:hover": { color: "rgb(29 78 216)" },
                      }}
                      title="Copy"
                    >
                      <ContentCopy />
                    </IconButton>

                    <IconButton
                      sx={{
                        color: "rgb(34 197 94)",
                        "&:hover": { color: "rgb(21 128 61)" },
                      }}
                      title="Edit"
                    >
                      <Edit />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDeleteClick(chatbot)}
                      sx={{
                        color: "rgb(239 68 68)",
                        "&:hover": { color: "rgb(185 28 28)" },
                      }}
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredChatBots.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal
        isModalOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        width="40vw"
        height="30vh"
      >
        <DeleteConfirmation
          onConfirm={() => handleDeleteChatBot(chatbotToDelete.id)}
          onCancel={() => setIsDeleteModalOpen(false)}
          itemType="chatbot"
        />
      </Modal>
    </div>
  );
};

export default ChatbotRecord;
