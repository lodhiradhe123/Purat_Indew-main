import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  TextField,
  Typography,
  Box,
  TablePagination,
  Grid,
  TableSortLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faCalendarAlt,
  faEnvelope,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from "@material-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CreateTemplate from "../../components/Template/CreateTemplate";
import { templateData } from "../../services/api";
import TemplatePreviewModal from "./TemplatePreviewModal"; // Import the modal component

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: "white",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: 800,
  },
  controls: {
    marginBottom: theme.spacing(3),
  },
  searchField: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
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
}));

const MainPage = ({ user, onBack }) => {
  const classes = useStyles();

  
  // State for handling templates and modal view
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("updated_at");
  const [order, setOrder] = useState("desc");
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Store selected template

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await templateData({
          action: "readAll",
          username: user.username,
        });

        const templates = response.data.template;
        const uniqueCategories = [
          ...new Set(templates.map((template) => template.category)),
        ];
        const uniqueLanguages = [
          ...new Set(templates.map((template) => template.language.language)),
        ];

        setTemplates(templates);
        setCategories(uniqueCategories);
        setLanguages(uniqueLanguages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.username]);

  // Convert status codes to text
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      case 3:
        return "Pending";
      default:
        return "";
    }
  };

  // Convert category codes to text
  const getCategoryText = (category) => {
    switch (category) {
      case 1:
        return "Marketing";
      case 2:
        return "Utility";
      case 3:
        return "Authentication";
      default:
        return "";
    }
  };

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates.filter((template) =>
      Object.values(template).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (category) {
      filtered = filtered.filter(
        (template) => getCategoryText(template.category) === category
      );
    }

    if (language) {
      filtered = filtered.filter(
        (template) => template.language.language === language
      );
    }

    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((template) => {
        const date = new Date(template.updated_at);
        return date >= dateRange[0] && date <= dateRange[1];
      });
    }

    // Sort by latest updated date by default or according to user selection
    filtered.sort((a, b) => {
      const dateA = new Date(a[orderBy]);
      const dateB = new Date(b[orderBy]);
      if (order === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    return filtered;
  }, [templates, searchTerm, category, language, dateRange, orderBy, order]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleCreateTemplate = () => {
    setShowCreateTemplate(true);
  };

  // Open modal with selected template
  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={classes.root}
    
    >
      {!showCreateTemplate ? (
        <>
          {/* header */}
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
            <div className="flex justify-between items-center">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="bg-white text-indigo-600 py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center"
                aria-label="Go back"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
              </button>

              {/* Centered Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
                Template Messages
              </h1>

              {/* Create Template Button */}
              <button
                className="bg-white text-indigo-600 py-2 px-6 rounded-full cursor-pointer font-bold hover:bg-indigo-100 transition duration-300"
                onClick={handleCreateTemplate}
                aria-label="Start a new broadcast"
              >
                CreateTemplate →
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
            <Grid container spacing={2} className={classes.controls}>
              <Grid item xs={12} sm={3}>
                <TextField
                  className={classes.searchField}
                  variant="outlined"
                  size="small"
                  placeholder="Search templates"
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={getCategoryText(cat)}>
                        {getCategoryText(cat)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl variant="outlined" fullWidth size="small">
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    label="Language"
                  >
                    <MenuItem value="">All</MenuItem>
                    {languages.map((lang) => (
                      <MenuItem key={lang} value={lang}>
                        {lang}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  selectsRange
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={(update) => setDateRange(update)}
                  isClearable
                  customInput={
                    <TextField variant="outlined" size="small" fullWidth />
                  }
                  placeholderText="Select date range"
                />
              </Grid>
            </Grid>

            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table className={classes.table}>
                <TableHead className={classes.tableHead}>
                  <TableRow>
                    {[
                      "ID",
                      "Template Name",
                      "Category",
                      "Status",
                      "Reason",
                      "Language",
                      "Last Updated",
                      "Actions",
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
                  <AnimatePresence>
                    {(rowsPerPage > 0
                      ? filteredAndSortedTemplates.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : filteredAndSortedTemplates
                    ).map((template) => (
                      <motion.tr
                        key={template.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={classes.tableRow}
                      >
                        <TableCell>{template.id}</TableCell>
                        <TableCell>{template.template_name}</TableCell>
                        <TableCell>
                          {getCategoryText(template.category)}
                        </TableCell>{" "}
                        <TableCell>{getStatusText(template.status)}</TableCell>{" "}
                        <TableCell>{template.reason}</TableCell>
                        <TableCell>{template.language.language}</TableCell>
                        <TableCell>
                          {new Date(template.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            aria-label="View template"
                            onClick={() => handlePreview(template)} // Call modal on click
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>

            {filteredAndSortedTemplates.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredAndSortedTemplates.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </div>
        </>
      ) : (
        <CreateTemplate
          onClose={() => setShowCreateTemplate(false)}
          user={user}
          onBack={() => setShowCreateTemplate(false)}
        />
      )}

      {/* Render Modal */}
      {isModalOpen && (
        <TemplatePreviewModal
          template={selectedTemplate}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </motion.div>
  );
};

export default MainPage;
