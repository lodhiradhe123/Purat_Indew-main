import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Snackbar } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import {
  teamdata
} from "../../services/api";

const AddTeamForm = ({ onClose ,user }) => {
  const { handleSubmit, control, formState: { errors } } = useForm();
  const [notification, setNotification] = useState(null);

  const onSubmit = async (data) => {
    try {
      // Make the API call using Axios
      const response = await teamdata({
        action: 'create',
        username: user.username, // Replace with dynamic username if needed
        team: data.teamName,
      });

      // Assuming the response data structure is as you mentioned
      if (response.status === 200) {
        const successMessage = response?.data?.message || 'Team created successfully!';

        // Show success notification
        setNotification({
          message: successMessage,
          severity: 'success',
        });

        // Close the form after a short delay
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // If there is an error response from the API
        setNotification({
          message: response?.data?.message || 'Error creating team. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding team:', error);

      // Handle error
      let errorMessage = 'Error adding team. Please try again.';
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      }

      // Show error notification
      setNotification({
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Add New Team
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mb: 2 }}>
          <Controller
            name="teamName"
            control={control}
            defaultValue=""
            rules={{ required: 'Team name is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Team Name"
                fullWidth
                variant="outlined"
                error={!!errors.teamName}
                helperText={errors.teamName?.message}
              />
            )}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
            )}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Add Team
          </Button>
        </Box>
      </form>
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        action={
          <Button color="inherit" onClick={handleNotificationClose}>
            Close
          </Button>
        }
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification?.severity || 'info'}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddTeamForm;
