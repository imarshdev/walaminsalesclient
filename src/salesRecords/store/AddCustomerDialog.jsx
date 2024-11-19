import React, { useState } from "react";
import { Dialog } from "primereact/dialog";

const API_URL = "https://walaminsalesserver.onrender.com/api/customers";

export default function AddCustomerDialog({ visible, onClose, setCustomers }) {
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerContact, setNewCustomerContact] = useState("");
  const [newCustomerLocation, setNewCustomerLocation] = useState("");
  const [spinning, setSpinning] = useState(false);

  const addNewCustomer = async () => {
    setSpinning(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCustomerName,
          contact: newCustomerContact,
          location: newCustomerLocation,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add customer");
      }

      const addedCustomer = await response.json();
      setCustomers((prev) => [...prev, addedCustomer]);
      onClose(); // Close the dialog
    } catch (error) {
      console.error(error);
    } finally {
      setSpinning(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onClose}
      style={{ width: "70vw", height: "95vh", backgroundColor: "lightblue" }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <br />
        <span>Customer Name</span>
        <input
          type="text"
          value={newCustomerName}
          onChange={(e) => setNewCustomerName(e.target.value)}
          style={{ width: "50%" }}
          id="record-input"
        />
        <span>Contact</span>
        <input
          type="text"
          value={newCustomerContact}
          onChange={(e) => setNewCustomerContact(e.target.value)}
          style={{ width: "50%" }}
          id="record-input"
          placeholder="+256 7XXX XXX XXX"
        />
        <span>Location</span>
        <input
          type="text"
          value={newCustomerLocation}
          onChange={(e) => setNewCustomerLocation(e.target.value)}
          style={{ width: "50%" }}
          id="record-input"
        />
        <br />
        <div className="closing-buttons">
          <button className="closing-button" onClick={addNewCustomer}>
            {spinning ? "Adding..." : "Add Customer"}
          </button>
          <button className="closing-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
