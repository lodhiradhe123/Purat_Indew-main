import React, { useEffect, useState } from 'react';
import InvoiceList from './InvoiceList'; // Import InvoiceList component

const ParentComponent = () => {
    const [user, setUser] = useState(null); // State to store user

    // Simulate fetching user data (you can replace this with actual API call)
    useEffect(() => {
        // Simulating user data fetch
        setTimeout(() => {
            setUser("exampleUser"); // Set the user to simulate fetching user info
        }, 1000);
    }, []);

    // Check if the user is still being loaded
    if (!user) {
        return <p>Loading user data...</p>;  // Wait until user is loaded
    }

    // Once user is available, render the InvoiceList and pass the user prop
    return (
        <div>
            <InvoiceList user={user} />  {/* Pass the user prop to InvoiceList */}
        </div>
    );
};

export default ParentComponent;

