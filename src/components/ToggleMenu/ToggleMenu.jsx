const ToggleMenu = ({ menuItems, activeItem, setActiveItem }) => {
    return (
      <div className="flex justify-around p-4 mb-6 bg-white shadow-md rounded-lg">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`p-2 text-sm font-medium rounded-lg border 
              ${activeItem === item.id ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 hover:bg-gray-100"}`}
            onClick={() => setActiveItem(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  };
  
  export default ToggleMenu;
  