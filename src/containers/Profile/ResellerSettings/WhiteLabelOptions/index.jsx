// src/containers/ResellerSettings/WhiteLabelOptions.js


// const WhiteLabelOptions = () => {
//   return (
//     <form className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Support (Yes or No)</label>
//         <select className="mt-1 p-2 w-full border rounded">
//           <option value="yes">Yes</option>
//           <option value="no">No</option>
//         </select>
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Brand Logo</label>
//         <input type="file" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Login Page Details (upto 300 words)</label>
//         <textarea className="mt-1 p-2 w-full border rounded" maxLength="300" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Login Background Image (1024x1024px)</label>
//         <input type="file" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Domain (Point at 182.71.43.75)</label>
//         <input type="text" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Color Scheme</label>
//         <input type="color" className="mt-1 p-2 w-full border rounded" />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Services (Enable or Disable services)</label>
//         <div className="mt-1 p-2 w-full border rounded">
//           <label>
//             <input type="checkbox" className="mr-2" />
//             Service 1
//           </label>
//           <br />
//           <label>
//             <input type="checkbox" className="mr-2" />
//             Service 2
//           </label>
//           {/* Add more services as needed */}
//         </div>
//       </div>
//     </form>
//   );
// };

// export default WhiteLabelOptions;


















import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEye } from '@fortawesome/free-solid-svg-icons';

const WhiteLabelOptions = () => {
  const [brandLogo, setBrandLogo] = useState(null);
  const [loginBackgroundImage, setLoginBackgroundImage] = useState(null);
  const [colorScheme, setColorScheme] = useState('#ffffff');

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (setImage) => {
    setImage(null);
  };

  const handleColorChange = (e) => {
    setColorScheme(e.target.value);
    document.body.style.backgroundColor = e.target.value; // Reflect color scheme immediately on the page
  };

  return (
    <form className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Brand Logo</label>
          <input type="file" onChange={(e) => handleImageChange(e, setBrandLogo)} className="mt-1 p-2 w-full border rounded" />
          {brandLogo && (
            <div className="relative mt-2">
              <img src={brandLogo} alt="Brand Logo" className="w-32 h-32 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage(setBrandLogo)}
                className="absolute top-0 right-0 p-1 w-11 h-11 bg-blue-500 text-white rounded-full"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Support (Yes or No)</label>
          <select className="mt-1 p-2 w-full border rounded">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Login Page Details (upto 300 words)</label>
          <textarea className="mt-1 p-2 w-full border rounded" maxLength="300" />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Domain (Point at 182.71.43.75)</label>
          <input type="text" className="mt-1 p-2 w-full border rounded" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Login Background Image (1024x1024px)</label>
          <input type="file" onChange={(e) => handleImageChange(e, setLoginBackgroundImage)} className="mt-1 p-2 w-full border rounded" />
          {loginBackgroundImage && (
            <div className="relative mt-2">
              <img src={loginBackgroundImage} alt="Login Background" className="w-32 h-32 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage(setLoginBackgroundImage)}
                className="absolute top-0 right-0 p-1 w-11 h-11 bg-blue-500 text-white rounded-full"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Color Scheme</label>
          <input type="color" value={colorScheme} onChange={handleColorChange} className="mt-1 p-2 border rounded w-1/4" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Services (Enable or Disable services)</label>
        <div className="mt-1 p-2 w-full border rounded">
          <label>
            <input type="checkbox" className="mr-2" />
            Service 1
          </label>
          <br />
          <label>
            <input type="checkbox" className="mr-2" />
            Service 2
          </label>
          {/* Add more services as needed */}
        </div>
      </div>
    </form>
  );
};

export default WhiteLabelOptions;

