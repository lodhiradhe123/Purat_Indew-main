import { useState, useEffect, useCallback, useRef } from "react";

import Column from "./Column";
import Modal from "../../components/Modal";
import ChatDetailModal from "./ChatDetailModal";

import handleApiError from "../../utils/errorHandler";
import { fetchCrmSpecificChat, updateChatStatus } from "../../services/api";
import DeleteConfirmation from "../DeleteConfirmation/DeleteModal";
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB");
};

const statusMapping = {
  5: "new",
  6: "qualified",
  7: "proposition",
  8: "won",
};

const reverseStatusMapping = {
  new: 5,
  qualified: 6,
  proposition: 7,
  won: 8,
};

const Board = ({ user, data, setTickets, setFilteredTickets, fetchData }) => {
  const [state, setState] = useState({
    columns: {
      new: { id: "new", title: "New", ticketIds: [] },
      qualified: { id: "qualified", title: "Qualified", ticketIds: [] },
      proposition: {
        id: "proposition",
        title: "Proposition",
        ticketIds: [],
      },
      won: { id: "won", title: "Won", ticketIds: [] },
    },
    tickets: {},
    columnOrder: ["new", "qualified", "proposition", "won"],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatDetails, setChatDetails] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  const ongoingStatusUpdateRef = useRef(new Set());

  const moveTicket = useCallback(
    async (ticketId, sourceColumnId, targetColumnId, targetIndex) => {
      if (ongoingStatusUpdateRef.current.has(ticketId)) return;

      const currentTicket = state.tickets[ticketId];
      const sourceColumn = state.columns[sourceColumnId];
      const targetColumn = state.columns[targetColumnId];

      const sourceTicketIds = Array.from(sourceColumn.ticketIds);
      sourceTicketIds.splice(sourceTicketIds.indexOf(ticketId), 1);

      const targetTicketIds = Array.from(targetColumn.ticketIds);
      targetTicketIds.splice(targetIndex, 0, ticketId);

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [sourceColumnId]: {
            ...sourceColumn,
            ticketIds: sourceTicketIds,
          },
          [targetColumnId]: {
            ...targetColumn,
            ticketIds: targetTicketIds,
          },
        },
        tickets: {
          ...state.tickets,
          [ticketId]: {
            ...currentTicket,
            status: targetColumnId,
          },
        },
      };

      setState(newState);

      ongoingStatusUpdateRef.current.add(ticketId);

      // Determine new status value
      const statusValue = reverseStatusMapping[targetColumnId];

      // Call API to update status
      const payload = {
        action: "status",
        receiver_id: state.tickets[ticketId].number,
        username: user,
        value: statusValue,
      };

      try {
        await updateChatStatus(payload);

        const updatedTickets = data.map((ticket) =>
          ticket.receiver_id === state.tickets[ticketId].number
            ? {
                ...ticket,
                chat_room: {
                  ...ticket.chat_room,
                  status: statusValue,
                },
              }
            : ticket
        );

        setTickets(updatedTickets);
        setFilteredTickets(updatedTickets);
        fetchData();
      } catch (error) {
        setState(state);
        handleApiError(error);
      } finally {
        // Remove ticket from ongoing updates
        ongoingStatusUpdateRef.current.delete(ticketId);
      }
    },
    [state, data, user, setTickets, setFilteredTickets]
  );

  const handleTicketClick = async (receiver_id) => {
    const payload = { action: "read", username: user, receiver_id };
    try {
      const response = await fetchCrmSpecificChat(payload);
      setChatDetails(response?.data?.data);
      setIsModalOpen(true);
    } catch (error) {
      handleApiError(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setChatDetails(null);
  };

  const handleDeleteTicket = async (ticketId) => {
    const ticket = state.tickets[ticketId];
    const payload = {
      action: "delete",
      username: user,
      receiver_id: ticket.number,
    };

    try {
      await fetchCrmSpecificChat(payload);

      const { [ticketId]: _, ...remainingTickets } = state.tickets;
      const newColumns = { ...state.columns };

      Object.keys(newColumns).forEach((columnId) => {
        newColumns[columnId].ticketIds = newColumns[columnId].ticketIds.filter(
          (id) => id !== ticketId
        );
      });

      setState({
        ...state,
        tickets: remainingTickets,
        columns: newColumns,
      });

      toast.success("User Deleted Successfully");
    } catch (error) {
      handleApiError(error);
    }
  };

  const openDeleteModal = (ticketId) => {
    setTicketToDelete(ticketId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (ticketToDelete) {
      await handleDeleteTicket(ticketToDelete);
      setIsDeleteModalOpen(false);
      setTicketToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTicketToDelete(null);
  };

  useEffect(() => {
    const tickets = {};
    const columns = {
      new: { id: "new", title: "New", ticketIds: [] },
      qualified: {
        id: "qualified",
        title: "Qualified",
        ticketIds: [],
      },
      proposition: {
        id: "proposition",
        title: "Proposition",
        ticketIds: [],
      },
      won: { id: "won", title: "Won", ticketIds: [] },
    };

    data?.forEach((chat, index) => {
      const status = chat.chat_room?.status;
      if (![5, 6, 7, 8].includes(status)) return;

      const ticketId = `ticket-${index + 1}`;

      const ticketName = chat?.replySourceMessage || chat?.chat_room?.name;
      const ticketNumber = chat?.receiver_id || chat?.chat_room?.receiver_id;
      const ticketAgent = chat?.chat_room?.assign_user?.assign_user;
      const ticketDate = chat?.created_at || chat?.chat_room?.created_at;

      tickets[ticketId] = {
        id: ticketId,
        name: ticketName,
        number: ticketNumber,
        agent: ticketAgent,
        date: formatDate(ticketDate),
        status: statusMapping[status], // Convert status to label
      };

      const columnId = statusMapping[status];
      columns[columnId].ticketIds.push(ticketId);
    });

    setState({
      columns,
      tickets,
      columnOrder: ["new", "qualified", "proposition", "won"],
    });
  }, [data]);

  return (
    <>
      <div className="flex space-x-4 p-4 w-full h-[calc(100vh-120px)]">
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          const tickets = column.ticketIds.map(
            (ticketId) => state.tickets[ticketId]
          );

          return (
            <Column
              key={column.id}
              column={column}
              tickets={tickets}
              moveTicket={moveTicket}
              onClick={handleTicketClick}
              user={user}
              onDelete={openDeleteModal}
            />
          );
        })}
      </div>

      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          height="70vh"
          width="50vw"
        >
          <ChatDetailModal
            data={chatDetails}
            user={user}
            closeModal={closeModal}
            fetchData={fetchData}
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          isModalOpen={isDeleteModalOpen}
          closeModal={cancelDelete}
          height="40vh"
          width="30vw"
          className="rounded-lg"
        >
          <DeleteConfirmation
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            itemType="chat"
          />
        </Modal>
      )}
    </>
  );
};

export default Board;
