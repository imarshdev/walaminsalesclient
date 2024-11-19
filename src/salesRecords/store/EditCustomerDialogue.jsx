import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner"; // Import the spinner

const API_URL = "https://walaminsalesserver.onrender.com/api/customers";

const EditCustomerDialogue = ({
  open,
  onClose,
  customer,
  refreshCustomers,
}) => {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setBusiness(customer.business);
      setLocation(customer.location);
      setContact(customer.contact || "");
    }
  }, [customer]);

  const handleSave = async () => {
    setLoading(true); // Show spinner
    try {
      const updatedCustomer = {
        name,
        business,
        location,
        contact,
      };

      const response = await fetch(`${API_URL}/${customer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCustomer),
      });

      if (response.ok) {
        refreshCustomers();
        onClose();
      } else {
        console.error("Failed to update customer:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  const handleDelete = async () => {
    setLoading(true); // Show spinner
    try {
      const response = await fetch(`${API_URL}/${customer._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        refreshCustomers();
        onClose();
      } else {
        console.error("Failed to delete customer:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <Dialog
      visible={open}
      onHide={onClose}
      style={{ width: "70vw", height: "95vh", backgroundColor: "lightblue" }}
    >
      <div
        className="modal"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Edit Customer</h2>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="record-input"
          />
        </div>
        <div>
          <label>Business</label>
          <input
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            id="record-input"
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            id="record-input"
          />
        </div>
        <div>
          <label>Contact</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            id="record-input"
          />
        </div>

        {/* Display spinner if loading */}
        {loading && <ProgressSpinner style={{ width: "50px", height: "50px" }} />}

        <div className="closing-buttons" style={{ width: "70%" }}>
          <button
            className="closing-button"
            type="button"
            onClick={onClose}
            style={{
              margin: "0 10px",
              backgroundColor: "#6c757d",
              color: "#fff",
            }}
          >
            Cancel
          </button>
          <button
            className="closing-button"
            type="button"
            onClick={handleDelete}
            style={{
              margin: "0 10px",
              backgroundColor: "#dc3545",
              color: "#fff",
            }}
          >
            Delete
          </button>
          <button
            className="closing-button"
            type="button"
            onClick={handleSave}
            style={{ margin: "0 10px", color: "#fff" }}
          >
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditCustomerDialogue;