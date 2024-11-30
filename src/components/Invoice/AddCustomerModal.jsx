import React, { useState } from 'react';
import Modal from 'react-modal';

const AddCustomerModal = ({ isOpen, onClose }) => {
    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    // Add other fields as needed

    const handleSave = () => {
        // Handle save logic
        console.log("Customer Saved:", { customerName, customerAddress });
        onClose(); // Close modal after saving
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <h2>Add New Customer</h2>
            <form>
                <label>
                    Name:
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </label>
                <label>
                    Address:
                    <input
                        type="text"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                </label>
                {/* Add other fields */}
                <button type="button" onClick={handleSave}>Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default AddCustomerModal;
