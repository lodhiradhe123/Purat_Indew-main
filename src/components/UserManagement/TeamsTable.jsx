import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TablePagination,
  Box,
  CircularProgress,
  Chip,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as DefaultIcon,
  Group as TeamIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { teamdata } from "../../services/api";
import 'tailwindcss/tailwind.css';

const TeamsTable = ({ user }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await teamdata({
          action: 'read',
          username: user.username,
        });
        if (response.status >= 200 && response.status < 300 && response.data) {
          setTeams(response.data.team);
        } else {
          setError('Failed to fetch teams');
        }
      } catch (error) {
        setError('Error fetching teams');
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getDefaultTeamColor = (isDefault) => {
    return isDefault === 'yes' ? 'success' : 'default';
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </Box>
    );
  }

  return (
    <Paper elevation={3} className="w-full overflow-hidden mt-4 mx-auto max-w-6xl">
      <TableContainer className="bg-white">
        <Table stickyHeader aria-label="teams table">
          <TableHead>
            <TableRow>
              <TableCell className="bg-blue-600 text-white font-semibold">Team Name</TableCell>
              <TableCell className="bg-blue-600 text-white font-semibold">Default Team</TableCell>
              <TableCell className="bg-blue-600 text-white font-semibold">Team Size</TableCell>
              <TableCell className="bg-blue-600 text-white font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {teams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((team) => (
                <motion.tr
                  key={team.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="hover:bg-blue-50"
                >
                  <TableCell className="text-gray-700">
                    <Box className="flex items-center">
                      <TeamIcon className="mr-2 text-blue-500" />
                      {team.team}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<DefaultIcon />}
                      label={team.default === 'yes' ? 'Yes' : 'No'}
                      color={getDefaultTeamColor(team.default)}
                      size="small"
                      className="capitalize"
                    />
                  </TableCell>
                  <TableCell className="text-gray-700">{team.size}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton className="text-blue-500 hover:bg-blue-100">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove">
                      <IconButton className="text-red-500 hover:bg-red-100">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={teams.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="bg-white border-t border-gray-200"
      />
    </Paper>
  );
};

export default TeamsTable;
