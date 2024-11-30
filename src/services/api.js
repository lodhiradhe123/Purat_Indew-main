import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Base URL not specified");
}

export const SIGN_UP = `${API_BASE_URL}/registration`;
export const LOGIN = `${API_BASE_URL}/login`;
export const MOBILE_OTP = `${API_BASE_URL}/send-mobile-otp`;
export const VERIFY_MOBILE_OTP = `${API_BASE_URL}/verify-mobile-otp`;
export const SEND_EMAIL_OTP = `${API_BASE_URL}/send-email-otp`;
export const VERIFY_EMAIL_OTP = `${API_BASE_URL}/verify-email-otp`;
export const CHANGE_PASSWORD = `${API_BASE_URL}/update-password`;
export const LOGOUT = `${API_BASE_URL}/logout`;
export const TEMPLATE_DATA = `${API_BASE_URL}/template`;
export const SUBMIT_BROADCAST_DATA = `${API_BASE_URL}/insert-broadcast-data`;
export const SUBMIT_BROADCAST_DATA_CSV = `${API_BASE_URL}/broadcastcsv`;

export const CHATS_LIST = `${API_BASE_URL}/filtered-data`;
export const ALL_CHATS = `${API_BASE_URL}/filtered-data-pdf`;
export const CHAT_STATUS = `${API_BASE_URL}/chat-message-room/update`;
export const ADVANCE_FILTER_CHAT_DATA = `${API_BASE_URL}/advance-filtered-data`;
export const CHAT_DATA = `${API_BASE_URL}/chat-messages`;
export const AGENTS_LIST = `${API_BASE_URL}/assign-users`;
export const GET_CHARTDATA = `${API_BASE_URL}/chart-data`;
export const GET_BROADCAST = `${API_BASE_URL}/broadcast`;
export const GET_CREDITS = `${API_BASE_URL}/credits`;
export const SUPPORT_TICKETS = `${API_BASE_URL}/support-tickets`;
export const BROADCAST_SPECIFIC = `${API_BASE_URL}/broadcast/specific`;
export const QUICK_REPLIES = `${API_BASE_URL}/quick-replies`;
export const USER_NOTES = `${API_BASE_URL}/chat-inbox/note`;
export const CRM_CHATS = `${API_BASE_URL}/crm/all-chat`;
export const CRM_CHAT_DETAILS = `${API_BASE_URL}/crm/specific-chat`;
export const USER_TAGS = `${API_BASE_URL}/chat-inbox/tag`;
export const CRM_BROADCAST = `${API_BASE_URL}/crm_broadcast`;
export const URL_SHORTENER = `${API_BASE_URL}/url-shortners`;
export const GROUP_CONTACTS = `${API_BASE_URL}/group-data`;
export const ASSIGN_TAG = `${API_BASE_URL}/crm_tags`;
export const GROUPS_LIST = `${API_BASE_URL}/group-names`;
export const TEAMS_DATA = `${API_BASE_URL}/teams`;
export const TRANSACTIONS = `${API_BASE_URL}/fund`;
export const CHATBOT_FLOW = `${API_BASE_URL}/chatbot-flow`;
export const IMPERSONATE = `${API_BASE_URL}/impersonate`;
export const CLIENTS = `${API_BASE_URL}/clients`;
export const TRANSACTION = `${API_BASE_URL}/client-funds`;
export const FUNDS = `${API_BASE_URL}/client-credits`;
export const WORKS = `${API_BASE_URL}/services`;
export const PROFILE = `${API_BASE_URL}/profile`;
export const INVOICE = `${API_BASE_URL}/invoice-company`;
export const INVOICE_CUSTOMER = `${API_BASE_URL}/invoice-user`;
export const INVOICE_FULL = `${API_BASE_URL}/invoice`;

export const SENDER_ID = `${API_BASE_URL}/sender-id`;
export const SMS_TEMPLATES = `${API_BASE_URL}/sms-templates`;
export const GSM_BROADCAST = `${API_BASE_URL}/gsm-broadcast`;
export const GSM_CSV_BROADCAST = `${API_BASE_URL}/gsm-csv-broadcast`;
export const GSM_READ = `${API_BASE_URL}/gsm-read`;

export const VOICE_DATA = `${API_BASE_URL}/get-delivery-data`;
export const VOICE_CALLER_ID = `${API_BASE_URL}/voice_caller_ids`;
export const VOICE_BROADCAST = `${API_BASE_URL}/voice-broadcast`;
export const VOICE_AUDIOS = `${API_BASE_URL}/voice_audios`;

export const CHATBOT_STEPS = `${API_BASE_URL}/chatbot-steps`;
export const FILE_HOSTING = `${API_BASE_URL}/file-folders`;



