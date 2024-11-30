import React, { useState, Suspense, lazy, useEffect } from "react";
import Button from "@material-ui/core/Button";
import DashboardNavbar from "../../../components/Navbar/DashboardNavbar";
import UserProfileSidebar from "../UserProfileSidebar";
import ToggleMenu from "../../../components/ToggleMenu/ToggleMenu"; // Reusable toggle menu component
import "tailwindcss/tailwind.css";
import { profile } from "../../../services/api";
import { toast, ToastContainer } from "react-toastify";
import handleApiError from '../../../utils/errorHandler';

const Credentials = lazy(() => import("../LoginIntegration/Credentials"));
const BasicInfo = lazy(() => import("../LoginIntegration/BasicInfo"));
const ContactInfo = lazy(() => import("../LoginIntegration/ContactInfo"));
const BusinessDetails = lazy(() => import("../LoginIntegration/BusinessDetails"));
const AdditionalFields = lazy(() => import("../LoginIntegration/AdditionalFields"));

const UserProfile = ({ user }) => {
  const [activeSection, setActiveSection] = useState("loginintegration");
  const [activeSubSection, setActiveSubSection] = useState("credentials");
  //const [isEditable, setIsEditable] = useState(false); // State to toggle editability

  const [credentialsData, setCredentialsData] = useState({});
  const [basicInfoData, setBasicInfoData] = useState({});
  const [contactInfoData, setContactInfoData] = useState({});
  const [businessDetailsData, setBusinessDetailsData] = useState({});
  const [additionalFieldsData, setAdditionalFieldsData] = useState({});

  const sections = {
    loginintegration: {
      menu: [
        {
          id: "credentials",
          label: "Login Credentials",
          component: (
            <Credentials
              data={credentialsData}
              setData={setCredentialsData}
              //isEditable={isEditable}
              //setIsEditable={setIsEditable} // Pass the setIsEditable function
             
              user={user}
            />
          ),
        },
        {
          id: "basicinfo",
          label: "Basic Information",
          component: (
            <BasicInfo
              data={basicInfoData}
              setData={setBasicInfoData}
              //isEditable={isEditable}
              user={user}
            />
          ),
        },
        {
          id: "contactinfo",
          label: "Contact Information",
          component: (
            <ContactInfo
              data={contactInfoData}
              setData={setContactInfoData}
              user={user}
              //isEditable={isEditable}
            />
          ),
        },
        {
          id: "businessdetails",
          label: "Business Details",
          component: (
            <BusinessDetails
              data={businessDetailsData}
              setData={setBusinessDetailsData}
              user={user}
              //isEditable={isEditable}
            />
          ),
        },
        {
          id: "additionalfields",
          label: "Additional Fields",
          component: (
            <AdditionalFields
              data={additionalFieldsData}
              setData={setAdditionalFieldsData}
              
              //isEditable={isEditable}
              user={user}
            />
          ),
        },
      ],
    },
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setActiveSubSection(sections[section]?.menu[0]?.id || "");
  };

  

  const renderContent = () => {
    if (sections[activeSection]?.menu.length) {
      const activeMenuItem = sections[activeSection].menu.find(
        (item) => item.id === activeSubSection
      );
      return activeMenuItem?.component || null;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <DashboardNavbar />
      <div className="flex flex-grow">
        <ToastContainer />

        <UserProfileSidebar setSection={handleSectionChange} selectedSection={activeSection} />

        <div className="flex-grow p-7 relative">
          {sections[activeSection]?.menu?.length > 0 && (
            <ToggleMenu
              menuItems={sections[activeSection].menu}
              activeItem={activeSubSection}
              setActiveItem={setActiveSubSection}
            />
          )}

          <Suspense fallback={<div>Loading...</div>}>{renderContent()}</Suspense>
        </div>
      </div>
      
    </div>
  );
};

export default UserProfile;
