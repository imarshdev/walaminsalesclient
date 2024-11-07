import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import useLocalStorageState from "../../context/useLocalStorage";
import "./store.css";
// API URL for your backend
const API_URL = "https://walaminsalesserver.onrender.com/api/records";
const PRODUCTS_URL = "https://walaminsalesserver.onrender.com/api/products";

export default function Store() {
  const [products, setProducts] = useLocalStorageState("products", []);
  const [newOpen, setNewOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(0); // Default to 0
  const [spinning, setSpinning] = useState(false);

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
    setSpinning(true);
    setNewOpen(false); // Close the dialog
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
      setSpinning(false);
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
              {spinning ? "Adding..." : "Add Product"}
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
      <br />
      <div className="product-items-container">
        {products.map((product, index) => (
          <div className="product-items" key={index}>
            <span>
              <b style={{ marginRight: "15px" }}>Name:</b> {product.name}
            </span>
            <span>
              <b style={{ marginRight: "15px" }}>Current Quantity:</b>{" "}
              {product.quantity}
            </span>
          </div>
        ))}
      </div>
      <br />
      <br />
      <br />
      <button onClick={() => setNewOpen(true)}>
        <p>Add New Product</p>
      </button>
    </div>
  );
}
