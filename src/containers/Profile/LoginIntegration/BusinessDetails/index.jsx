import React, { useState, useEffect } from 'react';
import { TextField, Grid, Typography, Button, Box } from '@mui/material';
import {profile} from '../../../../services/api'
import { toast, ToastContainer } from "react-toastify";

const BusinessDetails = ({ user }) => {
  const [formData, setFormData] = useState({
    username: user?.username,
    business_ID: user?.business_ID || '',
    business_hours_of_operation: user?.business_hours_of_operation || '',
    business_address: user?.business_address || '',
  });
  const [isEditable, setIsEditable] = useState(false);
  useEffect(() => {
    
      setFormData((prev) => ({
        ...prev,
        ...formData,
      }));
   
  }, [formData ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 

  const handleUpdate = async (e) => {
    e.preventDefault();
    try{
    const response = await profile(formData)
        
          toast.success("Update data Successfully")
          setIsEditable(false);
          
       
        
      } catch (error) {
        toast.error("Some things went Wrong")
        console.log(error);
        
      }
  };

  return (
    <form onSubmit={handleUpdate}>
      {/* Business Address */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={2}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Address:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Business Address"
            name="business_address"
            value={formData.business_address}
            onChange={handleChange}
            fullWidth
            disabled={!isEditable}
            variant="outlined"
            placeholder="Enter business address"
          />
        </Grid>
      </Grid>

      {/* Hours of Operation */}
      <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={2}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Hours of Operation:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Hours of Operation"
            name="business_hours_of_operation"
            value={formData.business_hours_of_operation}
            onChange={handleChange}
            fullWidth
            disabled={!isEditable}
            variant="outlined"
            placeholder="Enter hours of operation"
          />
        </Grid>
      </Grid>

      {/* Business ID (Optional) */}
      <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={2}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Business ID (Optional):
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Business ID"
            name="business_ID"
            value={formData.business_ID}
            onChange={handleChange}
            fullWidth
            disabled={!isEditable}
            variant="outlined"
            placeholder="Enter business ID"
          />
        </Grid>
      </Grid>

      {/* Edit and Update Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
            variant="contained"
            size="small"
            color={isEditable ? "secondary" : "primary"}
            onClick={() => setIsEditable((prev) => !prev)}
          >
            {isEditable ? "Cancel Edit" : "Edit"}
          </Button>
          <Button
            variant="contained"
            size="small"
            color="success"
            type="submit"
            disabled={!isEditable}
          >
            Update
          </Button>
        </Box>
      < ToastContainer />
    </form>
  );
};

export default BusinessDetails;
