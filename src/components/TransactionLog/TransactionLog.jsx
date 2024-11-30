import DashboardNavbar from "../Navbar/DashboardNavbar";

import TicketList from "./TicketList";





const TransactionLog = ({ user }) => {
    return (
        <>
            <div>
                <DashboardNavbar />

                <div className="flex">
                   
                    <div className="flex flex-col w-full">
                        
                        <TicketList user={user} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TransactionLog;
