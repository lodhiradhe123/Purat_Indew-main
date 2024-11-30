import Dashboard from "../containers/Dashboard";
import React from 'react';


const DashboardPage = ({ user, setUser }) => {
    return <Dashboard user={user} setUser={setUser} />;
    
};

export default DashboardPage;
