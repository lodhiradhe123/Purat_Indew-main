// src/components/UserManagement/ToggleButton.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton as MuiToggleButton,
  Fade
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Modal1 from './Modal';
import AddUserForm from './AddUserForm.jsx';

const ToggleButton = ({ active, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Implement search functionality here
  };

  const handleToggleChange = (event, newValue) => {
    if (newValue !== null) {
      onClick(newValue);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        my: 2,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
      </motion.div>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Fade in={true} timeout={1000}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Fade>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={openModal}
          >
            Add User
          </Button>
        </motion.div>
      </Box>

      <Modal1 isOpen={isModalOpen} onClose={closeModal}>
        <AddUserForm onClose={closeModal} />
      </Modal1>
    </Box>
  );
};

ToggleButton.propTypes = {
  active: PropTypes.oneOf(['users', 'teams']).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ToggleButton;
