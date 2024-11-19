import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { formatSupplierContact } from "../../utils/contactFormatter.jsx";

const API_URL = "https://walaminsalesserver.onrender.com/api/products";

export default function AddProductDialog({ visible, onClose, setProducts }) {
  const [newProductName, setNewProductName] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(0);
  const [newProductPrice, setNewProductPrice] = useState(0);
  const [newProductSupplier, setNewProductSupplier] = useState("");
  const [newProductSupplierContact, setNewProductSupplierContact] =
    useState("");
  const [spinning, setSpinning] = useState(false);

  const addNewProduct = async () => {
    setSpinning(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProductName,
          quantity: newProductQuantity,
          costPrice: newProductPrice,
          supplier: newProductSupplier,
          supplierContact: newProductSupplierContact,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const addedProduct = await response.json();
      setProducts((prev) => [...prev, addedProduct]);
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
      style={{ width: "70vw", height: "95vh", backgroundColor: "pink" }}
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
        <span>Item Name (include units)</span>
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          style={{ width: "50%" }}
          id="record-input"
        />
        <span>Current Quantity</span>
        <input
          type="number"
          value={newProductQuantity}
          onChange={(e) => setNewProductQuantity(parseInt(e.target.value))}
          style={{ width: "50%" }}
          id="record-input"
        />
        <span>Unit Price (cost price)</span>
        <input
          type="number"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(parseInt(e.target.value))}
          style={{ width: "50%" }}
          id="record-input"
        />
        <span>Supplier</span>
        <input
          type="text"
          value={newProductSupplier}
          onChange={(e) => setNewProductSupplier(e.target.value)}
          style={{ width: "50%" }}
          id="record-input"
        />
        <span>Supplier Contact</span>
        <input
          type="text"
          value={newProductSupplierContact}
          onChange={(e) =>
            setNewProductSupplierContact(formatSupplierContact(e.target.value))
          }
          style={{ width: "50%" }}
          placeholder="+256 7XXX XXX XXX"
          id="record-input"
        />
        <br />
        <div className="closing-buttons">
          <button className="closing-button" onClick={addNewProduct}>
            {spinning ? "Adding..." : "Add Product"}
          </button>
          <button className="closing-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
