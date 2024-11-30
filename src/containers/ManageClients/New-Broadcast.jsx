// import React, { useState } from "react";
// import { clients } from "../../services/api"; // Import your clients API function

// const NewBroadcast = ({ user, closeModal }) => {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         userName: "",
//         mobile: "",
//         email: "",
//         country: "",
//         role: "", // No default selection for role
//         password: "",
//         password_confirmation: "",
//     });

//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const toggleConfirmPasswordVisibility = () => {
//         setShowConfirmPassword(!showConfirmPassword);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (formData.password !== formData.password_confirmation) {
//             alert("Passwords do not match!");
//             return;
//         }

//         // Construct the payload
//         const payload = {
//             action: "create",
//             username: user, // Send the `user` prop as `username`
//             first_name: formData.firstName,
//             last_name: formData.lastName,
//             client_username: formData.userName,
//             client_mobile_no: formData.mobile,
//             client_email: formData.email,
//             country: formData.country,
//             user_type: formData.role,
//             password: formData.password, // Send password
//             password_confirmation: formData.password_confirmation, // Send confirm password
//         };

//         try {
//             const response = await clients(payload);
//             console.log("Client created successfully", response.data);
//             closeModal(); // Close the modal after successful submission
//         } catch (error) {

//         }
//     };

//     return (
//         <div className="overflow-hidden">
//             <h2 className="text-2xl font-bold text-indigo-800 mb-4">New Client</h2>
//             <form onSubmit={handleSubmit}>
//                 <h2 className="text-lg font-bold mb-2">Add User</h2>
//                 <p className="text-gray-600 mb-4">
//                     Password will be sent to the Email ID and Mobile number used while Registration.
//                 </p>

//                 {/* First Name */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
//                         First Name
//                     </label>
//                     <input
//                         type="text"
//                         id="firstName"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleInputChange}
//                         className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                     />
//                 </div>

//                 {/* Last Name */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
//                         Last Name
//                     </label>
//                     <input
//                         type="text"
//                         id="lastName"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleInputChange}
//                         className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                     />
//                 </div>

//                 {/* Authentication Section */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-center font-bold text-2xl mb-2">
//                         Authentication
//                     </label>
//                 </div>

//                 {/* User Name */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2" htmlFor="userName">
//                         User Name
//                     </label>
//                     <input
//                         type="text"
//                         id="userName"
//                         name="userName"
//                         value={formData.userName}
//                         onChange={handleInputChange}
//                         className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                     />
//                 </div>

//                 {/* Mobile */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2" htmlFor="mobile">
//                         Mobile
//                     </label>
//                     <input
//                         type="tel"
//                         id="mobile"
//                         name="mobile"
//                         value={formData.mobile}
//                         onChange={handleInputChange}
//                         className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                     />
//                 </div>

//                 {/* Email */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
//                         E-mail
//                     </label>
//                     <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                     />
//                 </div>

//                 {/* Select Country */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2" htmlFor="country">
//                         Select Country
//                     </label>
//                     <select
//                         id="country"
//                         name="country"
//                         value={formData.country}
//                         onChange={handleInputChange}
//                         className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                     >
//                         <option value="">Select Country</option>
//                         <option value="USA">United States</option>
//                         <option value="India">India</option>
//                         <option value="UK">United Kingdom</option>
//                         {/* Add more country options as needed */}
//                     </select>
//                 </div>

//                 {/* Role Selection */}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
//                         Role
//                     </label>
//                     <select
//                         id="role"
//                         name="role"
//                         value={formData.role}
//                         onChange={handleInputChange}
//                         className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         required
//                     >
//                         <option value="">Select Role</option> {/* No default option */}
//                         <option value="user">User</option>
//                         <option value="reseller">Reseller</option>
//                     </select>
//                 </div>

//             {/* Password and Confirm Password Fields */}
// <div className="grid grid-cols-2 gap-4 mb-4">
//     {/* Password Field */}
//     <div className="relative">
//         <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
//             Password
//         </label>
//         <input
//             type={showPassword ? "text" : "password"}
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//         />
//         <span
//             className="absolute right-3 top-9 cursor-pointer"
//             onClick={togglePasswordVisibility}
//         >
//             {showPassword ? "👁️" : "👁️‍🗨️"}
//         </span>
//     </div>

//     {/* Confirm Password Field */}
//     <div className="relative">
//         <label className="block text-gray-700 font-medium mb-2" htmlFor="password_confirmation">
//             Confirm Password
//         </label>
//         <input
//             type={showConfirmPassword ? "text" : "password"}
//             id="password_confirmation"
//             name="password_confirmation"
//             value={formData.password_confirmation}
//             onChange={handleInputChange}
//             className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             required
//         />
//         <span
//             className="absolute right-3 top-9 cursor-pointer"
//             onClick={toggleConfirmPasswordVisibility}
//         >
//             {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
//         </span>
//     </div>
// </div>

