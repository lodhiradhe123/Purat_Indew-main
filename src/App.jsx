import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import DashboardPage from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import TeamInbox from "./containers/TeamInbox";
import WhatsappNavbar from "./components/Navbar";
import UserManagement from "./containers/UserManagement";
import Webhooks from "./containers/Webhooks/Webhooks.jsx";
import DirectSupport from "./components/DirectSupport/index";
import UserProfile from "./containers/Profile/UserProfile";
import UnderDevelopment from "./components/UnderDevelopment/UnderDevelopment.jsx"; // Import the Under Development component
import FileManager from "./containers/FileManagerContainer/FileManager.jsx";
import Crm from "./containers/Crm";
import BulkWhatsapp from "./components/Navbar/bulkwhatsapp.jsx";
import BulkBroadcastPage from "./pages/broadcast";
import ProfileSettings from "./containers/ProfileSetting/index.jsx";

import Chatbot from "./containers/Chatbot";
import ChatbotBuilder from "./containers/Chatbot/ChatbotBuilder";
import CreateChatbot from "./containers/Chatbot/CreateChatbot";
import BlankPage from "./components/URLShortener/BlankPage";
import URLShortenerPage from "./containers/URLShortener";
import AnalyticsPage from "./containers/Analytics/index.jsx";
import SidebarLayout from "./containers/Broadcast/SidebarLayout.jsx";
import SidebarLayoutVoice from "./containers/Voice/index.jsx";

import BroadcastVoice from "./containers/Voice/BroadcastVoice.jsx";
import BroadcastHistory from "./containers/Broadcast/Broadcast.jsx";
import ScheduledBroadcasts from "./containers/Broadcast/ScheduledBroadcasts.jsx";
import MainPage from "./containers/Broadcast/TemplateMessages.jsx";
import VoiceNavbar from "./components/Navbar/VoiceNavbar.jsx";
import TransactionLog from "./containers/TransactionLogs";
import ContactTable from "./containers/Contacts/ContactTable.jsx";
import GroupList from "./containers/Contacts";
import Clients from "./containers/ManageClients/Clients.jsx";
import Sms from "./containers/Sms";
import SmsBroadcastVoice from "./containers/Sms/SmsBroadcast.jsx";
import DashboardNavbar from "./components/Navbar/DashboardNavbar.jsx";
import Invoice1 from "./containers/Invoice1";
import InvoiceList from "./components/Invoice/InvoiceList";
import AddInvoice from "./components/Invoice/AddInvoice";
import ManageClientOverview from "./components/ManageClientsOverview/Overviews.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import "@fontsource/poppins/300.css"; // Weight 300 for lighter text
import "@fontsource/poppins/400.css"; // Weight 400 for normal text
import "@fontsource/poppins/600.css"; // Weight 600 for emphasis
import "@fontsource/open-sans/400.css"; // Normal text
import "@fontsource/open-sans/700.css"; // Bold text

// Utility function to validate the presence of a token in localStorage
const validateToken = () => {
  const token = localStorage.getItem("token");
  return !!token; // Returns true if token exists, otherwise false
};

