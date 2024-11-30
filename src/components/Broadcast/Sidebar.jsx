import React from 'react';

// Added by Shubham: SidebarItem component for individual menu items
const SidebarItem = ({ icon, text, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex flex-col md:flex-row items-center md:items-baseline text-gray-800 font-bold p-2 rounded hover:bg-blue-400 w-full transition-colors duration-200 ${
        isActive ? 'bg-blue-200' : ''
      }`}
    >
      <i className={`${icon} w-6 h-6 mb-1 md:mb-0 md:mr-2`}></i>
      <span className="hidden md:inline">{text}</span>
    </button>
  </li>
);

// Changed by Shubham: Sidebar component with added logic for menu clicks
const Sidebar = ({ activeMenuItem, handleMenuClick }) => {
  // Added by Shubham: Menu items data
  const menuItems = [
    { id: 'BroadcastHistory', icon: 'fas fa-history', text: 'Broadcast History' },
    { id: 'ScheduledBroadcasts', icon: 'fas fa-calendar-alt', text: 'Scheduled Broadcasts' },
    { id: 'TemplateMessages', icon: 'fas fa-envelope', text: 'Template Messages' },
  ];

  // Added by Shubham: Logic for handling menu item clicks
  const onMenuItemClick = (itemId) => {
    handleMenuClick(itemId);
    // You can add additional logic here if needed
    console.log(`Menu item clicked: ${itemId}`);
  };

  return (
    {/* Changed by Shubham: Sidebar structure and styling */}
    <aside className="w-14 md:w-72 bg-transparent rounded-xl py-7 border-r-2 shadow-inner p-2 mr-0 transition-all duration-300">
      <nav>
        <ul className="flex flex-col gap-5">
          {/* Added by Shubham: Mapping through menu items */}
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              text={item.text}
              isActive={activeMenuItem === item.id}
              onClick={() => onMenuItemClick(item.id)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
