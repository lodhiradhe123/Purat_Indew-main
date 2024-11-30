import { toast } from "react-toastify";

const handleApiError = (error) => {
  if (error.response) {
    const { data } = error.response;
    if (data.errors) {
      for (const key in data.errors) {
        toast.error(`${key}: ${data.errors[key].join(", ")}`);
      }
    } else {
      toast.error(data.message || data.error);
    }
  } else {
    toast.error("Something went wrong. Please try again.");
  }
};

export default handleApiError;
