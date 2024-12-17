import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

const API_URL = "https://walaminsalesserver.onrender.com/api/products";

const EditProductDialogue = ({ open, onClose, product, refreshProducts }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierContact, setSupplierContact] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setQuantity(product.quantity);
      setCostPrice(product.costPrice);
      setSupplier(product.supplier);
      setSupplierContact(product.supplierContact || "");
    }
  }, [product]);

  const handleSave = async () => {
    setLoading(true); // Show spinner
    try {
      const newDetails = {
        name,
        quantity: Number(quantity),
        costPrice: Number(costPrice),
        supplier,
        supplierContact,
      };

      // Send new details to the edit endpoint
      const response = await fetch(`${API_URL}/${product.name}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newDetails }),
      });

      if (response.ok) {
        refreshProducts(); // Refresh the product list after successful update
        onClose(); // Close the dialog
      } else {
        console.error("Failed to update product:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  const handleDelete = async () => {
    setLoading(true); // Show spinner
    try {
      const response = await fetch(`${API_URL}/${product.name}`, {
        method: "DELETE",
      });

      if (response.ok) {
        refreshProducts(); // Refresh the product list after successful deletion
        onClose(); // Close the dialog
      } else {
        console.error("Failed to delete product:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
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
        <h2>Edit Product</h2>
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
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            id="record-input"
          />
        </div>
        <div>
          <label>Cost Price</label>
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            id="record-input"
          />
        </div>
        <div>
          <label>Supplier</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            id="record-input"
          />
        </div>
        <div>
          <label>Supplier Contact</label>
          <input
            type="text"
            value={supplierContact}
            onChange={(e) => setSupplierContact(e.target.value)}
            id="record-input"
          />
        </div>

        {loading && <ProgressSpinner style={{ width: "50px", height: "50px" }} />}

        <br />
        <br />
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
            style={{ margin: "0 10px", color: "#fff", backgroundColor: "#28a745" }}
          >
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditProductDialogue;