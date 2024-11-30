import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TextField, MenuItem, Select, InputAdornment, IconButton, Button, Grid } from "@mui/material";
import {profile} from '../../../../services/api'
import { toast, ToastContainer } from "react-toastify";

const Credentials = ({ user }) => {
  const [formData, setFormData] = useState({
    username: user?.username,
    firstname: user?.firstname,
    lastname: user?.lastname,
    language: user?.language || "English",
    mobile_no: user?.mobile_no,
    email: user?.email,
  });

  const [isEditable, setIsEditable] = useState(false);  // Manage editability here in the child component
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  //const[errors, setErrors] = useState()
    
  

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...formData }));
  }, [formData]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    
    
    
      try {
            const payload = { ...formData };
            if (!isPasswordEditable) {
              delete payload.password;
              delete payload.password_confirmation;
            }
          const response = await profile(payload)
          toast.success("Update data Successfully")
          setIsEditable(false);  
          setIsPasswordEditable(false);
      } catch (error) {
        if(error?.response?.data?.message?.password) {
          error?.response?.data?.message?.password.map((one) =>{
            toast.error(one)
          })
        }
        if(error?.response?.data?.message?.email){
          error?.response?.data?.message?.email.map((one)  =>{
            toast.error(one)
          })
        }
    }    
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, mobile_no: phone }));
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  

  return (
    <form onSubmit={handleUpdate}>
      {/* Username (Read-only) */}
      <div className="flex flex-wrap mt-7">
        <div className="w-full sm:w-1/4 flex items-center mb-4">
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            disabled={true}  // Make username read-only
          />
        </div>
      </div>

      {/* First Name and Last Name */}
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/4 flex items-center mb-4 gap-3">
          <TextField
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            disabled={!isEditable}  // Toggle based on isEditable
          />
        </div>
        <div className="w-full sm:w-1/4 flex items-center mb-4 ml-3">
          <TextField
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            disabled={!isEditable}  // Toggle based on isEditable
          />
        </div>
      </div>

      {/* Language Selection */}
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/4 flex items-center mb-4">
          <Select
            name="language"
            value={formData.language}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            disabled={!isEditable}  // Toggle based on isEditable
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Hindi">Hindi</MenuItem>
          </Select>
        </div>
      </div>

      {/* Password and Confirm Password */}
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/3 flex items-center mb-4">
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            type={showPassword ? "text" : "password"}
            disabled={!isPasswordEditable}  // Toggle based on isEditable
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="w-full sm:w-1/3 flex items-center mb-4 ml-5">
          <TextField
            label="Confirm Password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            disabled={!isPasswordEditable}  // Toggle based on isEditable
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowConfirmPassword}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {/* Mobile Number and Email */}
      <div className="flex flex-wrap">
        <div className="w-full sm:w-1/3 flex items-center mb-4">
          <TextField
            label="Mobile Number"
            value={formData.mobile_no}
            onChange={handlePhoneChange}
            fullWidth
            variant="outlined"
            disabled={true}  // Mobile number is read-only
          />
        </div>
        <div className="w-full sm:w-1/3 flex items-center mb-4 ml-5">
          <TextField
            label="Email ID"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            disabled={!isEditable}  // Toggle based on isEditable
          />
        </div>
      </div>

       {/* Buttons */}
       <Grid container spacing={3}>
        <Grid item xs={4}>
          <Button
            variant="contained"
            size="small"
            color={isEditable ? "secondary" : "primary"}
            onClick={() => setIsEditable((prev) => !prev)}
          >
            {isEditable ? "Cancel Edit" : "Edit"}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            size="small"
            color={isPasswordEditable ? "secondary" : "primary"}
            onClick={() => setIsPasswordEditable((prev) => !prev)}
          >
            {isPasswordEditable ? "Cancel Password Edit" : "Edit Password"}
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            size="small"
            color="success"
            type="submit"
            disabled={!isEditable}
          >
            Update
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </form>
  );
};

export default Credentials;
