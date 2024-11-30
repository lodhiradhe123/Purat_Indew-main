import React, { useState } from 'react';
import Modal from 'react-modal';

const AddCompanyModal = ({ isOpen, onClose }) => {
    const [companyName, setCompanyName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    // Add other fields as needed

    const handleSave = () => {
        // Handle save logic
        console.log("Company Saved:", { companyName, companyAddress });
        onClose(); // Close modal after saving
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose}>
            <h2>Add New Company</h2>
            <form>
                <label>
                    Name:
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </label>
                <label>
                    Address:
                    <input
                        type="text"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                    />
                </label>
                {/* Add other fields */}
                <button type="button" onClick={handleSave}>Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default AddCompanyModal;
