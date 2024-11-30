const BillingInfo = ({
    invoiceID,
    billingDate,
    dueDate,
    status,
    setInvoiceID,
    setBillingDate,
    setDueDate,
    setStatus,
}) => {
    return (
        <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-100 rounded-lg mt-12">
            {/* Invoice# */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Invoice#
                </label>
                <input
                    type="text"
                    value={invoiceID}
                    onChange={(e) => setInvoiceID(e.target.value)}
                    className="p-2 w-full border rounded-lg bg-gray-50"
                />
            </div>

            {/* Billing Date */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Billing Date
                </label>
                <input
                    type="date"
                    value={billingDate}
                    onChange={(e) => setBillingDate(e.target.value)}
                    className="p-2 w-full border rounded-lg"
                />
            </div>

            {/* Due Date */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Due Date
                </label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="p-2 w-full border rounded-lg"
                />
            </div>

            {/* Status */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2 w-full border rounded-lg bg-white"
                >
                    <option value="Fully Paid">Fully Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Overdue">Overdue</option>
                </select>
            </div>
        </div>
    );
};

export default BillingInfo;
