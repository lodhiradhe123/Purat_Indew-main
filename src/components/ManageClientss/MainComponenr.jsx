import React, { useState } from 'react';
import UserProfileModal from './UserProfileModal';

const MainComponent = () => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const userProfileData = {
    id: '56671',
    login: '70362019430',
    password: '**********',
    firstName: 'Aditi',
    lastName: 'Raghuwanshi',
    location: 'India',
    userType: 'User',
    email: 'raghuwanshiaditi6@gmail.com',
    phone: '07470723494',
    lastVisit: '-',
    registrationDate: '-',
    lastIpAddress: '-',
  };

  return (
    <div>
      <button onClick={() => setProfileModalOpen(true)}>⚙️ Settings</button>

      <UserProfileModal
        open={isProfileModalOpen}
        handleClose={() => setProfileModalOpen(false)}
        userProfileData={userProfileData}
      />
    </div>
  );
};

export default MainComponent;