const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Authorization header to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && ![SIGN_UP, LOGIN].includes(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export API functions
export const signUp = (userData) => {
  return api.post(SIGN_UP, userData);
};

export const login = (userData) => {
  return api.post(LOGIN, userData);
};

export const requestMobileOtp = (mobile_no, username_or_email) => {
  return api.post(MOBILE_OTP, { mobile_no, username_or_email });
};

export const verifyMobileOtp = (mobile_no, otp) => {
  return api.post(VERIFY_MOBILE_OTP, { mobile_no, otp });
};

export const requestEmailOtp = (email) => {
  return api.post(SEND_EMAIL_OTP, { email });
};

export const verifyEmailOtp = (email, otp) => {
  return api.post(VERIFY_EMAIL_OTP, { email, otp });
};

export const changePassword = (email, password, password_confirmation) => {
  return api.post(CHANGE_PASSWORD, {
    email,
    password,
    password_confirmation,
  });
};

export const logout = () => {
  return api.post(LOGOUT);
};

export const invoice = (formData) => {
  return api.post(INVOICE, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Required for file uploads
    },
  });
};

export const invoicecustomer = (data) => {
  return api.post(INVOICE_CUSTOMER, data);
};
export const invoicefull = (data) => {
  return api.post(INVOICE_FULL, data);
};
export const templateData = (data) => {
  return api.post(TEMPLATE_DATA, data);
};

export const submitBroadcastData = (data) => {
  return api.post(SUBMIT_BROADCAST_DATA, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const submitCsvDataToSecondApi = (data) => {
  return api.post(SUBMIT_BROADCAST_DATA_CSV, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchAllChats = (action) => {
  return api.post(CHATS_LIST, action);
};

export const getAllChats = (action) => {
  return api.post(ALL_CHATS, action);
};

export const advanceFilterChatData = (data) => {
  return api.post(ADVANCE_FILTER_CHAT_DATA, data);
};

export const updateChatStatus = (payload) => {
  return api.post(CHAT_STATUS, payload);
};

export const fetchSelectedChatData = (payload) => {
  return api.post(CHAT_DATA, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchAgentsName = (payload) => {
  return api.post(AGENTS_LIST, payload);
};

export const agentsdata = (formData) => {
  return api.post(AGENTS_LIST, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const handleQuickReplies = (payload) => {
  return api.post(QUICK_REPLIES, payload);
};

export const handleQuickRepliesFormData = (formData) => {
  return api.post(QUICK_REPLIES, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchUserNotes = (payload) => {
  return api.post(USER_NOTES, payload);
};

export const fetchCrmChats = (user) => {
  return api.post(CRM_CHATS, user);
};

export const fetchCrmSpecificChat = (payload) => {
  return api.post(CRM_CHAT_DETAILS, payload);
};

export const fetchUserTags = (payload) => {
  return api.post(USER_TAGS, payload);
};

export const handleGroupOperations = (payload) => {
  return api.post(GROUPS_LIST, payload);
};

export const fetchChartdata = (data) => {
  return api.get(GET_CHARTDATA, data);
};

export const clients = (data) => {
  return api.post(CLIENTS, data);
};
export const impersonate = (data) => {
  return api.post(IMPERSONATE, data);
};

export const transaction = (data) => {
  return api.post(TRANSACTION, data);
};

export const works = (data) => {
  return api.post(WORKS, data);
};

export const funds = (data) => {
  return api.post(FUNDS, data);
};

export const profile = (data) => {
  const payload = {
    ...data,
    action: "update"
  }
  return api.post(PROFILE, payload, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const sendCrmBroadcast = (payload) => {
  return api.post(CRM_BROADCAST, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const assignTagContacts = (payload) => {
  return api.post(ASSIGN_TAG, payload);
};

export const teamdata = (payload) => {
  return api.post(TEAMS_DATA, payload);
};

export const handleContactOperations = (payload) => {
  return api.post(GROUP_CONTACTS, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const urlShortener = (payload) => {
  return api.post(URL_SHORTENER, payload);
};

export const fetchbroadcast = (data) => {
  return api.post(GET_BROADCAST, data);
};

export const fetchCredits = (data) => {
  return api.post(GET_CREDITS, data);
};

export const supportTickets = (formData) => {
  return api.post(SUPPORT_TICKETS, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const broadcastSpecific = (data) => {
  return api.post(BROADCAST_SPECIFIC, data);
};

export const chatbotSteps = (payload) => {
  return api.post(CHATBOT_STEPS, payload);
};

export const transactions = (data) => {
  return api.post(TRANSACTIONS, data);
};

export const senderId = (payload) => {
  return api.post(SENDER_ID, payload);
};

export const smsTemplate = (payload) => {
  return api.post(SMS_TEMPLATES, payload);
};

export const gsmBroadcast = (payload) => {
  return api.post(GSM_BROADCAST, payload);
};

export const gsmCsvBroadcast = (formData) => {
  return api.post(GSM_CSV_BROADCAST, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const gsmRead = (payload) => {
  return api.post(GSM_READ, payload);
};

export const voiceDataApi = (payload) => {
  return api.post(VOICE_DATA, payload);
};

export const voiceCallerId = (payload) => {
  return api.post(VOICE_CALLER_ID, payload);
};

export const voiceBroadcast = (formData) => {
  return api.post(VOICE_BROADCAST, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const voiceAudios = (formData) => {
  return api.post(VOICE_AUDIOS, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const chatbotFlow = (payload) => {
  return api.post(CHATBOT_FLOW, payload);
};

export const fileHosting = (payload) => {
  return api.post(FILE_HOSTING, payload);
};

export default api;
