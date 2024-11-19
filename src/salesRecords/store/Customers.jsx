import React, { useState, useEffect } from "react";
import useLocalStorageState from "../../context/useLocalStorage";
import AddCustomerDialog from "./AddCustomerDialog.jsx";
import EditCustomerDialogue from "./EditCustomerDialogue.jsx";

const API_URL = "https://walaminsalesserver.onrender.com/api/customers";

export default function Customers() {
  const [customers, setCustomers] = useLocalStorageState("customers", []);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      setError("Failed to fetch customers");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [setCustomers]);

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
    console.log("clicked");
  };

  return (
    <>
      {error && <p className="error-message">{error}</p>}
      <div className="customer-items-container">
        {customers.map((customer, index) => (
          <div
            className="customer-items"
            key={index}
            style={{ borderBottom: "solid 1px #ccc", marginBottom: "20px" }}
          >
            <span style={{ marginRight: "15px" }}>
              <b style={{ marginRight: "15px" }}>Name:</b> {customer.name}
            </span>
            <span style={{ marginRight: "15px" }}>
              <b style={{ marginRight: "15px" }}>Contact:</b> {customer.contact}
            </span>
            <span style={{ marginRight: "15px" }}>
              <b style={{ marginRight: "15px" }}>Location:</b>{" "}
              {customer.location}
            </span>
            <button onClick={() => handleEditClick(customer)}>Edit</button>
          </div>
        ))}
      </div>
      <button
        style={{
          backgroundColor: "lime",
          marginRight: "20px",
          position: "fixed",
          left: "20px",
          bottom: "20px",
        }}
        onClick={() => setNewOpen(true)}
      >
        <p>Add New Customer</p>
      </button>
      <AddCustomerDialog
        visible={newOpen}
        onClose={() => setNewOpen(false)}
        setCustomers={setCustomers}
      />
      <EditCustomerDialogue
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        customer={selectedCustomer}
        refreshCustomers={fetchCustomers}
      />
    </>
  );
}
