import { useState, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer } from "react-toastify";

import SearchIcon from "@mui/icons-material/Search";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Board from "../../components/Crm/Board";
import TicketList from "../../components/Crm/TicketList";
import Modal from "../../components/Modal";
import AddUser from "../../components/Crm/AddUserModal";
import ChooseChannel from "../../components/Crm/ChannelsModal";

import { Button, TextField, Tooltip } from "@mui/material";

import handleApiError from "../../utils/errorHandler";
import { fetchCrmChats } from "../../services/api";

const Crm = ({ user }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isKanbanView, setIsKanbanView] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isChooseChannelModalOpen, setIsChooseChannelModalOpen] =
    useState(false);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const fetchData = async () => {
    try {
      const response = await fetchCrmChats({ username: user });
      setTickets(response?.data?.data);
      setFilteredTickets(response?.data?.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleViewChange = (view) => {
    setIsKanbanView(view);
  };

  const toggleAddUserModal = () => {
    setIsAddUserModalOpen(!isAddUserModalOpen);
  };

  const openChooseChannelModal = () => {
    setIsChooseChannelModalOpen(true);
  };

  const closeChooseChannelModal = () => {
    setIsChooseChannelModalOpen(false);
  };

  const handleDateRangeChange = (update) => {
    setDateRange(update);
  };

  const filteredAndSortedTickets = useMemo(() => {
    let filtered = [...tickets];

    if (searchValue) {
      filtered = filtered?.filter(
        (ticket) =>
          ticket?.replySourceMessage
            ?.toLowerCase()
            ?.includes(searchValue?.toLowerCase()) ||
          ticket?.receiver_id
            ?.toLowerCase()
            ?.includes(searchValue?.toLowerCase()) ||
          ticket?.agent?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
          ticket?.chat_room?.name
            ?.toLowerCase()
            ?.includes(searchValue?.toLowerCase()) ||
          ticket?.chat_room?.receiver_id
            ?.toLowerCase()
            ?.includes(searchValue?.toLowerCase()) ||
          ticket?.chat_room?.assign_to
            ?.toLowerCase()
            ?.includes(searchValue?.toLowerCase())
      );
    }

    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.created_at);

        // Create a new end date that includes the entire last day
        const endDatePlusOne = new Date(dateRange[1]);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        endDatePlusOne.setHours(0, 0, 0, 0);

        return ticketDate >= dateRange[0] && ticketDate < endDatePlusOne;
      });
    }

    return filtered;
  }, [tickets, searchValue, dateRange]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredTickets(filteredAndSortedTickets);
  }, [filteredAndSortedTickets]);

  return (
    <>
      <ToastContainer />

      <div className="flex-auto overflow-auto max-h-[92vh] scrollbar-hide">
        <div className="mt-4 flex justify-between px-4 items-center">
          <div className="flex gap-4">
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              value={searchValue}
              onChange={handleSearch}
            />

            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={handleDateRangeChange}
              isClearable
              customInput={
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Filter by Date"
                />
              }
              placeholderText="Filter by Date"
            />
          </div>

          <div className="flex gap-2">
            <Tooltip title="Kanban View">
              <ViewKanbanOutlinedIcon
                className={`cursor-pointer ${
                  isKanbanView ? "text-slate-500" : "text-slate-400"
                }`}
                onClick={() => handleViewChange(true)}
              />
            </Tooltip>

            <Tooltip title="List View">
              <ListAltOutlinedIcon
                className={`cursor-pointer ${
                  !isKanbanView ? "text-slate-500" : "text-slate-400"
                }`}
                onClick={() => handleViewChange(false)}
              />
            </Tooltip>
          </div>

          <Button
            variant="contained"
            color="primary"
            disabled={selectedTickets.length === 0}
            onClick={openChooseChannelModal}
          >
            Send Message
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={toggleAddUserModal}
          >
            Add User
          </Button>
        </div>

        {isKanbanView ? (
          <DndProvider backend={HTML5Backend}>
            <Board
              user={user}
              data={filteredTickets}
              setTickets={setTickets}
              setFilteredTickets={setFilteredTickets}
              fetchData={fetchData}
            />
          </DndProvider>
        ) : (
          <TicketList
            tickets={filteredTickets}
            user={user}
            selectedTickets={selectedTickets}
            setSelectedTickets={setSelectedTickets}
          />
        )}

        {isAddUserModalOpen && (
          <Modal
            isModalOpen={isAddUserModalOpen}
            closeModal={toggleAddUserModal}
            height="70vh"
            width="50vw"
          >
            <AddUser
              user={user}
              closeModal={toggleAddUserModal}
              fetchData={fetchData}
            />
          </Modal>
        )}

        {isChooseChannelModalOpen && (
          <Modal
            isModalOpen={isChooseChannelModalOpen}
            closeModal={closeChooseChannelModal}
            height="60vh"
            width="50vw"
            className="rounded-lg"
          >
            <ChooseChannel
              user={user}
              selectedContacts={selectedTickets}
              closeChooseChannelModal={closeChooseChannelModal} // Pass close function
              setSelectedTickets={setSelectedTickets} // Pass setter for clearing selected tickets
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default Crm;
