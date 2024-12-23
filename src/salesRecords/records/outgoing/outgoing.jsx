import React, { useState, useEffect, useRef } from "react";
import "./outgoing.css"; // Update your CSS file name if needed
import { Dialog } from "primereact/dialog";
import { BiEdit } from "react-icons/bi";
import useLocalStorageState from "../../../context/useLocalStorage";

// API URLs for your backend
const API_URL = "https://walaminsalesserver.onrender.com/api/records"; // Adjust if necessary
const PRODUCTS_URL = "https://walaminsalesserver.onrender.com/api/products";
const CUSTOMER_URL = "https://walaminsalesserver.onrender.com";
export default function Outgoing() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [outgoingRecords, setOutgoingRecords] = useLocalStorageState(
    "outgoingRecords",
    []
  ); // Change state variable
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch records from the backend on component mount
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_URL}?type=outgoing`);
        const data = await response.json();
  
        // Sort by date descending
        const sortedData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date) // Convert date strings to Date objects
        );
  
        setOutgoingRecords(sortedData);
        console.log("Outgoing Records (Sorted):", sortedData);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="outgoing-container">
      {/* Update class name if needed */}
      {/* Add Record Dialog */}
      <Dialog
        header="Add Record"
        visible={visible}
        style={{
          width: "70vw",
          height: "90%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onHide={() => setVisible(false)}
      >
        <AddRecord
          outgoingRecords={outgoingRecords} // Pass the new state
          setOutgoingRecords={setOutgoingRecords} // Pass the new state updater
          setVisible={setVisible}
        />
      </Dialog>
      {/* Edit Record Dialog */}
      <Dialog
        header="Edit Record"
        visible={editVisible}
        style={{
          width: "70vw",
          height: "90%",
          boxSizing: "border-box",
        }}
        onHide={() => setEditVisible(false)}
      >
        {selectedRecord && (
          <EditRecord
            record={selectedRecord}
            setOutgoingRecords={setOutgoingRecords} // Pass the new state updater
            setEditVisible={setEditVisible}
            setSelectedRecord={setSelectedRecord}
          />
        )}
      </Dialog>
      <h2>Outgoing</h2> {/* Update header */}
      <div className="records">
        <div className="record-item header">
          <span style={{ width: "13rem" }}>Date & Time</span>
          <span style={{ width: "13rem" }}>Product</span>
          <span>Quantity</span>
          <span>Cost (shs.)</span>
          <span>Supplied to</span> {/* Change label if needed */}
          <span>Recorded By</span>
          <span style={{ width: "5rem" }}></span>
        </div>
        {outgoingRecords.map((record, index) => (
          <div className="record-item" key={record.id || index}>
            <span style={{ width: "13rem" }}>{record.date}</span>
            <span style={{ width: "13rem" }}>{record.name}</span>
            <span>{record.quantity}</span>
            <span>{record.cost}</span>
            <span>{record.supplier}</span>
            <span>{record.enteredBy}</span>
            <button
              style={{ width: "5rem" }}
              onClick={() => {
                setSelectedRecord(record);
                setEditVisible(true);
              }}
            >
              <BiEdit />
            </button>
          </div>
        ))}
      </div>
      <div style={{ height: "6rem" }}></div>
      <AddRecordButton setVisible={setVisible} />
    </div>
  );
}

function AddRecord({ setVisible, setOutgoingRecords }) {
  const [products, setProducts] = useLocalStorageState("products", []);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [username, setUsername] = useLocalStorageState("username", "");
  const [quantity, setQuantity] = useState(0);
  const [salesPrice, setSalesPrice] = useState(0); // New state for manual price entry
  const [totalCost, setTotalCost] = useState(0);
  const [supplier, setSupplier] = useState();
  const [customers, setCustomers] = useLocalStorageState("customers", []);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${PRODUCTS_URL}`);
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${CUSTOMER_URL}/api/customers`);
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
  };

  const MethodRef = useRef();
  const ConditionRef = useRef();
  const CommentRef = useRef();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    setTotalCost(newQuantity * salesPrice); // Calculate total cost with manual sales price
  };

  const handleSalesPriceChange = (e) => {
    const newSalesPrice = parseFloat(e.target.value);
    setSalesPrice(newSalesPrice);
    setTotalCost(quantity * newSalesPrice); // Recalculate total cost on price change
  };

  const addRecordItem = async () => {
    const newRecord = {
      id: Date.now().toString(),
      name: selectedProduct,
      quantity,
      cost: totalCost,
      supplier: selectedCustomer,
      enteredBy: username,
      date: new Date().toLocaleString(),
    };

    try {
      await fetch(`${API_URL}/outgoing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      });

      await fetch(`${PRODUCTS_URL}/${selectedProduct}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantityChange: -quantity }),
      });

      setOutgoingRecords((prev) => [...prev, newRecord]);
      setVisible(false);
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  return (
    <div className="add-record-container">
      <p className="m-0">
        <span>Product Name :</span>
        <select
          onChange={(e) => setSelectedProduct(e.target.value)}
          id="record-input"
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.name} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
        <span>Quantity :</span>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          id="record-input"
        />
        <span>Sales Price :</span>
        <input
          type="number"
          value={salesPrice}
          onChange={handleSalesPriceChange}
          id="record-input"
        />
        <span>Cost :</span>
        <input type="text" value={totalCost} readOnly id="record-input" />
        <span>Customer :</span>
        <select onChange={handleCustomerChange} id="record-input">
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer.name}>
              {customer.name}
            </option>
          ))}
        </select>
      </p>
      <div className="closing-buttons">
        <button
          className="closing-button"
          onClick={addRecordItem}
          disabled={!selectedProduct}
        >
          Add Record
        </button>
        <button className="closing-button" onClick={() => setVisible(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function EditRecord({ record, setOutgoingRecords, setEditVisible }) {
  const NameRef = useRef(record.name);
  const QuantityRef = useRef(record.quantity);
  const CostRef = useRef(record.cost);
  const MethodRef = useRef(record.method);
  const SupplierRef = useRef(record.supplier);
  const ConditionRef = useRef(record.condition);
  const CommentRef = useRef(record.comment);
  const EnteredRef = useRef(record.enteredBy);

  const updateRecordItem = async () => {
    const updatedRecord = {
      ...record,
      name: NameRef.current.value,
      quantity: QuantityRef.current.value,
      cost: CostRef.current.value,
      method: MethodRef.current.value,
      supplier: SupplierRef.current.value,
      condition: ConditionRef.current.value,
      comment: CommentRef.current.value,
      enteredBy: EnteredRef.current.value,
      date: new Date().toLocaleString(),
    };

    try {
      // Send an update request to the backend
      await fetch(`${API_URL}/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecord),
      });

      // Update the outgoing records in the state
      setOutgoingRecords((prev) =>
        prev.map((rec) => (rec.id === record.id ? updatedRecord : rec))
      );
      setEditVisible(false);
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <div className="edit-record-container">
      <p className="m-0">
        <span>Product Name :</span>
        <input
          type="text"
          ref={NameRef}
          defaultValue={record.name}
          id="record-input"
        />
        <span>Quantity :</span>
        <input
          type="number"
          ref={QuantityRef}
          defaultValue={record.quantity}
          id="record-input"
        />
        <span>Cost :</span>
        <input
          type="text"
          ref={CostRef}
          defaultValue={record.cost}
          id="record-input"
        />
        <span>Payment Method :</span>
        <input
          type="text"
          ref={MethodRef}
          defaultValue={record.method}
          id="record-input"
        />
        <span>Supplier :</span>
        <input
          type="text"
          ref={SupplierRef}
          defaultValue={record.supplier}
          id="record-input"
        />
        <span>Condition of Goods :</span>
        <input
          type="text"
          ref={ConditionRef}
          defaultValue={record.condition}
          id="record-input"
        />
        <span>Additional Comment :</span>
        <input
          type="text"
          ref={CommentRef}
          defaultValue={record.comment}
          id="record-input"
        />
        <span>Entered by :</span>
        <input
          type="text"
          ref={EnteredRef}
          defaultValue={record.enteredBy}
          id="record-input"
        />
      </p>
      <div className="closing-buttons">
        <button className="closing-button" onClick={updateRecordItem}>
          Save Changes
        </button>
        <button
          className="closing-button"
          onClick={() => setEditVisible(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function AddRecordButton({ setVisible }) {
  return (
    <button className="add-record" onClick={() => setVisible(true)}>
      <span>Add Record</span>
    </button>
  );
}