const App = () => {
  const [user, setUser] = useState(null);

  const userAuthentication = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && validateToken()) {
        setUser(JSON.parse(storedUser));
      } else {
        // Remove any invalid user or token data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  };

  useEffect(() => {
    userAuthentication();
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: "Open Sans, sans-serif", // Default to Open Sans for body text
      h1: {
        fontFamily: "Poppins, sans-serif",
      },
      h2: {
        fontFamily: "Poppins, sans-serif",
      },
      h3: {
        fontFamily: "Poppins, sans-serif",
      },
      // Add more as needed
    },
    palette: {
      primary: {
        main: "#2070e2",
      },
      common: {
        white: "#ffffff",
      },
      action: {
        hover: "#f5f5f5",
      },
    },
    spacing: 8, // This defines the spacing unit
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute user={user}>
                <Home setUser={setUser} />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={<DashboardPage user={user} setUser={setUser} />}
          />
          <Route
            path="/dashboard/whatsapp"
            element={
              <ProtectedRoute user={user}>
                <WhatsappNavbar user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          >
            {/* SidebarLayout wraps the routes that require a sidebar */}
            <Route path="/dashboard/whatsapp" element={<SidebarLayout />}>
              {/* These routes will be rendered inside the SidebarLayout */}
              <Route
                path="broadcast"
                element={<BroadcastHistory user={user} />}
              />
              <Route
                path="scheduledbroadcasts"
                element={<ScheduledBroadcasts user={user} />}
              />
              <Route path="templates" element={<MainPage user={user} />} />
            </Route>

            <Route
              path="/dashboard/whatsapp/teamInbox"
              element={<TeamInbox user={user} />}
            />

            <Route
              path="/dashboard/whatsapp/user-management"
              element={<UserManagement user={user} />}
            />
            <Route path="/dashboard/whatsapp/webhooks" element={<Webhooks />} />
            <Route
              path="/dashboard/whatsapp/chatbots"
              element={<Chatbot user={user?.username} />}
            />

            <Route
              path="/dashboard/whatsapp/chatbotBuilder"
              element={<ChatbotBuilder user={user?.username} />}
            />

            <Route
              path="/dashboard/whatsapp/createChatbot"
              element={<CreateChatbot />}
            />

            <Route
              path="/dashboard/whatsapp/crm"
              element={<Crm user={user?.username} />}
            />

            <Route
              path="/dashboard/whatsapp/contacts"
              element={<GroupList user={user?.username} />}
            />

            <Route
              path="/dashboard/whatsapp/contacts/:groupId/:groupName"
              element={<ContactTable user={user?.username} />}
            />

            <Route
              path="/dashboard/whatsapp/analytics"
              element={<AnalyticsPage user={user} />}
            />
          </Route>

          {/* SMS */}
          <Route
            path="/dashboard/sms"
            element={<DashboardNavbar user={user} setUser={setUser} />}
          >
            <Route path="/dashboard/sms" element={<Sms />}>
              {/* Redirect to /dashboard/sms/broadcast when /dashboard/sms is accessed */}
              <Route
                index
                element={<Navigate to="/dashboard/sms/broadcast" replace />}
              />

              <Route
                path="/dashboard/sms/broadcast"
                element={<SmsBroadcastVoice user={user} />}
              />
            </Route>
          </Route>

          {/* voice */}
          <Route
            path="/dashboard/voice"
            element={<VoiceNavbar user={user} setUser={setUser} />}
          >
            {/* SidebarLayout wraps the routes that require a sidebar */}
            <Route path="/dashboard/voice" element={<SidebarLayoutVoice />}>
              {/* These routes will be rendered inside the SidebarLayout */}
              <Route
                path="broadcast"
                element={<BroadcastVoice user={user} />}
              />
            </Route>
          </Route>

          {/* unoffical whatsapp */}
          <Route
            path="/dashboard/bulkwhatsapp"
            element={
              <ProtectedRoute user={user}>
                <BulkWhatsapp user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard/bulkwhatsapp/broadcast"
              element={<BulkBroadcastPage user={user} />}
            />
            <Route
              path="/dashboard/bulkwhatsapp/teamInbox"
              element={<TeamInbox user={user} />}
            />

            <Route
              path="/dashboard/bulkwhatsapp/templates"
              element={<MainPage user={user} />}
            />
            <Route
              path="/dashboard/bulkwhatsapp/user-management"
              element={<UserManagement user={user} />}
            />

            <Route
              path="/dashboard/bulkwhatsapp/crm"
              element={<Crm user={user?.username} />}
            />
            <Route
              path="/dashboard/bulkwhatsapp/contacts"
              element={<GroupList user={user?.username} />}
            />
          </Route>

          <Route
            path="/dashboard/support"
            element={<DirectSupport user={user} />}
          />

          <Route
            path="dashboard/userprofile/settings"
            element={<UserProfile user={user} />}
          />

          <Route
            path="dashboard/userprofile/ProfileSettings"
            element={<ProfileSettings user={user} />}
          />

          <Route
            path="/dashboard/file-hosting"
            element={<FileManager user={user} />}
          />

          <Route
            path="/dashboard/URLShortener"
            element={<URLShortenerPage user={user?.username} />}
          />

          <Route
            path="/dashboard/ManageClients"
            element={<Clients user={user?.username} />}
          />

          <Route
            path="/dashboard/ManageClients"
            element={
              <ManageClientOverview user={user?.username} setUser={setUser} />
            }
          />

          <Route
            path="/dashboard/transaction-logs"
            element={<TransactionLog user={user?.username} />}
          />

          <Route
            path="/dashboard/invoice"
            element={<Invoice1 user={user?.username} />}
          />
          <Route path="/dashboard/invoicelist" element={<InvoiceList />} />
          <Route path="/dashboard/addinvoice" element={<AddInvoice />} />
          <Route path="/url/:s_url" element={<BlankPage />} />
          {/* ADD by SHUBHAM: Catch-all route for Under Development */}
          {/* <Route path="*" element={<UnderDevelopment />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
