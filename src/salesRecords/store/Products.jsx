import React, { useState, useEffect } from "react";
import useLocalStorageState from "../../context/useLocalStorage";
import AddProductDialog from "./AddProductDialog.jsx";
import EditProductDialogue from "./EditProductDialogue.jsx";

const API_URL = "https://walaminsalesserver.onrender.com/api/products";

export default function Products() {
  const [products, setProducts] = useLocalStorageState("products", []);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [setProducts]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError("Failed to fetch products");
      console.error(error);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
    console.log("clicked");
  };

  return (
    <>
      {error && <p className="error-message">{error}</p>}
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
            <span>
              <b style={{ marginRight: "15px" }}>Unit Price:</b> shs.{" "}
              {product.costPrice}
            </span>
            <span
              onClick={() => handleEditClick(product)}
              style={{ cursor: "pointer" }}
            >
              <b>Edit</b>
            </span>
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
        <p>Add New Product</p>
      </button>
      <AddProductDialog
        visible={newOpen}
        onClose={() => setNewOpen(false)}
        setProducts={setProducts}
      />
      <EditProductDialogue
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        product={selectedProduct}
        refreshProducts={fetchProducts}
      />
    </>
  );
}
