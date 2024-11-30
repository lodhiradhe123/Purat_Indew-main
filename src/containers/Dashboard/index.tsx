// import React, { useCallback, useMemo, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout} from "../../services/api";
// import { useUser } from '../../components/ManageClientss/UserContext.jsx';
// import { toast } from "react-toastify";
// import Navbar from "../../components/Navbar/DashboardNavbar.jsx";
// import Footer from "../../components/Footer/Footer";
// import { motion } from "framer-motion";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import Overviews from "../../components/ManageClientsOverview/Overviews.jsx";
// import ClientsBoard from "../../components/ManageClientss/ClientsBoard.jsx";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCopy,
//   faBell,
//   faChartLine,
//   faLightbulb,
//   faEnvelope,
//   faSms,
//   faPhone,
//   faBroadcastTower,
//   faHashtag,
// } from "@fortawesome/free-solid-svg-icons";
// import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
// import CreditCard from "./CreditCard";
// import MailIcon from "/assets/images/svg/mail.svg";
// import VoiceIcon from "/assets/images/svg/voice-recognition.svg";
// import WhatsAppIcon from "/assets/images/svg/whatsapp.svg";
// import RCSIcon from "/assets/images/svg/rcs.svg";
// import NumbersIcon from "/assets/images/svg/four.svg";
// import TelegramIcon from "/assets/images/svg/telegram.svg";
// import InstagramIcon from "/assets/images/svg/instagram.svg";
// import ManageClients from "/assets/images/svg/manage-clients.svg";
// import Invoice from "/assets/images/png/invoice.png";
// import { fetchCredits } from "../../services/api";

// const DashboardItem = React.memo(({ icon, title, onClick }) => (
//   <motion.div
//     whileHover={{ scale: 1.05, boxShadow: "0px px 8px rgba(0,0,0,0.2)" }}
//     whileTap={{ scale: 0.95 }}
//     className="flex items-center p-8 bg-white rounded-2xl shadow-lg cursor-pointer transition-colors duration-300 hover:bg-blue-100"
//     onClick={onClick}
//     role="button"
//     aria-label={title}
//   >
//     <img src={icon} alt={`${title} Icon`} className="w-10 h-10 mr-4" />
//     <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
//   </motion.div>
// ));

// const Card = ({ title, content, icon }) => (
//   <motion.div
//     whileHover={{ scale: 1.05 }}
//     className="bg-white p-6 rounded-lg shadow-lg"
//   >
//     <div className="flex items-center mb-4">
//       <FontAwesomeIcon icon={icon} className="text-2xl text-blue-500 mr-3" />
//       <h3 className="text-xl font-semibold">{title}</h3>
//     </div>
//     <p className="text-gray-600">{content}</p>
//   </motion.div>
// );

// const Dashboard = () => {
//   const [user, setUser] = useState(null);

//   const [broadcastData, setBroadcastData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const navigate = useNavigate();
//   const [copied, setCopied] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [isImpersonating, setIsImpersonating] = useState(false); // Move state inside component
//   const [creditsData, setCreditsData] = useState({
//     email_credits: 0,
//     sms_credits: 0,
//     voice_credits: 0,
//     whatsapp_credits: 0,
//     rcs_credits: 0,
//     numbers_credits: 0,
//   });

//   // Check if impersonation is active
//   useEffect(() => {
//     const adminToken = localStorage.getItem("adminToken");
//     if (adminToken) {
//       setIsImpersonating(true); // User is impersonating
//     }
//   }, []);

