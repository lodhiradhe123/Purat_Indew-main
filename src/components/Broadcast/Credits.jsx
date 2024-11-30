import { useState, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import { toast } from "react-toastify"; // Assuming you are using toast for notifications
import { fetchCredits } from "../../services/api"; // Ensure this API function exists

const IncomeCard = ({ title, user }) => {
  const [whatsappCredits, setWhatsAppCredits] = useState(0);
  const [voiceCredits, setVoiceCredits] = useState(0);
  const [smsCredits, setSmsCredits] = useState(0);

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch credits from API
  useEffect(() => {
    const fetchCreditsData = async () => {
      try {
        const response = await fetchCredits({
          action: "read",
          username: user?.username,
        });

        const data = response?.data;

        if (data?.status === 1) {
          const creditInfo = data?.data[0];
          setWhatsAppCredits(creditInfo?.whatsapp_credits || 0);
          setVoiceCredits(creditInfo?.voice_credits || 0);
          setSmsCredits(creditInfo?.sms_credits || 0);
        } else {
          setError("Failed to load credits data.");
          toast.error("Failed to load credits data.");
        }
      } catch (err) {
        console.error("Failed to fetch credits data:", err);
        setError("Failed to fetch credits. Please try again.");
        toast.error("Failed to fetch credits. Please try again.");
      } finally {
        setLoading(false); // Ensure loading is set to false after API call
      }
    };

    if (user?.username) {
      fetchCreditsData();
    }
  }, [user]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const creditAmount =
    title === "WhatsApp Credits"
      ? whatsappCredits
      : title === "Voice Credits"
      ? voiceCredits
      : title === "SMS Credits"
      ? smsCredits
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-md flex items-center p-4 w-72">
      {/* Circular Icon */}
      <div className="flex justify-center items-center bg-teal-800 text-white rounded-full h-10 w-10">
        <FaArrowDown className="text-lg" />
      </div>

      {/* Text Content */}
      <div className="ml-4">
        {/* Label */}
        <div className="text-gray-500 flex items-center">
          {title} {/* Dynamic title */}
          <span className="ml-1 text-gray-400 text-xs">
            <i className="fas fa-info-circle"></i> {/* Optional info icon */}
          </span>
        </div>

        {/* Conditionally show WhatsApp or Voice Credits */}
        <p className="text-2xl font-semibold text-gray-900">
          {creditAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default IncomeCard;
