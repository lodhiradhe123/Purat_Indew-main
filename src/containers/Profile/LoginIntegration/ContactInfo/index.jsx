import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import { TextField, Grid, Button, Box } from '@mui/material';
import {profile} from '../../../../services/api'
import { toast, ToastContainer } from "react-toastify";

const ContactInfo = ({ user }) => {
  const [formData, setFormData] = useState({
    username: user?.username,
    phone_number: user?.phone_number,
    business_email_address: user?.business_email_address,
    business_website: user?.business_website,
  });
  const [isEditable, setIsEditable] = useState(false);
  useEffect(() => {
    
      setFormData((prev) => ({
        ...prev,
        ...formData,
      }));
    } 
 , [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone_number: value }));
  };

 

  const handleUpdate = async (e) => {
    e.preventDefault();
    try{
    const response = await profile(formData)
       
          toast.success("Update data Successfully")
          setIsEditable(false);    
        
        
      } catch (error) {
        if(error?.response?.data?.message?.number) {
          error?.response?.data?.message?.number.map((one) =>{
            toast.error(one)
          })
        }
        if(error?.response?.data?.message?.email) {
          error?.response?.data?.message?.email.map((one) =>{
            toast.error(one)
          })
        }
        if(error?.response?.data?.message?.website) {
          error?.response?.data?.message?.website.map((one) =>{
            toast.error(one)
          })
        }
        console.log(error);
        
      }
  };

  return (
    <form onSubmit={handleUpdate}>
      {/* Phone Number */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={9}>
          <PhoneInput
            country={'in'}
            enableSearch={true}
            placeholder="Enter your phone number"
            value={formData.phone_number}
            onChange={handlePhoneChange}
            disabled={!isEditable}
          />
        </Grid>
      </Grid>

      {/* Email Address */}
      <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Email Address"
            name="business_email_address"
            value={formData.business_email_address}
            onChange={handleChange}
            fullWidth
            disabled={!isEditable}
            variant="outlined"
            placeholder="Enter your email address"
          />
        </Grid>
      </Grid>

      {/* Website */}
      <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Website"
            name="business_website"
            value={formData.business_website}
            onChange={handleChange}
            fullWidth
            disabled={!isEditable}
            variant="outlined"
            placeholder="Enter your website URL"
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

export default ContactInfo;