//   // Fetch notifications and credits data
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         setTimeout(() => {
//           setNotifications([
//             { id: 1, message: "New feature available!" },
//             { id: 2, message: "Your subscription will expire soon." },
//           ]);
//         }, 1000);
//       } catch (error) {
//         console.error("Failed to fetch notifications:", error);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   useEffect(() => {
//     const fetchCreditsData = async () => {
//       try {
//         const response = await fetchCredits({
//           action: "read",
//           username: user?.username,
//         });

//         const data = await response?.data;

//         if (data.status === 1) {
//           const creditInfo = data.data[0];
//           setCreditsData({
//             email_credits: creditInfo.email_credits,
//             sms_credits: creditInfo.sms_credits,
//             voice_credits: creditInfo.voice_credits,
//             whatsapp_credits: creditInfo.whatsapp_credits,
//             rcs_credits: creditInfo.rcs_credits,
//             numbers_credits: creditInfo.numbers_credits,
//           });
//         } else {
//           toast.error("Failed to load credits data.");
//         }
//       } catch (error) {
//         console.error("Failed to fetch credits data:", error);
//         toast.error("Failed to fetch credits. Please try again.");
//       }
//     };

//     if (user?.username) {
//       fetchCreditsData();
//     }
//   }, [user]);

//   // End Impersonation Function
//   // const handleEndImpersonation = () => {
//   //   const adminToken = localStorage.getItem("adminToken");

//   //   if (adminToken) {
//   //     // Restore the original admin token
//   //     localStorage.setItem("authToken", adminToken);
//   //     localStorage.removeItem("adminToken"); // Remove the impersonation token

//   //     // setIsImpersonating(false); // Set impersonation flag to false
//   //     // setUser({ ...user, isImpersonating: false }); // Update user state

//   //     // // Redirect back to admin dashboard or relevant page
//   //     // toast.success("Impersonation ended. You're now back as admin.");
//   //     // navigate("/dashboard/manageclients"); // Redirect to admin dashboard or desired location

//   //     const response = await credits(); // Define this API call
//   //   if (response.status === 200) {
//   //     setUser(response.data.user);
//   //   }
//   //   }
//   // };



//   const handleEndImpersonation = async () => {
//     const adminToken = localStorage.getItem("adminToken");
  
//     if (adminToken) {
//       // Restore the original admin token
//       localStorage.setItem("authToken", adminToken);
//       localStorage.removeItem("adminToken"); // Remove the impersonation token
  
//       try {
//         // Call the credits API to fetch the original user's data
//         const response = await credits(); // Ensure this is the correct API call to fetch user data
  
//         if (response.status === 200) {
//           setUser(response.data.user); // Update the user state with the original user's details
//           toast.success("Impersonation ended. You're now back as admin.");
//           navigate("/dashboard/manageclients"); // Redirect to the admin dashboard or desired location
//         } else {
//           toast.error("Failed to fetch original user details.");
//         }
//       } catch (error) {
//         console.error("Error fetching original user details:", error);
//         toast.error("Error occurred while fetching user details.");
//       }
//     }
//   };
  

//   const handleWhatsAppClick = useCallback(() => {
//     navigate("/dashboard/whatsapp/broadcast");
//   }, [navigate]);

//   const handleVoiceClick = useCallback(() => {
//     navigate("/dashboard/voice/broadcast");
//   }, [navigate]);

//   const handleSmsClick = useCallback(() => {
//     navigate("/dashboard/sms");
//   }, [navigate]);

//   const handleBulkWhatsAppClick = useCallback(() => {
//     navigate("/dashboard/bulkwhatsapp/broadcast");
//   }, [navigate]);

//   const handlefilemanagerClick = useCallback(() => {
//     navigate("/dashboard/file-hosting");
//   }, [navigate]);

//   const handlemanageClientClick = useCallback(() => {
//     navigate("/dashboard/manageclients");
//   }, [navigate]);

//   const handleInvoiceClick = useCallback(() => {
//     navigate("/dashboard/invoice");
//   }, [navigate]);

//   const urlshortnerClick = useCallback(() => {
//     navigate("/dashboard/URLShortener");
//   }, [navigate]);

//   const handleLogout = useCallback(async () => {
//     try {
//       await logout();
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setUser(null);
//       navigate("/");
//       toast.success("Logged out successfully");
//     } catch (error) {
//       console.error("Failed to logout:", error);
//       toast.error("Failed to logout. Please try again.");
//     }
//   }, [navigate, setUser]);

//   const handleCopyApiUrl = () => {
//     navigator.clipboard
//       .writeText("https://api.example.com/v1")
//       .then(() => {
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       })
//       .catch((error) => {
//         console.error("Failed to copy API URL:", error);
//         toast.error("Failed to copy. Please try again.");
//       });
//   };