//                 {/* Submit and Close Buttons */}
//                 <div className="flex justify-end">
//                     <button
//                         type="button"
//                         onClick={closeModal}
//                         className="mr-3 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
//                     >
//                         Close
//                     </button>
//                     <button
//                         type="submit"
//                         className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
//                     >
//                         Add
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default NewBroadcast;

import React, { useState } from "react";
import { clients } from "../../services/api"; // Import your clients API function
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import CountryList from "react-select-country-list"; 
import Select from "react-select";

const NewBroadcast = ({ user, closeModal, refetchData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    mobile: "",
    email: "",
    country: "",
    role: "", // No default selection for role
    password: "",
    password_confirmation: "",
  });

  

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false); // Loading state
  const [errors, setErrors] = useState({}); // State to store validation errors


  const countryOptions = CountryList().getData();

  const handleCountryChange = (selectedOption) => {
    setFormData({ ...formData, country: selectedOption.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const togglePasswordVisibility = () => {
  //   setShowPassword(!showPassword);
  // };

  // const toggleConfirmPasswordVisibility = () => {
  //   setShowConfirmPassword(!showConfirmPassword);
  // };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on submission
    setErrors({});

    if (formData.mobile.length !== 10) {
      setErrors({ mobile: "Mobile number must be exactly 10 digits" });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: "Passwords do not match" });
      setLoading(false);
      return;
    }

    const payload = {
      action: "create",
      username: user,
      first_name: formData.firstName,
      last_name: formData.lastName,
      client_username: formData.userName,
      client_mobile_no: formData.mobile,
      client_email: formData.email,
      country: formData.country,
      user_type: formData.role,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    try {
      const response = await clients(payload);

      if (response && response.data) {
        // Manually update the broadcastData state with the new client
        const newClient = {
          id: response.data.id, // Ensure this matches your API response
          username: response.data.client_username,
          email: response.data.client_email,
          userType: response.data.user_type,
          name: `${response.data.first_name} ${response.data.last_name}`,
          mobile: response.data.client_mobile_no,
          createdDate: response.data.created_at, // Ensure this matches your API response
          status: "enabled", // Set default status
          // Add any other fields you need
        };

        refetchData();
        // setBroadcastData((prevData) => [newClient, ...prevData]);

        closeModal();
        toast.success("Client added successfully!");

        // setBroadcastData((prevData) =>  {
        //   return [...prevData, newClient];
        // });

        // Close the modal after successful submission
      } else {
        toast.error("No data returned from the API");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const fieldErrors = error.response.data.message;
        const errorMessages = {};

        // Iterate over each error field and store the first message
        for (const field in fieldErrors) {
          if (fieldErrors.hasOwnProperty(field)) {
            errorMessages[field] = fieldErrors[field][0]; // Access the first error message
          }
        }
        setErrors(errorMessages); // Set the errors object for display
      } else {
        toast.error("An error occurred while creating the client.");
      }
    } finally {
      setLoading(false); // Turn off loading state
    }
  };

  return (
    <div className="overflow-hidden">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">New Client</h2>
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-2">Add User</h2>
        <p className="text-gray-600 mb-4">
          Password will be sent to the Email ID and Mobile number used while
          Registration.
        </p>

        {/* First Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {errors.first_name && (
            <span className="text-red-500 text-sm">{errors.first_name}</span>
          )}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {errors.last_name && (
            <span className="text-red-500 text-sm">{errors.last_name}</span>
          )}
        </div>

        {/* Authentication Section */}
        <div className="mb-4">
          <label className="block text-gray-700 text-center font-bold text-2xl mb-2">
            Authentication
          </label>
        </div>

        {/* User Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="userName"
          >
            User Name
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {errors.client_username && (
            <span className="text-red-500 text-sm">
              {errors.client_username}
            </span>
          )}
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="mobile"
          >
            Mobile
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={(e) => {
              const value = e.target.value;

              // Restrict input to numbers only and limit to 10 digits
              if (/^\d*$/.test(value) && value.length <= 10) {
                setFormData({ ...formData, mobile: value });
              }
            }}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {errors.client_mobile_no && (
            <span className="text-red-500 text-sm">
              {errors.client_mobile_no}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          {errors.client_email && (
            <span className="text-red-500 text-sm">{errors.client_email}</span>
          )}
        </div>

        {/* Select Country */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="country"
          >
            Select Country
          </label>
          <Select
            options={countryOptions}
            value={countryOptions.find(
              (option) => option.value === formData.country
            )}
            onChange={handleCountryChange}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Select Country"
          />
          {errors.country && (
            <span className="text-red-500 text-sm">{errors.country}</span>
          )}
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="role"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Role</option>
            <option value="client">User</option>
            <option value="reseller">Reseller</option>
          </select>
        </div>

        {/* Password and Confirm Password Fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
            <span
              className="absolute right-3 top-9 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <div className="relative">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password_confirmation"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.password_confirmation && (
              <span className="text-red-500 text-sm">
                {errors.password_confirmation}
              </span>
            )}
            <span
              className="absolute right-3 top-9 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
        </div>

        {/* Submit and Close Buttons */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="mr-3 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Close
          </button>
          <button
            type="submit"
            className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBroadcast;
