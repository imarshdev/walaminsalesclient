import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useLocalStorageState from "../../context/useLocalStorage";
import CustomersStats from "./customerStats";

const api_url = "https://walaminsalesserver.onrender.com";

export default function StoreHome() {
  const [stats, setStats] = useLocalStorageState("stats", null);
  const [productsStats, setProductsStats] = useLocalStorageState(
    "productsStats",
    []
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchProducts();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${api_url}/stats`);
      const data = await response.json();
      setStats(data);
      console.log(data);
    } catch (error) {
      setError("Failed to fetch stats");
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${api_url}/products/stats`);
      const data = await response.json();
      setProductsStats(data);
      console.log(data);
    } catch (error) {
      setError("Failed to fetch products");
      console.error(error);
    }
  };

  // Handle expand button click
  const handleExpandClick = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  // Handle product selection for the dialog
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  if (!stats) {
    return <p>Loading store stats...</p>;
  }

  return (
    <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
      <p style={{ width: "100%", margin: 0 }}>
        <b>Total Products:</b> {stats.totalProducts}
      </p>
      <p style={{ width: "100%", margin: 0 }}>
        <b>Total Customers:</b> {stats.totalCustomers}
      </p>
      <p style={{ width: "100%", margin: 0 }}>
        <b>Total Records:</b> {stats.totalRecords}
      </p>
      <div style={{ width: "50%" }}>
        <h4>Best Selling Products</h4>
        {stats.bestSellingProductsWithDetails.map((product, index) => (
          <p key={index}>
            <b>{product.productDetails.name}</b> - {product.totalSold} units
            sold at shs. {product.productDetails.costPrice} <b>unit price</b>
          </p>
        ))}
      </div>
      <div style={{ width: "50%" }}>
        <h4>Top Customers</h4>
        {stats.topCustomersWithDetails.map((customer, index) => (
          <p key={index}>
            <b>{customer._id}</b> - spent {customer.totalSpent} UGX
          </p>
        ))}
      </div>
      <h4>Product Stats</h4>
      <div className="product-items-container">
        {productsStats.map((product, index) => (
          <div className="product-items" key={index}>
            <span>
              <b>Name:</b> {product.product.name}
            </span>
            <span>
              <b>Current Quantity:</b> {product.product.quantity}
            </span>
            <span>
              <b>Unit Price:</b> shs. {product.product.costPrice}
            </span>
            <span
              onClick={() => handleProductSelect(product)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              <b>View Details</b>
            </span>
          </div>
        ))}
      </div>

      <CustomersStats />

      {/* Show Product Stats Dialog if selected product is set */}
      {selectedProduct && (
        <ProductStatsDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export function ProductStatsDialog({ product, onClose }) {
  return (
    <div
      className="dialog"
      style={{
        width: "100%",
        height: "100vh",
        padding: 0,
        margin: 0,
        position: "fixed",
        top: 0,
        zIndex: 999,
        left: 0,
        backgroundColor: "#fff",
        overflow: "scroll",
        scrollbarWidth: "none",
        boxSizing: "border-box",
        padding: "30px",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <p style={{ width: "50%" }}>
        {/* Stock Trend Chart */}
        <h4>Stock Trend</h4>
        <LineChart
          width={600}
          height={300}
          data={product.cumulativeStock}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalStock"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </p>

      <p style={{ width: "50%" }}>
        <h3>Product Stats for {product.product.name}</h3>
        <p>
          <strong>Total Stock:</strong> {product.totalStock}
        </p>
        <p>
          <strong>Restock Frequency:</strong> {product.restockFrequency}
        </p>
      </p>

      <span style={{ width: "100%" }}>
        <b>Incoming History</b>
      </span>
      <ul>
        {product.incomingHistory.map((record, index) => (
          <li key={index}>
            {record.date}: {record.quantity} units added.
          </li>
        ))}
      </ul>

      <span style={{ width: "100%" }}>
        <b>Outgoing History</b>
      </span>
      <ul>
        {product.outgoingHistory.map((record, index) => (
          <li key={index}>
            {record.date}: {record.quantity} units sold.
          </li>
        ))}
      </ul>

      <span style={{ position: "fixed", right: 10, top: 10 }}>
        <button
          style={{ backgroundColor: "limegreen", width: "10rem" }}
          onClick={onClose}
        >
          Close
        </button>
      </span>
    </div>
  );
}