//   const credits = useMemo(
//     () => [
//       {
//         title: "Email Credits",
//         value: creditsData.email_credits,
//         icon: faEnvelope,
//       },
//       { title: "SMS Credits", value: creditsData.sms_credits, icon: faSms },
//       {
//         title: "Voice Credits",
//         value: creditsData.voice_credits,
//         icon: faPhone,
//       },
//       {
//         title: "WhatsApp Credits",
//         value: creditsData.whatsapp_credits,
//         icon: faWhatsapp,
//       },
//       {
//         title: "RCS Credits",
//         value: creditsData.rcs_credits,
//         icon: faBroadcastTower,
//       },
//       {
//         title: "Numbers Credits",
//         value: creditsData.numbers_credits,
//         icon: faHashtag,
//       },
//       { title: "Push Notifications Credits", value: 300, icon: faBell },
//     ],
//     [creditsData]
//   );

//   const channels = useMemo(
//     () => [
//       { icon: MailIcon, title: "GSM SMS", onClick: handleSmsClick },
//       { icon: VoiceIcon, title: "Voice", onClick: handleVoiceClick },
//       {
//         icon: WhatsAppIcon,
//         title: "Official WhatsApp",
//         onClick: handleWhatsAppClick,
//       },
//       {
//         icon: WhatsAppIcon,
//         title: "Bulk WhatsApp",
//         onClick: handleBulkWhatsAppClick,
//       },
//       { icon: RCSIcon, title: "RCS" },
//       { icon: NumbersIcon, title: "Numbers" },
//       { icon: TelegramIcon, title: "Telegram" },
//       { icon: InstagramIcon, title: "Instagram" },
//     ],
//     [handleWhatsAppClick]
//   );

//   const utilities = useMemo(
//     () => [
//       { icon: "/assets/images/svg/learning.svg", title: "Knowledgebase" },
//       {
//         icon: "/assets/images/svg/search-engine.svg",
//         title: "URL Shortener",
//         onClick: urlshortnerClick,
//       },
//       {
//         icon: "/assets/images/svg/file-storage.svg",
//         title: "File Hosting",
//         onClick: handlefilemanagerClick,
//       },
//       { icon: "/assets/images/svg/statistics.svg", title: "Reports" },
//       {
//         icon: ManageClients,
//         title: "ManageClients",
//         onClick: handlemanageClientClick,
//       },
//       {
//         icon: Invoice,
//         title: "Invoice",
//         onClick: handleInvoiceClick,
//       },
//     ],
//     []
//   );

//   const plugins = useMemo(
//     () => [
//       { icon: "/assets/images/svg/logosshopify.svg", title: "Shopify" },
//       { icon: "/assets/images/svg/googlesheet.svg", title: "Google Sheets" },
//     ],
//     []
//   );

//   return (
//     <div className="font-sans antialiased bg-white min-h-screen">
//       <Navbar user={user} setUser={setUser} />
 
      
//       {isImpersonating && (
//         <div
//           className="impersonation-banner"
//           style={{
//             padding: "10px",
//             backgroundColor: "#ffcc00",
//             marginBottom: "20px",
//           }}
//         >
//           <strong>⚠️ You are currently impersonating another user!</strong>
//           <button
//             onClick={handleEndImpersonation}
//             style={{
//               padding: "8px 15px",
//               backgroundColor: "#ff4444",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               marginLeft: "15px",
//               cursor: "pointer",
//             }}
//           >
//             End Impersonation
//           </button>
//         </div>
//       )}

