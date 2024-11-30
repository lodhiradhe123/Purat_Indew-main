import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardNavbar from "../Navbar/DashboardNavbar";
import StatsModal from "./StatsModal";
import Modal from "../Modal";
import AddUrlModal from "./AddUrlModal";
import DeleteConfirmation from "../DeleteConfirmation/DeleteModal";

import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Pagination,
  Tooltip,
} from "@mui/material";

import { urlShortener } from "../../services/api";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faTrash,
  faChartBar,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const URLShortener = ({ user }) => {
  const [urlList, setUrlList] = useState([]);
  const [copiedUrlId, setCopiedUrlId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const [itemsPerPage] = useState(10); // 10 items per page for a cleaner look
  const navigate = useNavigate();

  const baseUrl = "http://localhost:5173/url/";

  // Fetch URLs on component load
  const fetchUrls = async () => {
    const payload = {
      action: "read",
      username: user,
    };

    try {
      const response = await urlShortener(payload);
      if (response?.status === 200 && response?.data?.data?.length > 0) {
        setUrlList(response.data.data.reverse());
      } else {
        toast.info("No URLs found.");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          for (const key in data.errors) {
            toast.error(`${key}: ${data.errors[key].join(", ")}`);
          }
        } else {
          toast.error(data.message || data.error);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // Handle URL shortening form submit
  const handleAddUrl = async (urlType, longURL) => {
    const payload = {
      action: "create",
      username: user,
      input_type: urlType,
      l_url: longURL,
    };

    try {
      const response = await urlShortener(payload);
      if (response?.data?.data?.s_url) {
        toast.success("URL shortened successfully!");
        fetchUrls();
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          for (const key in data.errors) {
            toast.error(`${key}: ${data.errors[key].join(", ")}`);
          }
        } else {
          toast.error(data.message || data.error);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // Handle URL copy to clipboard
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrlId(url);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopiedUrlId(null), 1000);
    });
  };

  const handleStats = async (s_url) => {
    const payload = {
      action: "readSpecific",
      username: user,
      s_url: s_url,
    };

    try {
      const response = await urlShortener(payload);
      console.log("stats", response);
      if (response?.status === 200 && response?.data?.data) {
        const statsData = response.data.data;
        const clicksCount = response.data.clicks_count;

        setStatsData({ ...statsData, clicks_count: clicksCount });
        setIsModalOpen(true);
      } else {
        toast.error("Failed to retrieve stats:");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          for (const key in data.errors) {
            toast.error(`${key}: ${data.errors[key].join(", ")}`);
          }
        } else {
          toast.error(data.message || data.error);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const payload = {
      action: "delete",
      id: deleteItem.id,
    };

    try {
      const response = await urlShortener(payload);
      if (response?.status === 200) {
        toast.success(response?.data?.message);
        fetchUrls();
      } else {
        toast.error("Failed to delete URL:");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          for (const key in data.errors) {
            toast.error(`${key}: ${data.errors[key].join(", ")}`);
          }
        } else {
          toast.error(data.message || data.error);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setDeleteModalOpen(false);
      setDeleteItem(null);
    }
  };

  const handleUrlModalOpen = () => setIsUrlModalOpen(true);
  const handleUrlModalClose = () => setIsUrlModalOpen(false);

  const openDeleteConfirmation = (item) => {
    setDeleteItem(item);
    setDeleteModalOpen(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUrls = urlList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(urlList.length / itemsPerPage);

  useEffect(() => {
    fetchUrls();
  }, [user]);

  return (
    <Box>
      <DashboardNavbar />

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ p: 4, width: "100%" }}>
          <div className="bg-white py-4 px-2 shadow-md mb-5 rounded-xl">
            <div className="flex justify-between items-center">
              <Button
                startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                onClick={() => navigate("/dashboard")}
                variant="text" // Removes the border and background for a flat appearance
                color="primary"
                sx={{
                  textTransform: "none", // Optional: Keep the text casing as is
                  fontWeight: "bold", // Make the text bold for better visibility
                }}
              >
                Back
              </Button>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  mx: "auto",
                  fontWeight: "bold", // Highlight the title
                  color: "primary.main", // Optional: Ensure the color aligns with your theme
                }}
              >
                URL Shortener
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={handleUrlModalOpen}
              >
                Add URL
              </Button>
            </div>
          </div>

          {currentUrls.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <TableContainer
                component={Paper}
                sx={{ width: "100%", margin: "0 auto" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          width: "25%",
                        }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          width: "25%",
                        }}
                      >
                        Short URL
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          width: "25%",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {currentUrls.map((url) => {
                      const fullUrl = `${baseUrl}${url.s_url}`;
                      return (
                        <TableRow key={url.id}>
                          <TableCell>{url.input_type}</TableCell>

                          <TableCell>
                            <Button
                              onClick={() => window.open(fullUrl, "_blank")}
                              color="primary"
                              sx={{
                                textTransform: "none",
                                wordBreak: "break-all",
                              }}
                            >
                              {fullUrl}
                            </Button>
                          </TableCell>

                          <TableCell
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                              textAlign: "center",
                            }}
                          >
                            <Tooltip title="Copy URL" arrow>
                              <IconButton
                                onClick={() => handleCopy(fullUrl)}
                                color={
                                  fullUrl === copiedUrlId
                                    ? "success"
                                    : "primary"
                                }
                              >
                                <FontAwesomeIcon icon={faCopy} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete URL" arrow>
                              <IconButton
                                onClick={() => openDeleteConfirmation(url)}
                                color="error"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="View Statistics" arrow>
                              <IconButton
                                onClick={() => handleStats(url.s_url)}
                                color="success"
                              >
                                <FontAwesomeIcon icon={faChartBar} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            </motion.div>
          )}

          {isUrlModalOpen && (
            <Modal
              isModalOpen={isUrlModalOpen}
              closeModal={handleUrlModalClose}
              width="500px"
              height="auto"
            >
              <AddUrlModal
                onClose={handleUrlModalClose}
                onSubmit={handleAddUrl}
              />
            </Modal>
          )}

          {deleteModalOpen && (
            <Modal
              isModalOpen={deleteModalOpen}
              closeModal={() => setDeleteModalOpen(false)}
              width="400px"
              height="200px"
            >
              <DeleteConfirmation
                itemType="URL"
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
              />
            </Modal>
          )}

          <StatsModal
            isOpen={isModalOpen}
            statsData={statsData}
            baseUrl={baseUrl}
            onClose={() => setIsModalOpen(false)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default URLShortener;
