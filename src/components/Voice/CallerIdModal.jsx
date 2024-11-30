import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Box, Button, TextField, Typography } from "@mui/material";

import { PlusIcon, XIcon } from "@heroicons/react/solid";
import { voiceCallerId } from "../../services/api";

const CallerIdModal = ({ closeModal, handleSubmit, user }) => {
  const [state, setState] = useState({
    phoneNumber: "",
    otp: "",
    isOtpStage: false,
    isSubmitting: false,
    timer: 60,
  });

  const { phoneNumber, otp, isOtpStage, isSubmitting, timer } = state;

  const updateState = (key, value) => {
    setState((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleAddCallerId = async (e) => {
    e.preventDefault();
    updateState("isSubmitting", true);

    const payload = {
      action: "create",
      username: user,
      caller_id: phoneNumber,
    };

    try {
      const response = await voiceCallerId(payload);

      if (response?.data?.status) {
        toast.success(
          "Caller ID added. Please enter the OTP sent to your number."
        );
        updateState("isOtpStage", true);
        updateState("timer", 60);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          for (const key in data.errors) {
            toast.error(`${key}: ${data.errors[key].join(", ")}`);
          }
        } else {
          toast.error(data.message || "An error occurred.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      updateState("isSubmitting", false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    updateState("isSubmitting", true);

    const payload = {
      action: "verify",
      username: user,
      caller_id: phoneNumber,
      otp,
    };

    try {
      const response = await voiceCallerId(payload);

      console.log("otp", response);

      toast.success("OTP verified successfully!");
      handleSubmit(phoneNumber); // Pass the verified number back
      closeModal();
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) {
          for (const key in data.errors) {
            toast.error(`${key}: ${data.errors[key].join(", ")}`);
          }
        } else {
          toast.error(data.message || "An error occurred.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      updateState("isSubmitting", false);
    }
  };

  useEffect(() => {
    let countdown;
    if (isOtpStage && timer > 0) {
      countdown = setInterval(() => {
        updateState("timer", timer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown); // Cleanup on unmount
  }, [timer, isOtpStage]);

  return (
    <Box>
      <Typography
        variant="h6"
        color="primary"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <PlusIcon className="w-6 h-6" />
        Add Caller ID
      </Typography>

      {!isOtpStage ? (
        <form onSubmit={handleAddCallerId}>
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => updateState("phoneNumber", e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={isOtpStage}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              onClick={closeModal}
              variant="outlined"
              startIcon={<XIcon style={{ width: 20, height: 20 }} />}
              sx={{ mr: 2 }}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </Button>
          </Box>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => updateState("otp", e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <Typography
            variant="body2"
            color="textSecondary"
            textAlign="center"
            sx={{
              color: timer > 0 ? "red" : "green",
              fontWeight: timer > 0 ? 500 : 600,
            }}
          >
            {timer > 0
              ? `OTP expires in ${timer < 10 ? `0${timer}` : timer} sec`
              : "You can click on Resend OTP"}
          </Typography>

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              onClick={handleAddCallerId}
              disabled={timer > 0 || isSubmitting}
            >
              {isSubmitting ? "Resending..." : "Resend OTP"}
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default CallerIdModal;
