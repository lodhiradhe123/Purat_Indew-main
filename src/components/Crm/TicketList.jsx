import { useMemo, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { toast } from "react-toastify";

import Modal from "../Modal";
import ChatDetailModal from "./ChatDetailModal";

import handleApiError from "../../utils/errorHandler";
import { fetchCrmSpecificChat } from "../../services/api";

const STATUS_MAPPING = {
  5: "new",
  6: "qualified",
  7: "proposition",
  8: "won",
};

const VALID_STATUSES = new Set([5, 6, 7, 8]);
const TICKETS_PER_PAGE = 10;

const TicketList = ({ tickets, user, selectedTickets, setSelectedTickets }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatDetails, setChatDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        const status = ticket.chat_room?.status;
        return status && VALID_STATUSES.has(status);
      })
      .map((ticket) => ({
        id: ticket.chat_room?.receiver_id || ticket.receiver_id,
        name: ticket.replySourceMessage || ticket.chat_room?.name || "No Name",
        number: ticket.receiver_id || ticket.chat_room?.receiver_id,
        agent: ticket.chat_room?.assign_to || ticket.agent || "Unassigned",
        date: new Date(ticket.created_at || ticket.chat_room?.created_at),
        status: STATUS_MAPPING[ticket.chat_room?.status],
        originalTicket: ticket, // Keep original ticket for reference
      }));
  }, [tickets]);

  const handleTicketClick = async (ticket) => {
    try {
      const response = await fetchCrmSpecificChat({
        action: "read",
        username: user,
        receiver_id: ticket.id,
      });
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

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectedTickets(
      checked ? normalizedTickets.map((ticket) => ticket.id) : []
    );
  };

  const handleCheckboxChange = (e, ticket) => {
    e.stopPropagation();
    setSelectedTickets((prev) =>
      prev.includes(ticket.id)
        ? prev.filter((selectedId) => selectedId !== ticket.id)
        : [...prev, ticket.id]
    );
  };

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * TICKETS_PER_PAGE;
    return normalizedTickets.slice(startIndex, startIndex + TICKETS_PER_PAGE);
  }, [normalizedTickets, currentPage]);

  if (!normalizedTickets.length) {
    return toast.success("No tickets found matching the criteria");
  }

  return (
    <div className="flex flex-col w-full p-4">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedTickets.length === normalizedTickets.length}
              />
            </th>
            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
              Number
            </th>
            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
              Agent
            </th>
            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedTickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(e, ticket)}
                  checked={selectedTickets.includes(ticket.id)}
                />
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
                {ticket.name}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
                {ticket.number}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
                {ticket.agent}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
                {ticket.date.toLocaleDateString("en-GB")}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
                {ticket.date.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
                {ticket.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {normalizedTickets.length > TICKETS_PER_PAGE && (
        <Pagination
          count={Math.ceil(normalizedTickets.length / TICKETS_PER_PAGE)}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color="primary"
          className="mt-4 self-center"
        />
      )}

      <Modal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        height="70vh"
        width="50vw"
      >
        <ChatDetailModal data={chatDetails} user={user} />
      </Modal>
    </div>
  );
};

export default TicketList;
