import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Container,
  Box
} from '@material-ui/core';
import {
  Add as AddIcon,
  LibraryBooks as LibraryBooksIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CombinedTemplate from './Manage_Templates.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({

  content: {
    paddingTop: theme.spacing(6),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    marginBottom: theme.spacing(4),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.3s',
    '&:hover': {
      boxShadow: theme.shadows[10],
    },
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9 aspect ratio
  },
  cardContent: {
    flexGrow: 1,
  },
  button: {
    marginTop: theme.spacing(2),
  },
  

}));

const CreateTemplate = ({ user, onBack }) => {
  const classes = useStyles();
  const [showCombinedTemplate, setShowCombinedTemplate] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateNewTemplate = () => {
    setShowCombinedTemplate(true);
    toast.success('Creating a new template', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleBrowseTemplates = () => {
    toast.info('Browsing templates...', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleBack = () => {
    if (showCombinedTemplate) {
      setShowCombinedTemplate(false);
      toast.info('Returning to template selection', {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      onBack();
      toast.info('Returning to previous page', {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

 

  if (showCombinedTemplate) {
    return (
      <Box className={classes.root}>
        <CombinedTemplate
          user={user}
          onBack={() => setShowCombinedTemplate(false)}
        />
      </Box>
    );
  }

  return (
    <>
 
      {/* header */}
      <div className="bg-white p-6  shadow-md mb-5 rounded-xl">
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
            Create Template
          </h1>

          {/* WhatsApp Official Button */}
          <div className="invisible">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back
          </div>
        </div>
      </div>
      {/* header */}
    <Container className="bg-white p-6  shadow-md mb-5 rounded-xl">     
      <Box className={classes.content}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" align="center" className={classes.title}>
            Choose Template
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" className={classes.subtitle}>
            Choose how to create a template
          </Typography>
        </motion.div>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image="/assets/images/png/Create_New_Template.png"
                  title="Blank Template"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Use a blank template
                  </Typography>
                  <Typography>
                    Create your template from scratch. Submit for review when finished.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<AddIcon />}
                    fullWidth
                    onClick={handleCreateNewTemplate}
                  >
                    Create new template
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image="https://via.placeholder.com/300x200.png?text=Template+Library"
                  title="Browse Template"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Browse template library
                  </Typography>
                  <Typography>
                    Use pre-written templates or customize to your needs.
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    startIcon={<LibraryBooksIcon />}
                    fullWidth
                    onClick={handleBrowseTemplates}
                  >
                    Browse templates
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Container>
    </>
    
  );
};

export default CreateTemplate;
