import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Button, TextField, Box, Grid, Typography, TextareaAutosize } from '@mui/material';
import { profile } from '../../../../services/api';
import { toast, ToastContainer } from "react-toastify";

const AdditionalFields = ({ user }) => {
  const [formData, setFormData] = useState({
    username: user?.username,
    instagram: user?.instagram,
    twitter: user?.twitter,
    facebook: user?.facebook,
    status_verification: user?.status_verification,
    greeting_message: user?.greeting_message,
    away_message: user?.away_message,
    quick_replies: user?.quick_replies,
    catalogId: user?.catalogId,
  });

  const [isEditable, setIsEditable] = useState(false);

  // Combine the social media links into one array
  const combinedSocialMediaLinks = [formData.instagram, formData.twitter, formData.facebook].filter(Boolean);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...formData,
      social_media_links: combinedSocialMediaLinks, // Add the combined array here
    }));
  }, [formData, combinedSocialMediaLinks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await profile(formData);
      toast.success("Data updated successfully");
      setIsEditable(false);
    } catch (error) {
      console.log("Error is:", error);
      toast.error('status_verification cannot be null');
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4 mt-5">
      {/* Social Media Links */}
      <Box mb={1}>
        <Typography variant="h6">Social Media Links</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center">
              <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '24px', marginRight: '8px' }} />
              <TextField
                fullWidth
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Instagram"
                disabled={!isEditable}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center">
              <FontAwesomeIcon icon={faTwitter} style={{ fontSize: '24px', marginRight: '8px' }} />
              <TextField
                fullWidth
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="Twitter"
                disabled={!isEditable}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center">
              <FontAwesomeIcon icon={faFacebook} style={{ fontSize: '24px', marginRight: '8px' }} />
              <TextField
                fullWidth
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Facebook"
                disabled={!isEditable}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Other form fields */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Verification Status"
            name="status_verification"
            value={formData.status_verification}
            onChange={handleChange}
            disabled={!isEditable}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Catalog ID"
            name="catalogId"
            value={formData.catalogId}
            onChange={handleChange}
            disabled={!isEditable}
          />
        </Grid>
      </Grid>

      {/* Other fields */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Greeting Message"
            name="greeting_message"
            value={formData.greeting_message}
            onChange={handleChange}
            disabled={!isEditable}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Away Message"
            name="away_message"
            value={formData.away_message}
            onChange={handleChange}
            disabled={!isEditable}
            multiline
            rows={2}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quick Replies"
            name="quick_replies"
            value={formData.quick_replies}
            onChange={handleChange}
            disabled={!isEditable}
            multiline
            rows={2}
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

      <ToastContainer />
    </form>
  );
};

export default AdditionalFields;
