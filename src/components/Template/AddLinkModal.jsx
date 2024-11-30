import React, { useState, useEffect } from "react";
import { urlShortener } from "../../services/api"; // Assuming your service path is correct
import { CopyAll, AddCircle } from "@mui/icons-material"; // Material UI icons
import { IconButton } from "@mui/material"; // For responsive buttons
import { toast, ToastContainer } from "react-toastify"; // Toast notification
import "react-toastify/dist/ReactToastify.css"; // Toastify styles

const baseUrl = "http://localhost:5173/url/"; // Base URL for short URLs

const AddLinkModal = ({ isOpen, onClose, onAddLink, user }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(5); // Show 5 links per page for pagination

  // Fetch links when modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchUrls();
    }
  }, [isOpen, user]);

  const fetchUrls = async () => {
    setLoading(true);
    const urlshortenData = {
      action: "read",
      username: user.username,
    };

    try {
      const response = await urlShortener(urlshortenData);
      if (response?.status === 200 && response.data?.data?.length > 0) {
        setLinks(response.data.data.reverse()); // Reverse to show most recent first
      } else {
        console.error("Failed to fetch URLs:", response);
      }
    } catch (error) {
      console.error(
        "Error fetching URLs:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = links.slice(indexOfFirstLink, indexOfLastLink);
  const totalPages = Math.ceil(links.length / linksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!", { position: "top-right" });
  };

  const handleAddLink = (link) => {
    onAddLink(link); // Pass link back to the parent
    onClose(); // Close modal after adding the link
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold">Select a Link</h2>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-700"
            >
              Close
            </button>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            <>
              <table className="w-full table-auto border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border-b">Type</th>
                    <th className="text-left p-2 border-b">Short URL</th>
                    <th className="text-left p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLinks.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="p-2 border-b">{link.input_type}</td>{" "}
                      {/* Display Type */}
                      <td className="text-blue-500 p-2 border-b break-all">
                        <a
                          href={`${baseUrl}${link.s_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {`${baseUrl}${link.s_url}`}
                        </a>
                      </td>
                      <td className="p-2 border-b space-x-2">
                        <IconButton
                          size="small"
                          aria-label="Copy link"
                          onClick={() =>
                            handleCopyLink(`${baseUrl}${link.s_url}`)
                          }
                        >
                          <CopyAll className="text-gray-500" />
                        </IconButton>
                        <IconButton
                          size="small"
                          aria-label="Add link"
                          onClick={() =>
                            handleAddLink(`${baseUrl}${link.s_url}`)
                          }
                        >
                          <AddCircle className="text-blue-500" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center">
                <button
                  className={`bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className={`bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default AddLinkModal;
