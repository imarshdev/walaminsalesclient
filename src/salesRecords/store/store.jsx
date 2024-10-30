import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import "./store.css";
// API URL for your backend
const API_URL = "https://walaminsalesserver.onrender.com/api/records";
const PRODUCTS_URL = "https://walaminsalesserver.onrender.com/api/products";

export default function Store() {
  const [products, setProducts] = useState([]);
  const [newOpen, setNewOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(0); // Default to 0

const downloadJsonFile = async () => {
  try {
    const response = await fetch(`${API_URL}/download`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `records-${new Date().toLocaleDateString("en-US").replace(/\//g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the file:", error);
  }
};

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${PRODUCTS_URL}`);
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  const addNewProduct = async () => {
    try {
      const response = await fetch(`${PRODUCTS_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProductName,
          quantity: newProductQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const addedProduct = await response.json();
      setProducts((prev) => [...prev, addedProduct]);
      setNewProductName("");
      setNewProductQuantity(0);
      setNewOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="store-container">
      <Dialog
        visible={newOpen}
        style={{
          width: "70vw",
          height: "60vh",
          backgroundColor: "pink",
        }}
        onHide={() => setNewOpen(false)}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>Item Name (include units)</p>
          <input
            type="text"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            id="record-input"
            style={{ width: "50%" }}
          />
          <p>Current Quantity</p>
          <input
            type="number"
            value={newProductQuantity}
            onChange={(e) => setNewProductQuantity(parseInt(e.target.value))}
            id="record-input"
            style={{ width: "50%" }}
          />
          <br />
          <br />
          <br />
          <div className="closing-buttons">
            <button className="closing-button" onClick={addNewProduct}>
              Add Product
            </button>
            <button
              className="closing-button"
              onClick={() => setNewOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
      <p>Store</p>
      <br />
      <div className="product-items-container">
        {products.map((product, index) => (
          <div className="product-items" key={index}>
            <span><b style={{marginRight: "15px"}}>Name:</b> {product.name}</span>
            <span><b style={{marginRight: "15px"}}>Current Quantity:</b> {product.quantity}</span>
          </div>
        ))}
      </div>
      <br />
      <button onClick={() => setNewOpen(true)}>
        <p>Add New Product</p>
      </button>
      <br />
      <br />
      <button onClick={downloadJsonFile}>
        <p>Download Current records JSON file</p>
      </button>
    </div>
  );
}
