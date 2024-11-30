// src/components/UnderDevelopment.jsx
// ADD by SHUBHAM: Start Point - Import necessary libraries and components
import React from 'react';
import { Container, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import ConstructionIcon from '@material-ui/icons/Build'; // Using Material-UI icon

// ADD by SHUBHAM: Custom styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    padding: theme.spacing(3),
    '@media (max-width: 768px)': {
      padding: theme.spacing(2),
    },
    '@media (max-width: 480px)': {
      padding: theme.spacing(1),
    },
  },
  icon: {
    fontSize: '6rem',
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const UnderDevelopment = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <ConstructionIcon className={classes.icon} />
      <Typography variant="h4" component="h1" gutterBottom>
        Page Under Development
      </Typography>
      <Typography variant="body1" gutterBottom>
        We're working hard to bring you this page. Stay tuned!
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        className={classes.button}
      >
        Go Back Home
      </Button>
    </Container>
  );
};

export default UnderDevelopment;
// ADD by SHUBHAM: End Point - Under Development Component
