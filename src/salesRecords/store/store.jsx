import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import useLocalStorageState from "../../context/useLocalStorage";
import "./store.css";

// API URL for your backend
const API_URL = "https://walaminsalesserver.onrender.com";
const PRODUCTS_URL = `${API_URL}/api/products`;
const CUSTOMERS_URL = `${API_URL}/api/customers`;

export default function Store() {
  const [page, setPage] = useLocalStorageState("page", "products");
  const [products, setProducts] = useLocalStorageState("products", []);
  const [customers, setCustomers] = useLocalStorageState("customers", []);
  const [newOpen, setNewOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductSupplier, setNewProductSupplier] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(0); // Default to 0
  const [newProductPrice, setNewProductPrice] = useState(0); // Default to 0
  const [newProductSalesPrice, setNewProductSalesPrice] = useState(0); // Default to 0
  const [newProductSupplierContact, setNewProductSupplierContact] =
    useState("");
  const [spinning, setSpinning] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    console.log(`Local Storage: ${JSON.stringify(localStorage, null, 2)}`);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(PRODUCTS_URL);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError("Failed to fetch products");
        console.error(error);
      }
    };
    fetchProducts();
  }, [setProducts]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(CUSTOMERS_URL);
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        setError("Failed to fetch customers");
        console.error(error);
      }
    };
    fetchCustomers();
  }, [setCustomers, CUSTOMERS_URL]);

  useEffect(() => {
    console.log("Products:", products);
    console.log("Customers:", customers);
  }, [products, customers]);

  const addNewProduct = async () => {
    setSpinning(true);
    setNewOpen(false); // Close the dialog
    try {
      const response = await fetch(PRODUCTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProductName,
          quantity: newProductQuantity,
          costPrice: newProductPrice,
          supplier: newProductSupplier,
          supplierContact: newProductSupplierContact, // Now formatted
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const addedProduct = await response.json();
      setProducts((prev) => [...prev, addedProduct]);
      setNewProductName("");
      setNewProductQuantity(0);
      setNewProductPrice(0);
      setNewProductSalesPrice(0);
      setNewProductSupplierContact(""); // Reset supplier contact
      setSpinning(false);
    } catch (error) {
      setError("Error adding product");
      console.error(error);
      setSpinning(false);
    }
  };

  const formatSupplierContact = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // If it starts with '07', replace it with '+256 7'
    let formattedValue = digits.startsWith("07") ? "+256 7" : digits;

    // Split the number into chunks and add spaces
    const chunks = formattedValue.match(/(\+256\s7\d{0,3})|(\d{1,3})/g);
    if (chunks) {
      formattedValue = chunks.join(" ").trim();
    }

    return formattedValue; // Limit to 13 characters (+256 7xxx xxx xxx)
  };

  const handleContactChange = (e) => {
    const formattedValue = formatSupplierContact(e.target.value);
    setNewProductSupplierContact(formattedValue);
  };

  return (
    <div className="store-container">
      {error && <p className="error-message">{error}</p>}
      <Dialog
        visible={newOpen}
        style={{
          width: "70vw",
          height: "95vh",
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
          <br />
          <span>Item Name (include units)</span>
          <input
            type="text"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            id="record-input"
            style={{ width: "50%" }}
          />
          <span>Current Quantity</span>
          <input
            type="number"
            value={newProductQuantity}
            onChange={(e) => setNewProductQuantity(parseInt(e.target.value))}
            id="record-input"
            style={{ width: "50%" }}
          />
          <span>Unit Price (cost price)</span>
          <input
            type="number"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(parseInt(e.target.value))}
            id="record-input"
            style={{ width: "50%" }}
          />
          <span>Supplier</span>
          <input
            type="text"
            value={newProductSupplier}
            onChange={(e) => setNewProductSupplier(e.target.value)}
            id="record-input"
            style={{ width: "50%" }}
          />
          <span>Supplier Contact</span>
          <input
            type="text"
            value={newProductSupplierContact}
            onChange={handleContactChange}
            id="record-input"
            style={{ width: "50%" }}
            placeholder="+256 7XXX XXX XXX"
          />
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
      <Dialog
        visible={customerOpen}
        style={{
          width: "70vw",
          height: "95vh",
          backgroundColor: "pink",
        }}
        onHide={() => setCustomerOpen(false)}
      >
        <NewCustomer
          setCustomerOpen={setCustomerOpen}
          setCustomers={setCustomers}
        />
      </Dialog>
      <h3
        style={{
          width: "40%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p
          onClick={() => setPage("products")}
          style={{
            borderBottom: page === "products" ? "solid 1px black" : "",
            width: "12rem",
          }}
        >
          Store Products
        </p>
        <p
          onClick={() => setPage("customers")}
          style={{
            borderBottom: page === "customers" ? "solid 1px black" : "",
            width: "12rem",
          }}
        >
          Store customers
        </p>
      </h3>
      {/* Update header */}
      {page === "products" && (
        <>
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
              </div>
            ))}
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
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
        </>
      )}
      {page === "customers" && (
        <>
          <div className="customer-items-container">
            {customers.map((customer, index) => (
              <div
                className="customer-items"
                key={index}
                style={{ borderBottom: "solid 1px #ccc", marginBottom: "20px" }}
              >
                <span style={{ marginRight: "25px" }}>
                  <b>Name:</b> {customer.name}
                </span>
                <span style={{ marginRight: "25px" }}>
                  <b>Business:</b> {customer.business}
                </span>
                <span style={{ marginRight: "25px" }}>
                  <b>Location:</b> {customer.location}
                </span>
                <span style={{ marginRight: "25px" }}>
                  <b>Contact:</b> {customer.contact}
                </span>
              </div>
            ))}
          </div>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <button
            style={{
              backgroundColor: "lime",
              marginRight: "20px",
              position: "fixed",
              left: "20px",
              bottom: "20px",
            }}
            onClick={() => setCustomerOpen(true)}
          >
            <p>Add New Customer</p>
          </button>
        </>
      )}
    </div>
  );
}

