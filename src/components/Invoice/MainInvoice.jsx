import DashboardNavbar from "../Navbar/DashboardNavbar";
import SideBaRR from "./SideBaRR";


const MainInvoice = ({user}) => {
  
  return (
  
   <div>
   
   <DashboardNavbar />
   <SideBaRR user={user}/>
    <div className="invoice-component">

    
      {/* Add your invoice details and functionality here */}
    </div>
    </div>
  );
};

export default MainInvoice;
