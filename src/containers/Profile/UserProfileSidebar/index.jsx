import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUsers, faCog, faTrashAlt, faFileExport, faTags } from '@fortawesome/free-solid-svg-icons';

const UserProfileSidebar = ({ setSection, selectedSection }) => {
  const sections = [
    { id: 'loginintegration', label: 'Login Integration', icon: faSignInAlt },
    { id: 'yourintegration', label: 'Your Integration', icon: faUsers },
    { id: 'resellersettings', label: 'Reseller Settings', icon: faCog },
    { id: 'messagedeletion', label: 'Message Deletion', icon: faTrashAlt },
    { id: 'exportchats', label: 'Export Chats', icon: faFileExport },
    { id: 'tagsandattributes', label: 'Tags and Attributes', icon: faTags },
  ];

  return (
    <div className="flex flex-col items-start w-1/6  min-h-screen p-4 shadow-xl">
      {sections.map(section => (
        <div
          key={section.id}
          className={`flex items-center w-full p-3 my-2 rounded-lg cursor-pointer font-bold shadow-md ${
            selectedSection === section.id ? ' bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-indigo-100'
          }`}
          onClick={() => setSection(section.id)}
        >
          <FontAwesomeIcon icon={section.icon} className="mr-2" />
          {section.label}
        </div>
      ))}
    </div>
  );
};

export default UserProfileSidebar;