export function NewCustomer({ setCustomerOpen, setCustomers }) {
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerBusiness, setNewCustomerBusiness] = useState("");
  const [newCustomerLocation, setNewCustomerLocation] = useState("");
  const [newCustomerContact, setNewCustomerContact] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState("");

  const formatContactNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // If it starts with '07', replace it with '+256 7'
    let formattedNumber = digits.startsWith("07") ? "+256 7" : digits;

    // Split the number into chunks and add spaces
    const chunks = formattedNumber.match(/(\+256\s7\d{0,3})|(\d{1,3})/g);
    if (chunks) {
      formattedNumber = chunks.join(" ").trim();
    }

    return formattedNumber;
  };

  const handleContactChange = (e) => {
    const formattedValue = formatContactNumber(e.target.value);
    setNewCustomerContact(formattedValue);
  };

  const addCustomer = async () => {
    setSpinning(true);
    try {
      const response = await fetch(
        "https://walaminsalesserver.onrender.com/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCustomerName,
            business: newCustomerBusiness,
            location: newCustomerLocation,
            contact: newCustomerContact,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add customer");
      }

      const newCustomer = await response.json();
      setCustomers((prev) => [...prev, newCustomer]);
      setNewCustomerName("");
      setNewCustomerBusiness("");
      setNewCustomerLocation("");
      setNewCustomerContact("");
      setSpinning(false);
    } catch (err) {
      setError("Error adding customer");
      console.error(err);
      setSpinning(false);
    }
  };

  return (
    <form
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        addCustomer();
      }}
    >
      {error && <p className="error-message">{error}</p>}
      <br />
      <br />
      <span>Customer Name</span>
      <input
        type="text"
        id="record-input"
        style={{ width: "50%" }}
        value={newCustomerName}
        onChange={(e) => setNewCustomerName(e.target.value)}
        placeholder="Name"
      />
      <span>Customer Business Name</span>
      <input
        type="text"
        id="record-input"
        style={{ width: "50%" }}
        value={newCustomerBusiness}
        onChange={(e) => setNewCustomerBusiness(e.target.value)}
        placeholder="Business"
      />
      <span>Customer Location</span>
      <input
        type="text"
        id="record-input"
        style={{ width: "50%" }}
        value={newCustomerLocation}
        onChange={(e) => setNewCustomerLocation(e.target.value)}
        placeholder="Location"
      />
      <br />
      <span>Customer Contact</span>
      <input
        type="tel"
        id="record-input"
        style={{ width: "50%" }}
        value={newCustomerContact}
        onChange={handleContactChange}
        placeholder="+256 7XXX XXX XXX"
      />
      <br />
      <br />
      <button
        type="submit"
        className="closing-button"
        onClick={() => setCustomerOpen(false)}
      >
        {spinning ? "Adding..." : "Add Customer"}
      </button>
      <br />
      <button className="closing-button" onClick={() => setCustomerOpen(false)}>
        Cancel
      </button>
    </form>
  );
}

export const formatContactNumber = (value) => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "");

  // If it starts with '07', replace it with '+256 7'
  let formattedNumber = digits.startsWith("07") ? "+256 7" : digits;

  // Split the number into chunks and add spaces
  const chunks = formattedNumber.match(/(\+256\s7\d{0,3})|(\d{1,3})/g);
  if (chunks) {
    formattedNumber = chunks.join(" ").trim();
  }

  return formattedNumber;
};