//       <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white p-6 rounded-lg shadow-lg mb-8 flex justify-between items-center"
//         >
//           <div>
//             <h1 className="text-3xl font-semibold text-gray-800 mb-4">
//               Welcome back,{" "}
//               <span className="text-blue-600">{user?.username}</span>
//             </h1>
//             <div className="grid gap-8 md:grid-cols-3">
//               <div className="p-4 bg-white rounded-lg shadow-lg">
//                 <h4 className="text-lg font-semibold">Manage API Keys</h4>
//                 <p>Securely manage and rotate your API keys</p>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center justify-between">
//                   <span className="text-lg font-semibold text-blue-800">
//                     API Base URL:
//                   </span>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleCopyApiUrl}
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
//                     aria-label="Copy API Base URL"
//                   >
//                     {copied ? "Copied!" : "Copy"}
//                   </motion.button>
//                 </div>
//                 <p className="mt-2 text-blue-700">https://api.example.com/v1</p>
//               </div>
//               <div className="mx-8">
//                 <Carousel
//                   autoPlay
//                   infiniteLoop
//                   showStatus={false}
//                   showIndicators={false}
//                   showThumbs={false}
//                   interval={5000}
//                   stopOnHover
//                   dynamicHeight
//                 >
//                   {credits.map((credit, index) => (
//                     <CreditCard
//                       key={index} // Use index for now, unless credits have unique ids
//                       title={credit.title}
//                       value={credit.value}
//                       icon={credit.icon}
//                       user={user}
//                       setUser={setUser}
//                     />
//                   ))}
//                 </Carousel>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Channels Section */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <h3 className="text-2xl font-semibold mb-4 text-gray-800">
//             Channels
//           </h3>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//             {channels.map((channel, index) => (
//               <DashboardItem key={index} {...channel} />
//             ))}
//           </div>
//         </motion.section>

//         {/* Utilities Section */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="mt-8"
//         >
//           <h3 className="text-2xl font-semibold mb-4 text-gray-800">
//             Utilities
//           </h3>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//             {utilities.map((utility, index) => (
//               <DashboardItem key={index} {...utility} />
//             ))}
//           </div>
//         </motion.section>

//         {/* Plugins & Integrations Section */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//           className="mt-8 mb-8"
//         >
//           <h3 className="text-2xl font-semibold mb-4 text-gray-800">
//             Plugins & Integrations
//           </h3>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//             {plugins.map((plugin, index) => (
//               <DashboardItem key={index} {...plugin} />
//             ))}
//           </div>
//         </motion.section>
//       </div>

//       <Footer />
      
     
//     </div>
//   );
// };

// export default React.memo(Dashboard);





















import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/api";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/DashboardNavbar.jsx";
import Footer from "../../components/Footer/Footer";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faBell,
  faChartLine,
  faLightbulb,
  faEnvelope,
  faSms,
  faPhone,
  faBroadcastTower,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import CreditCard from "./CreditCard";
import MailIcon from "/assets/images/svg/mail.svg";
import VoiceIcon from "/assets/images/svg/voice-recognition.svg";
import WhatsAppIcon from "/assets/images/svg/whatsapp.svg";
import RCSIcon from "/assets/images/svg/rcs.svg";
import NumbersIcon from "/assets/images/svg/four.svg";
import TelegramIcon from "/assets/images/svg/telegram.svg";
import InstagramIcon from "/assets/images/svg/instagram.svg";
import ManageClients from "/assets/images/svg/manage-clients.svg";
import Invoice from "/assets/images/png/invoice.png";
import { fetchCredits } from "../../services/api";

