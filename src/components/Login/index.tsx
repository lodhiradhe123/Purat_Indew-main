import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, requestMobileOtp, verifyMobileOtp } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UAParser from "ua-parser-js";
import axios from "axios";

// Custom input component for reusability
const CustomInput = ({
  type,
  value,
  onChange,
  placeholder,
  disabled,
  required,
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="mt-1 rounded-lg p-2 text-black outline-none text-base font-normal"
    disabled={disabled}
    required={required}
  />
);

const Login = ({ onChangeForm, setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [captcha1, setCaptcha1] = useState(0);
  const [captcha2, setCaptcha2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [loginStep, setLoginStep] = useState("credentials");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [location, setLocation] = useState({ latitude: "", longitude: "" });

  const navigate = useNavigate();

  // Function to generate captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha1(num1);
    setCaptcha2(num2);
    setCaptchaInput("");
    setIsCaptchaValid(false);
  };

  // Fetch IP address, device info, and location on component mount
  useEffect(() => {
    const fetchIpAndDeviceInfo = async () => {
      try {
        const response = await axios.get("https://api64.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address", error);
      }

      const parser = new UAParser();
      const result = parser.getResult();
      setDeviceInfo(result);

      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    generateCaptcha();
    fetchIpAndDeviceInfo();
  }, []);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpTimer === 0 && isOtpSent) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer, isOtpSent]);

  // Toggle password visibility
  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleMobileNumberChange = (e) => setMobileNumber(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);

  // Handle captcha input change and validation
  const handleCaptchaChange = (e) => {
    const value = e.target.value;
    setCaptchaInput(value);
    setIsCaptchaValid(parseInt(value) === captcha1 + captcha2);
  };

  // Function to handle login with credentials
  const handleCredentialsLogin = async () => {
    setIsLoading(true);
    try {
      const response = await login({
        email_or_username: email,
        password,
        ipAddress,
        deviceInfo,
      });
      if (response.data && response.data.token && response.data.user) {
        setUserToken(response.data.token);
        setUserData(response.data.user);
        if (response.data.user.mobileNumber) {
          setMobileNumber(response.data.user.mobileNumber);
        }
        setLoginStep("mobileVerification");
        toast.success(
          "Credentials verified. Please verify your mobile number."
        );
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to request OTP
  const handleRequestOtp = async () => {
    setIsLoading(true);
    try {
      await requestMobileOtp({
        mobileNumber,
        email,
        ipAddress,
        deviceInfo,
        location, // Include location in the request
      });
      setIsOtpSent(true);
      setOtpTimer(30);
      setCanResendOtp(false);
      toast.success("OTP sent to your mobile number.");
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to set data in local storage
  const setDataInLocalStorage = () => {
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const response = await verifyMobileOtp(mobileNumber, otp);
      if (response.data && response.data.status === 1) {
        setDataInLocalStorage();
        handleSuccessfulLogin();
      } else {
        toast.error("OTP verification failed. Please try again.");
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCaptchaValid) {
      toast.error("CAPTCHA INVALID");
      return;
    }

    if (loginStep === "credentials") {
      await handleCredentialsLogin();
    } else if (loginStep === "mobileVerification") {
      if (!isOtpSent || canResendOtp) {
        await handleRequestOtp();
      } else {
        await handleVerifyOtp();
      }
    }
  };

  // Handle successful login
  const handleSuccessfulLogin = () => {
    console.log("Login successful");
    setUser(userData);
    navigate("/dashboard", { replace: true });
  };

  // Handle login error
  const handleLoginError = (error) => {
    console.error("Error logging in", error);
    setErrorMessage(
      error?.response?.data?.message || "An error occurred during login"
    );
    toast.error(error?.response?.data?.message || "Failed to login");
  };

  // Format time for OTP timer
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <form
      className="flex flex-col rounded-2xl bg-[#000000ae] text-[#dbd4d4] px-7 py-6 shadow-2xl text-sm xs:text-base"
      onSubmit={handleSubmit}
    >
      <ToastContainer />
      <h2 className="text-center text-xl sm:text-2xl font-medium">
        Log in to your account
      </h2>
      <h3 className="text-center sm:text-lg font-medium">
        {loginStep === "mobileVerification"
          ? "Verify mobile number"
          : "Welcome back! Please log in with your credentials"}
      </h3>

      {errorMessage && (
        <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
      )}

      {loginStep === "credentials" && (
        <div>
          <label className="mt-4 flex flex-col sm:text-lg font-medium">
            Email / Username :
            <CustomInput
              type="text"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@email.com"
              required
            />
          </label>
          <div className="relative">
            <label className="mt-3 flex flex-col font-medium sm:text-lg">
              Password :
              <CustomInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="********"
                required
              />
              <img
                src="/assets/images/svg/password-eye-icon.svg"
                width={20}
                height={20}
                alt="eye-icon"
                className="absolute right-4 bottom-2.5 cursor-pointer"
                onClick={handleShowPassword}
              />
            </label>
          </div>
          <div className="flex justify-between mt-3">
            <label className="cursor-pointer flex gap-1 items-baseline">
              <input type="checkbox" />
              Remember me
            </label>
            <span
              className="cursor-pointer hover:underline"
              onClick={() => onChangeForm("forgot")}
            >
              Forgot Password?
            </span>
          </div>
        </div>
      )}

      {loginStep === "mobileVerification" && (
        <div>
          <label className="mt-4 flex flex-col font-medium sm:text-lg">
            Verify with Mobile Number OTP :
            <CustomInput
              type="tel"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              placeholder="Enter mobile number"
              disabled={isOtpSent && !canResendOtp}
              required
            />
          </label>
          {isOtpSent && (
            <>
              <label className="mt-4 flex flex-col font-medium sm:text-lg">
                Enter OTP:
                <CustomInput
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter OTP"
                  required
                />
              </label>
              {otpTimer > 0 && (
                <p className="text-center mt-2">
                  OTP expires in: {formatTime(otpTimer)}
                </p>
              )}
              {canResendOtp && (
                <p className="text-center mt-2 text-yellow-500">
                  OTP expired. You can request a new one.
                </p>
              )}
              {canResendOtp && (
                <p
                  className="text-center mt-2 text-blue-500 cursor-pointer"
                  onClick={handleRequestOtp}
                >
                  Resend OTP
                </p>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-4">
        <label className="flex gap-5 justify-center items-center text-lg">
          Captcha :
          <span className="text-xl">
            {captcha1} + {captcha2} =
          </span>
          <input
            type="text"
            className="rounded-md px-2 py-1 border border-gray-300 outline-none text-gray-700 w-24"
            value={captchaInput}
            onChange={handleCaptchaChange}
            required
          />
          <button type="button" onClick={generateCaptcha}>
            <img
              src="/assets/images/png/refresh_captcha.png"
              width={20}
              height={20}
              alt="Refresh captcha"
            />
          </button>
        </label>
      </div>

      <button
        type="submit"
        className="mb-3 mt-5 rounded-3xl bg-[#EB1313] py-2 font-medium text-white"
        disabled={isLoading}
      >
        {isLoading
          ? "Processing..."
          : loginStep === "mobileVerification"
          ? isOtpSent && !canResendOtp
            ? "Verify OTP"
            : "Send OTP"
          : "Login"}
      </button>

      <p className="text-center">
        Don't have an account?{" "}
        <span
          className="font-bold cursor-pointer"
          onClick={() => onChangeForm("signup")}
        >
          Sign up
        </span>
      </p>
    </form>
  );
};

export default Login;
