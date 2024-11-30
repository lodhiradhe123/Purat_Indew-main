import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  Box,
  Tooltip,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";
import { motion } from "framer-motion";
import { agentsdata, teamdata } from "../../services/api"; // Assuming these are your API services

const AddUserForm = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    assignUser: "",
    agentEmail: "",
    agentMobile: "",
    password: "",
    confirmPassword: "",
    team: [], // Team field is now an array to handle multiple selections
  });

  const [teams, setTeams] = useState([]); // Store teams from API
  const [errors, setErrors] = useState({});

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await teamdata({
          action: "read",
          username: user.username, // Adjust this based on your API
        });
        if (response.status >= 200 && response.status < 300 && response.data) {
          setTeams(response.data.team); // Assuming response.data.team is an array of teams
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle multi-select change
  const handleTeamChange = (e) => {
    const selectedTeams = e.target.value; // An array of selected team IDs
    setFormData({ ...formData, team: selectedTeams });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, password: ["Passwords do not match"] });
      return;
    }

    if (!user || !user.username) {
      console.error("User is undefined or missing a username.");
      return;
    }

    try {
      const response = await agentsdata({
        action: "create",
        username: user.username, // Use the user prop here
        first_name: formData.firstName,
        last_name: formData.lastName,
        agent_email: formData.agentEmail,
        agent_mobile: formData.agentMobile,
        is_email_verified: "0", // Ensure boolean
        is_mobile_verified: "0", // Ensure boolean
        assign_user: formData.assignUser,
        team: formData.team, // Send array of team IDs to backend
        password: formData.password,
      });

      console.log("API Response:", response);
      onClose(); // Close modal on success
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Submission error:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* First Name and Last Name fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              error={!!errors.first_name}
              helperText={errors.first_name ? errors.first_name[0] : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              error={!!errors.last_name}
              helperText={errors.last_name ? errors.last_name[0] : ""}
            />
          </Grid>

          {/* Assign User field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Assign User"
              name="assignUser"
              value={formData.assignUser}
              onChange={handleInputChange}
              required
              error={!!errors.assign_user}
              helperText={errors.assign_user ? errors.assign_user[0] : ""}
            />
          </Grid>

          {/* Agent Email and Agent Mobile fields */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Agent Email"
              name="agentEmail"
              value={formData.agentEmail}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Agent Mobile"
              name="agentMobile"
              value={formData.agentMobile}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              error={!!errors.password}
              helperText={errors.password ? errors.password[0] : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              error={!!errors.password}
              helperText={errors.password ? errors.password[0] : ""}
            />
          </Grid>

          {/* Multi-select Team dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.team}>
              <InputLabel>Team</InputLabel>
              <Select
                multiple
                value={formData.team} // This holds the selected team IDs (array)
                onChange={handleTeamChange}
                renderValue={(selected) =>
                  selected
                    .map((id) => {
                      const team = teams.find((t) => t.id === id);
                      return team ? team.team : id;
                    })
                    .join(", ")
                } // Display team names in the dropdown
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.team} {/* Display team name */}
                  </MenuItem>
                ))}
              </Select>
              {errors.team && (
                <Typography color="error">{errors.team[0]}</Typography>
              )}
            </FormControl>
          </Grid>

          {/* Submit button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Tooltip title="Submit form">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </form>
    </motion.div>
  );
};

export default AddUserForm;