const DashboardItem = React.memo(({ icon, title, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0px px 8px rgba(0,0,0,0.2)" }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center p-8 bg-white rounded-2xl shadow-lg cursor-pointer transition-colors duration-300 hover:bg-blue-100"
    onClick={onClick}
    role="button"
    aria-label={title}
  >
    <img src={icon} alt={`${title} Icon`} className="w-10 h-10 mr-4" />
    <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
  </motion.div>
));

const Card = ({ title, content, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-lg shadow-lg"
  >
    <div className="flex items-center mb-4">
      <FontAwesomeIcon icon={icon} className="text-2xl text-blue-500 mr-3" />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600">{content}</p>
  </motion.div>
);

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isImpersonating, setIsImpersonating] = useState(false); // Move state inside component
  const [creditsData, setCreditsData] = useState({
    email_credits: 0,
    sms_credits: 0,
    voice_credits: 0,
    whatsapp_credits: 0,
    rcs_credits: 0,
    numbers_credits: 0,
  });

  // Check if impersonation is active
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsImpersonating(true); // User is impersonating
    }
  }, []);

  // Fetch notifications and credits data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setTimeout(() => {
          setNotifications([
            { id: 1, message: "New feature available!" },
            { id: 2, message: "Your subscription will expire soon." },
          ]);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchCreditsData = async () => {
      try {
        const response = await fetchCredits({
          action: "read",
          username: user?.username,
        });

        const data = await response?.data;

        if (data.status === 1) {
          const creditInfo = data.data[0];
          setCreditsData({
            email_credits: creditInfo.email_credits,
            sms_credits: creditInfo.sms_credits,
            voice_credits: creditInfo.voice_credits,
            whatsapp_credits: creditInfo.whatsapp_credits,
            rcs_credits: creditInfo.rcs_credits,
            numbers_credits: creditInfo.numbers_credits,
          });
        } else {
          toast.error("Failed to load credits data.");
        }
      } catch (error) {
        console.error("Failed to fetch credits data:", error);
        toast.error("Failed to fetch credits. Please try again.");
      }
    };

    if (user?.username) {
      fetchCreditsData();
    }
  }, [user]);

  // // End Impersonation Function
  // const handleEndImpersonation = () => {
  //   const adminToken = localStorage.getItem("adminToken");

  //   if (adminToken) {
  //     // Restore the original admin token
  //     localStorage.setItem("authToken", adminToken);
  //     localStorage.removeItem("adminToken"); // Remove the impersonation token

  //     setIsImpersonating(false); // Set impersonation flag to false
  //     setUser({ ...user, isImpersonating: false }); // Update user state

  //     // Redirect back to admin dashboard or relevant page
  //     toast.success("Impersonation ended. You're now back as admin.");
  //     navigate("/dashboard/manageclients"); // Redirect to admin dashboard or desired location
  //   }
  // };

  const handleWhatsAppClick = useCallback(() => {
    navigate("/dashboard/whatsapp/broadcast");
  }, [navigate]);

  const handleVoiceClick = useCallback(() => {
    navigate("/dashboard/voice/broadcast");
  }, [navigate]);

  const handleSmsClick = useCallback(() => {
    navigate("/dashboard/sms");
  }, [navigate]);

  const handleBulkWhatsAppClick = useCallback(() => {
    navigate("/dashboard/bulkwhatsapp/broadcast");
  }, [navigate]);

  const handlefilemanagerClick = useCallback(() => {
    navigate("/dashboard/file-hosting");
  }, [navigate]);

  const handlemanageClientClick = useCallback(() => {
    navigate("/dashboard/manageclients");
  }, [navigate]);

  const handleInvoiceClick = useCallback(() => {
    navigate("/dashboard/Invoice");
  }, [navigate]);

  const urlshortnerClick = useCallback(() => {
    navigate("/dashboard/URLShortener");
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("Failed to logout. Please try again.");
    }
  }, [navigate, setUser]);

  const handleCopyApiUrl = () => {
    navigator.clipboard
      .writeText("https://api.example.com/v1")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy API URL:", error);
        toast.error("Failed to copy. Please try again.");
      });
  };

  const credits = useMemo(
    () => [
      {
        title: "Email Credits",
        value: creditsData.email_credits,
        icon: faEnvelope,
      },
      { title: "SMS Credits", value: creditsData.sms_credits, icon: faSms },
      {
        title: "Voice Credits",
        value: creditsData.voice_credits,
        icon: faPhone,
      },
      {
        title: "WhatsApp Credits",
        value: creditsData.whatsapp_credits,
        icon: faWhatsapp,
      },
      {
        title: "RCS Credits",
        value: creditsData.rcs_credits,
        icon: faBroadcastTower,
      },
      {
        title: "Numbers Credits",
        value: creditsData.numbers_credits,
        icon: faHashtag,
      },
      { title: "Push Notifications Credits", value: 300, icon: faBell },
    ],
    [creditsData]
  );

  const channels = useMemo(
    () => [
      { icon: MailIcon, title: "GSM SMS", onClick: handleSmsClick },
      { icon: VoiceIcon, title: "Voice", onClick: handleVoiceClick },
      {
        icon: WhatsAppIcon,
        title: "Official WhatsApp",
        onClick: handleWhatsAppClick,
      },
      {
        icon: WhatsAppIcon,
        title: "Bulk WhatsApp",
        onClick: handleBulkWhatsAppClick,
      },
      { icon: RCSIcon, title: "RCS" },
      { icon: NumbersIcon, title: "Numbers" },
      { icon: TelegramIcon, title: "Telegram" },
      { icon: InstagramIcon, title: "Instagram" },
    ],
    [handleWhatsAppClick]
  );

  const utilities = useMemo(
    () => [
      { icon: "/assets/images/svg/learning.svg", title: "Knowledgebase" },
      {
        icon: "/assets/images/svg/search-engine.svg",
        title: "URL Shortener",
        onClick: urlshortnerClick,
      },
      {
        icon: "/assets/images/svg/file-storage.svg",
        title: "File Hosting",
        onClick: handlefilemanagerClick,
      },
      { icon: "/assets/images/svg/statistics.svg", title: "Reports" },
      {
        icon: ManageClients,
        title: "ManageClients",
        onClick: handlemanageClientClick,
      },
      {
        icon: Invoice,
        title: "Invoice",
        onClick: handleInvoiceClick,
      },
    ],
    []
  );

  const plugins = useMemo(
    () => [
      { icon: "/assets/images/svg/logosshopify.svg", title: "Shopify" },
      { icon: "/assets/images/svg/googlesheet.svg", title: "Google Sheets" },
    ],
    []
  );

  return (
    <div className="font-sans antialiased bg-white min-h-screen">
      <Navbar user={user} setUser={setUser} />
{/* 
      {isImpersonating && (
        <div
          className="impersonation-banner"
          style={{
            padding: "10px",
            backgroundColor: "#ffcc00",
            marginBottom: "20px",
          }}
        >
          <strong>⚠️ You are currently impersonating another user!</strong>
          <button
            onClick={handleEndImpersonation}
            style={{
              padding: "8px 15px",
              backgroundColor: "#ff4444",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              marginLeft: "15px",
              cursor: "pointer",
            }}
          >
            End Impersonation
          </button>
        </div>
      )} */}

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">
              Welcome back, <span className="text-blue-600">{user?.username}</span>
            </h1>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-4 bg-white rounded-lg shadow-lg">
                <h4 className="text-lg font-semibold">Manage API Keys</h4>
                <p>Securely manage and rotate your API keys</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-blue-800">
                    API Base URL:
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyApiUrl}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                    aria-label="Copy API Base URL"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                </div>
                <p className="mt-2 text-blue-700">https://api.example.com/v1</p>
              </div>
              <div className="mx-8">
                <Carousel
                  autoPlay
                  infiniteLoop
                  showStatus={false}
                  showIndicators={false}
                  showThumbs={false}
                  interval={5000}
                  stopOnHover
                  dynamicHeight
                >
                  {credits.map((credit, index) => (
                    <CreditCard
                      key={index} // Use index for now, unless credits have unique ids
                      title={credit.title}
                      value={credit.value}
                      icon={credit.icon}
                      user={user}
                      setUser={setUser}
                    />
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Channels Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Channels</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {channels.map((channel, index) => (
              <DashboardItem key={index} {...channel} />
            ))}
          </div>
        </motion.section>

        {/* Utilities Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Utilities</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {utilities.map((utility, index) => (
              <DashboardItem key={index} {...utility} />
            ))}
          </div>
        </motion.section>

        {/* Plugins & Integrations Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 mb-8"
        >
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Plugins & Integrations
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {plugins.map((plugin, index) => (
              <DashboardItem key={index} {...plugin} />
            ))}
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default React.memo(Dashboard);