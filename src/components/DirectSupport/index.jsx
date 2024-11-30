

// DirectSupport.jsx
import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Fade,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faVideo, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import DashboardNavbar from '../Navbar/DashboardNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supportTickets } from "../../services/api";
import TicketChat from './TicketChat.jsx';

// Start Point: Styles
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        margin: 0,
        maxHeight: '100%',
      },
    },
  },
  previewImage: {
    width: '100%',
    height: 'auto',
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  previewVideo: {
    width: '100%',
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dialogActions: {
    justifyContent: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  errorMessage: {
    color: theme.palette.error.main,
    fontSize: '0.875rem',
    marginTop: theme.spacing(1),
  },
  charCount: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    textAlign: 'right',
    marginTop: theme.spacing(1),
  },
  previewDialog: {
    '& .MuiDialog-paper': {
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2),
      maxWidth: '500px',
      margin: 'auto',
    },
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
  },
  tableHeadCell: {
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  // ADD by SHUBHAM: New animation styles
  fadeIn: {
    animation: '$fadeIn 0.3s ease-in-out',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));
// End Point: Styles

// Start Point: DirectSupport Component
const DirectSupport = ({ user, setUser }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State declarations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubjectSubcategory, setSelectedSubjectSubcategory] = useState('');
  const [subject, setSubject] = useState('');
  const [mediaType, setMediaType] = useState('Media');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('');
  const [body, setBody] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [fileError, setFileError] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Logic: Categories data
  const categories = {
    'Account and Billing': ['Account Setup', 'Subscription Plans', 'Billing Inquiries', 'Payment Issues', 'Account Suspension'],
    'Technical Support': ['Login Issues', 'Platform Errors', 'API Integration', 'System Downtime', 'Feature Requests'],
    'Bulk SMS': {
      'Message Delivery': ['Delivery Failures', 'Delayed Messages', 'Incorrect Recipients', 'Message Not Received'],
      'Message Content': ['Content Restrictions', 'Character Limits', 'Unicode Issues', 'Customization'],
      'Campaign Management': ['Scheduling Issues', 'Campaign Reports', 'Contact List Management', 'Opt-out Handling']
    },
    'Bulk Voice Call': {
      'Call Quality': ['Poor Audio Quality', 'Call Drops', 'Echo Issues', 'Call Delays'],
      'Call Setup': ['IVR Configuration', 'Call Scheduling', 'Concurrent Call Limits', 'Call Recording'],
      'Campaign Management': ['Call Reports', 'Contact List Management', 'Opt-out Handling']
    },
    'Bulk WhatsApp (Unofficial)': {
      'Message Delivery': ['Delivery Failures', 'Delayed Messages', 'Incorrect Recipients', 'Message Not Received'],
      'Content': ['Message Formatting', 'Media Attachments', 'Interactive Messages']
    },
    'Compliance and Legal': ['Data Privacy Concerns', 'Spam Complaints', 'Regulatory Compliance', 'Terms of Service Violations'],
    'Training and Onboarding': ['Platform Training', 'User Guides and Tutorials', 'Onboarding Assistance', 'Webinars and Workshops'],
    'Feedback and Suggestions': ['Feature Requests', 'Service Improvement Suggestions', 'General Feedback']
  };

  // Logic: Modal handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenPreviewModal = () => setIsPreviewModalOpen(true);
  const handleClosePreviewModal = () => setIsPreviewModalOpen(false);

  // Logic: Form handlers
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('');
    setSelectedSubjectSubcategory('');
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    setSelectedSubjectSubcategory('');
  };

  const handleSubjectSubcategoryChange = (e) => {
    setSelectedSubjectSubcategory(e.target.value);
  };

  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value);
    setMediaFile(null);
    setMediaPreviewUrl('');
  };
    const handlePreview = () => {
    handleOpenPreviewModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxFileSize = mediaType === 'Video' ? 3 * 1024 * 1024 : 1 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setFileError(`File size exceeds the limit (${mediaType === 'Video' ? '3MB' : '1MB'})`);
      return;
    }

    setFileError('');
    setMediaFile(file);
    setMediaPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreviewUrl('');
  };

  // Logic: Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectRegex = /^[a-zA-Z0-9 ]{1,30}$/;
    let isValid = true;

    if (!subjectRegex.test(subject)) {
      setSubjectError('Subject must be alphanumeric and up to 30 characters.');
      isValid = false;
    } else {
      setSubjectError('');
    }

    if (body.length > 1024) {
      setBodyError('Body must be up to 1024 characters.');
      isValid = false;
    } else {
      setBodyError('');
    }

    if (isValid) {
      const formData = new FormData();
      formData.append('action', 'create');
      formData.append('username', user.username);
      formData.append('category', selectedCategory);
      formData.append('media', mediaFile);
      formData.append('sub_category', selectedSubcategory);
      formData.append('subject_sub_category', selectedSubjectSubcategory);
      formData.append('subject', subject);
      formData.append('body', body);

      try {
        const response = await supportTickets(formData);
        toast.success('Ticket created successfully');
        fetchTickets();
      } catch (error) {
        toast.error('Error creating ticket. Please try again.');
      }

      handleCloseModal();
    }
  };

  // Logic: Fetch tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await supportTickets({
        action: "read",
        username: user.username,
      });
      if (response.data.status === 1) {
        setTickets(response.data.tickets);
      } else {
        toast.error('Failed to fetch tickets');
      }
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Logic: Helper functions
  const getStatusLabel = (status) => {
    const statusMap = {
      '0': 'Open',
      '1': 'Under Investigation',
      '2': 'Need More Info',
      '3': 'Resolved'
    };
    return statusMap[status] || 'Unknown';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      '0': 'text-red-500',
      '1': 'text-yellow-500',
      '2': 'text-blue-500',
      '3': 'text-green-500'
    };
    return colorMap[status] || 'text-gray-500';
  };

  // Logic: Chat handlers
  const handleOpenChat = (ticketId) => {
    setSelectedTicketId(ticketId);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
  };

  // Start Point: Component render
  return (
    <div className={`${classes.root} bg-gray-100`}>
      <DashboardNavbar user={user} setUser={setUser} />
      <Fade in={true} timeout={500}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 shadow-md mb-5 rounded-xl">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 text-center">
                Support Tickets
              </h1>
              <Button
                className="bg-indigo-600 text-white py-2 px-6 rounded-full cursor-pointer font-bold hover:bg-indigo-700 transition duration-300"
                onClick={handleOpenModal}
                aria-label="Ask a Question"
              >
                Ask a Question →
              </Button>
            </div>
          </div>

          {/* Table */}
          <TableContainer component={Paper} className={`${classes.tableContainer} ${classes.fadeIn}`}>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell className={classes.tableHeadCell}>ID</TableCell>
                  <TableCell className={classes.tableHeadCell}>Category</TableCell>
                  {!isMobile && <TableCell className={classes.tableHeadCell}>Subcategory</TableCell>}
                  <TableCell className={classes.tableHeadCell}>Subject</TableCell>
                  <TableCell className={classes.tableHeadCell}>Status</TableCell>
                  {!isMobile && <TableCell className={classes.tableHeadCell}>Created At</TableCell>}
                  {!isMobile && <TableCell className={classes.tableHeadCell}>Updated At</TableCell>}
                  <TableCell className={classes.tableHeadCell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 5 : 8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id} className={classes.fadeIn}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      {!isMobile && <TableCell>{ticket.sub_category}</TableCell>}
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </TableCell>
                      {!isMobile && <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>}
                      {!isMobile && <TableCell>{new Date(ticket.updated_at).toLocaleString()}</TableCell>}
                      <TableCell>
                        <Button 
                          onClick={() => handleOpenChat(ticket.id)}
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          Chat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 5 : 8} align="center">
                      No tickets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Fade>

    {/* Create Ticket Modal */}
    <Dialog open={isModalOpen} onClose={handleCloseModal} className={classes.dialog} fullScreen={isMobile}>
        <DialogTitle>
          Ask a Question
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit} className={classes.fadeIn}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category
              </label>
              <Select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-300 rounded"
                variant="outlined"
                fullWidth
              >
                <MenuItem value="" disabled>
                  Select a category
                </MenuItem>
                {Object.keys(categories).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </div>
            {selectedCategory && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subcategory">
                  Subcategory
                </label>
                <Select
                  id="subcategory"
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Select a subcategory
                  </MenuItem>
                  {Array.isArray(categories[selectedCategory])
                    ? categories[selectedCategory].map((subcategory) => (
                        <MenuItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </MenuItem>
                      ))
                    : Object.keys(categories[selectedCategory]).map((subcategory) => (
                        <MenuItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </MenuItem>
                      ))}
                </Select>
              </div>
            )}
            {selectedCategory &&
              selectedSubcategory &&
              !Array.isArray(categories[selectedCategory]) &&
              categories[selectedCategory][selectedSubcategory] && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject-subcategory">
                    Subject Subcategory
                  </label>
                  <Select
                    id="subject-subcategory"
                    value={selectedSubjectSubcategory}
                    onChange={handleSubjectSubcategoryChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      Select a subject subcategory
                    </MenuItem>
                    {categories[selectedCategory][selectedSubcategory].map((subjectSubcategory) => (
                      <MenuItem key={subjectSubcategory} value={subjectSubcategory}>
                        {subjectSubcategory}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              )}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                  Subject
                </label>
                <TextField
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                {subjectError && <div className={classes.errorMessage}>{subjectError}</div>}
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="media">
                  Media
                </label>
                <Select
                  id="media"
                  value={mediaType}
                  onChange={handleMediaTypeChange}
                  fullWidth
                  variant="outlined"
                >
                  <MenuItem value="Media">Media</MenuItem>
                  <MenuItem value="Document">Document</MenuItem>
                  <MenuItem value="Video">Video</MenuItem>
                  <MenuItem value="Image">Image</MenuItem>
                </Select>
                {mediaType !== 'Media' && (
                  <div className="flex items-center gap-2 mt-2">
                    <FontAwesomeIcon 
                      icon={mediaType === 'Document' ? faFileAlt : mediaType === 'Video' ? faVideo : faCamera} 
                      className="text-2xl" 
                    />
                    <span>Upload {mediaType}</span>
                    <input 
                      type="file" 
                      accept={mediaType === 'Document' ? '.pdf,.doc,.docx,.txt' : mediaType === 'Video' ? 'video/*' : 'image/*'} 
                      onChange={handleFileChange} 
                    />
                  </div>
                )}
                {fileError && <div className={classes.errorMessage}>{fileError}</div>}
              </div>
            </div>
            {mediaPreviewUrl && (
              <div className="mb-4">
                <Button className="flex items-center text-red-500" onClick={handleRemoveMedia}>
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Remove Media
                </Button>
                {mediaType === 'Video' && (
                  <video controls className={classes.previewVideo}>
                    <source src={mediaPreviewUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {mediaType === 'Image' && <img src={mediaPreviewUrl} alt="Preview" className={classes.previewImage} />}
                {mediaType === 'Document' && (
                  <iframe src={mediaPreviewUrl} className="w-full h-64 mt-2"></iframe>
                )}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
                Body
              </label>
              <TextField
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                placeholder="Enter message body"
              />
              <div className={classes.charCount}>Characters: {body.length}/1024</div>
              {bodyError && <div className={classes.errorMessage}>{bodyError}</div>}
            </div>
          </form>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={handlePreview} color="secondary" variant="contained">
            Preview
          </Button>
          <Button type="submit" onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onClose={handleClosePreviewModal} className={classes.previewDialog}>
        <DialogTitle>
          Preview
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClosePreviewModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className="mb-4">
            <strong>Category:</strong> {selectedCategory}
          </div>
          <div className="mb-4">
            <strong>Subcategory:</strong> {selectedSubcategory}
          </div>
          <div className="mb-4">
            <strong>Subject Subcategory:</strong> {selectedSubjectSubcategory}
          </div>
          <div className="mb-4">
            <strong>Subject:</strong> {subject}
          </div>
          <div className="mb-4">
            <strong>Media Type:</strong> {mediaType}
          </div>
          <div className="mb-4">
            <strong>Body:</strong> {body}
          </div>
          {mediaPreviewUrl && (
            <div className="mb-4">
              {mediaType === 'Video' && (
                <video controls className={classes.previewVideo}>
                  <source src={mediaPreviewUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {mediaType === 'Image' && <img src={mediaPreviewUrl} alt="Preview" className={classes.previewImage} />}
              {mediaType === 'Document' && (
                <iframe src={mediaPreviewUrl} className="w-full h-64 mt-2"></iframe>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={handleClosePreviewModal} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ticket Chat Component */}
      <TicketChat open={chatOpen} onClose={handleCloseChat} ticketId={selectedTicketId} fetchTickets={fetchTickets} />

      <ToastContainer />
    </div>
  );
};

// End Point: DirectSupport Component
export default DirectSupport;