import { useEffect, useState } from "react";
import useLocalStorageState from "../../context/useLocalStorage";
import { FaExpand } from "react-icons/fa6";

const api_url = "https://walaminsalesserver.onrender.com";

export default function CustomersStats() {
  const [customersStats, setCustomersStats] = useLocalStorageState(
    "customersStats",
    []
  );
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomersStats();
  }, []);

  const fetchCustomersStats = async () => {
    try {
      const response = await fetch(`${api_url}/customers/stats`);
      const data = await response.json();
      console.log(data);
      setCustomersStats(data);
    } catch (error) {
      setError("Failed to fetch customers stats");
      console.error(error);
    }
  };

  // Handle customer selection for the dialog
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div style={{ width: "100%" }}>
      <h2>Customer Stats</h2>
      {/* Display a list of customers */}
      <div className="customer-list" style={{ width: "100%" }}>
        {customersStats.map((customerStat, index) => (
          <div
            key={index}
            className="customer-item"
            style={{
              width: "100%",
            }}
          >
            <p
              style={{
                borderBottom: "solid 1px black",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline"
              }}
            >
              <p style={{ width: "30%" }}>
                <b style={{ marginRight: "2rem", marginBottom: "1rem" }}>
                  Name:
                </b>
                {customerStat.customer.name}
              </p>
              <p style={{ width: "30%" }}>
                <b style={{ marginRight: "2rem", marginBottom: "1rem" }}>
                  Total Spent:
                </b>
                {customerStat.totalSpent}
              </p>
              <p style={{ width: "30%" }}>
                <b style={{ marginRight: "2rem", marginBottom: "1rem" }}>
                  Total Records:
                </b>
                {customerStat.totalRecords}
              </p>
              <FaExpand
                onClick={() => handleCustomerSelect(customerStat)}
                style={{ cursor: "pointer" }}
              />
            </p>
          </div>
        ))}
      </div>

      {/* Show Customer Stats Dialog if a customer is selected */}
      {selectedCustomer && (
        <CustomerStatsDialog
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}

export function CustomerStatsDialog({ customer, onClose }) {
  return (
    <div
      className="dialog"
      style={{
        width: "100%",
        height: "100vh",
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
      }}
    >
      <h3>Customer Stats for {customer.customer.name}</h3>
      <p>
        <strong>Total Spent:</strong> {customer.totalSpent}
      </p>
      <p>
        <strong>Total Records:</strong> {customer.totalRecords}
      </p>

      {/* Transaction History */}
      <h4>Transaction History</h4>
      <ul>
        {customer.recordDetails.map((record, index) => (
          <li key={index} style={{ marginBottom: "2rem" }}>
            <span>
              <strong>Product:</strong> {record.name}
            </span>{" "}
            <br />
            <span>
              <strong>Quantity:</strong> {record.quantity}
            </span>{" "}
            <br />
            <span>
              <strong>Cost:</strong> {record.cost}
            </span>{" "}
            <br />
            <span>
              <strong>Supplier:</strong> {record.supplier}
            </span>{" "}
            <br />
            {record.productDetails && record.productDetails.supplier && (
              <>
                <span>
                  <strong>Product Supplier:</strong>{" "}
                  {record.productDetails.supplier}
                </span>{" "}
                <br />
                <span>
                  <strong>Supplier Contact:</strong>{" "}
                  {record.productDetails.supplierContact}
                </span>
              </>
            )}
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
