import React, { useState, useEffect } from "react";
import { TextField, Grid, MenuItem, Select, InputLabel, FormControl, Button, Box, Typography } from "@mui/material";
import FileInputWithPreview from "../../../../components/FileInput/FileInputWithPreview";
import {profile} from '../../../../services/api'
import { toast, ToastContainer } from "react-toastify";

const BasicInfo = ({ user }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    business_name: user?.business_name,
    business_industry: user?.business_industry || '',
    gst_or_taxId: user?.gst_or_taxId,
    gst_or_incorporationCertificate: null,
    company_PAN_card: null,
    about: user?.about,
    profile_picture: null,
    description: user?.description,
  });
  const [isEditable, setIsEditable] = useState(false);

  // Sync formData with the parent state
  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...formData }));
  }, [formData,]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file, // Store the file object
      }));
    }
  };
  

  const removeImage = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null, // Clear the specific field
    }));
  };


 

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append files if they exist
    if (formData.profile_picture) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }
    if (formData.gst_or_incorporationCertificate) {
      formDataToSend.append(
        "gst_or_incorporationCertificate",
        formData.gst_or_incorporationCertificate
      );
    }
    if (formData.company_PAN_card) {
      formDataToSend.append("company_PAN_card", formData.company_PAN_card);
    }
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
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "900px",height: "150px" }}>
        {/* Profile Picture */}
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <Typography variant="h6" gutterBottom>
          Profile Picture 
        </Typography>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "profile_picture")}
          style={{ display: "block", marginBottom: "1rem" }}
          disabled={!isEditable}
        />
        {formData.profile_picture && (
          <div style={{ textAlign: "center" }}>
            <img
              src={URL.createObjectURL(formData.profile_picture)} // Dynamically generate preview
              alt="Profile Preview"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            <div style={{ marginTop: "1rem" }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => removeImage("profile_picture")}
              >
                Remove Image
              </Button>
            </div>
          </div>
        )}
      </Grid>

          {/* Business Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Business Name"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              fullWidth
              disabled={!isEditable}
              variant="outlined"
            />
          </Grid>

          {/* Business Industry */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth  variant="outlined">
              <InputLabel>Business Industry</InputLabel>
              <Select
                name="business_industry"
                value={formData.business_industry}
                onChange={handleChange}
                disabled={!isEditable}
                label="Business Industry"
              > <MenuItem value="">Select Industry</MenuItem>
                <MenuItem value="Industry_1">Industry 1</MenuItem>
                <MenuItem value="Industry_2">Industry 2</MenuItem>
                <MenuItem value="Industry_3">Industry 3</MenuItem>
                <MenuItem value="Industry_4">Industry 4</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* GST or TAX ID */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="GST or TAX ID"
              name="gst_or_taxId"
              value={formData.gst_or_taxId}
              onChange={handleChange}
              fullWidth
              disabled={!isEditable}
              variant="outlined"
            />
          </Grid>

          {/* GST or Incorporation Certificate Upload */}
         
          <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                GST or Incorporation Certificate
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "gst_or_incorporationCertificate")}
                style={{ display: "block", marginBottom: "1rem" }}
                disabled={!isEditable}
              />
              {formData.gst_or_incorporationCertificate && (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={URL.createObjectURL(formData.gst_or_incorporationCertificate)}
                    alt="GST/Incorporation Certificate Preview"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                  <div style={{ marginTop: "1rem" }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeImage("gst_or_incorporationCertificate")}
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              )}
      </Grid>
            
          

          {/* Company PAN Card Upload */}
          <Grid item xs={12} sm={6}>
        <Typography variant="h6" gutterBottom>
          Company PAN Card
        </Typography>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "company_PAN_card")}
          style={{ display: "block", marginBottom: "1rem" }}
          disabled={!isEditable}
        />
        {formData.company_PAN_card && (
          <div style={{ textAlign: "center" }}>
            <img
              src={URL.createObjectURL(formData.company_PAN_card)}
              alt="Company PAN Preview"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
            <div style={{ marginTop: "1rem" }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => removeImage("company_PAN_card")}
              >
                Remove Image
              </Button>
            </div>
          </div>
        )}
      </Grid>

          {/* About */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="About"
              name="about"
              value={formData.about}
              onChange={handleChange}
              fullWidth
              disabled={!isEditable}
              variant="outlined"
              inputProps={{ maxLength: 60 }}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              disabled={!isEditable}
              variant="outlined"
              multiline
              rows={4}
              inputProps={{ maxLength: 500 }}
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
      </Box>
      <ToastContainer />
    </form>
  );
};

export default BasicInfo;
