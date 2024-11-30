
// import AddInvoice from "../../components/Invoice/AddInvoice";
import MainInvoice from "../../components/Invoice/MainInvoice";
// import Invoice from "../../components/Invoice/MainInvoice"; // Ensure this path is correct

const Invoice1 = ({ user }) => {
  return (
    <div className="invoice1-container">
      {/* <AddInvoice user={user} /> */}
      <MainInvoice user={user}/>

    </div>
  );
};

export default Invoice1;












