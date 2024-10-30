import React, { useState, useEffect, useRef } from "react";
import "./incoming.css";
import { Dialog } from "primereact/dialog";
import { BiEdit } from "react-icons/bi";

// API URLs for your backend
const API_URL = "http://localhost:5000/api/records";
const PRODUCTS_URL = "http://localhost:5000/api/products";

export default function Incoming() {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [incomingRecords, setIncomingRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch records from the backend on component mount
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_URL}`);
        const data = await response.json();
        setIncomingRecords(data.incomingRecords);
        console.log(data.incomingRecords);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="incoming-container">
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
          incomingRecords={incomingRecords}
          setIncomingRecords={setIncomingRecords}
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
            setIncomingRecords={setIncomingRecords}
            setEditVisible={setEditVisible}
            setSelectedRecord={setSelectedRecord}
          />
        )}
      </Dialog>

      <h2>Incoming</h2>
      <div className="records">
        <div className="record-item header">
          <span style={{ width: "13rem" }}>Date & Time</span>
          <span style={{ width: "13rem" }}>Product</span>
          <span>Quantity</span>
          <span>Cost</span>
          <span>Supplied by</span>
          <span>Recorded By</span>
          <span style={{ width: "5rem" }}></span>
        </div>
        {incomingRecords.map((record, index) => (
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
      <div style={{height: "6rem"}}></div>
      <AddRecordButton setVisible={setVisible} />
    </div>
  );
}

function AddRecord({ setVisible, setIncomingRecords }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`${PRODUCTS_URL}`);
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const QuantityRef = useRef();
  const CostRef = useRef();
  const MethodRef = useRef();
  const SupplierRef = useRef();
  const ConditionRef = useRef();
  const CommentRef = useRef();
  const EnteredRef = useRef();

  const addRecordItem = async () => {
    const quantity = parseInt(QuantityRef.current.value);

    const newRecord = {
      id: Date.now().toString(),
      name: selectedProduct,
      quantity: quantity,
      cost: CostRef.current.value,
      method: MethodRef.current.value,
      supplier: SupplierRef.current.value,
      condition: ConditionRef.current.value,
      comment: CommentRef.current.value,
      enteredBy: EnteredRef.current.value,
      date: new Date().toLocaleString(),
    };

    try {
      // Send a POST request to add the record
      await fetch(`${API_URL}/incoming`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      // Update the product quantity in the backend
      await fetch(`${PRODUCTS_URL}/${selectedProduct}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantityChange: quantity }),
      });

      // Update state to re-render
      setIncomingRecords((prev) => [...prev, newRecord]);
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
        <input type="number" ref={QuantityRef} id="record-input" />
        <span>Cost :</span>
        <input type="text" ref={CostRef} id="record-input" />
        <span>Payment Method :</span>
        <input type="text" ref={MethodRef} id="record-input" />
        <span>Supplier :</span>
        <input type="text" ref={SupplierRef} id="record-input" />
        <span>Condition of Goods :</span>
        <input type="text" ref={ConditionRef} id="record-input" />
        <span>Additional Comment :</span>
        <input type="text" ref={CommentRef} id="record-input" />
        <span>Entered by :</span>
        <input type="text" ref={EnteredRef} id="record-input" />
      </p>
      <div className="closing-buttons">
        <button className="closing-button" onClick={addRecordItem}>
          Add Record
        </button>
        <button className="closing-button" onClick={() => setVisible(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function EditRecord({ record, setIncomingRecords, setEditVisible }) {
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
      await fetch(`${API_URL}/incoming/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecord),
      });

      // Update the product quantity in the backend
      await fetch(`${PRODUCTS_URL}/${record.name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: -parseInt(record.quantity) }), // Decrease the old quantity
      });

      await fetch(`${PRODUCTS_URL}/${updatedRecord.name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parseInt(updatedRecord.quantity) }), // Increase the new quantity
      });

      setIncomingRecords((prev) =>
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
          defaultValue={record.name}
          ref={NameRef}
          id="record-input"
        />
        <span>Quantity :</span>
        <input
          type="number"
          defaultValue={record.quantity}
          ref={QuantityRef}
          id="record-input"
        />
        <span>Cost :</span>
        <input
          type="text"
          defaultValue={record.cost}
          ref={CostRef}
          id="record-input"
        />
        <span>Payment Method :</span>
        <input
          type="text"
          defaultValue={record.method}
          ref={MethodRef}
          id="record-input"
        />
        <span>Supplier :</span>
        <input
          type="text"
          defaultValue={record.supplier}
          ref={SupplierRef}
          id="record-input"
        />
        <span>Condition of Goods :</span>
        <input
          type="text"
          defaultValue={record.condition}
          ref={ConditionRef}
          id="record-input"
        />
        <span>Additional Comment :</span>
        <input
          type="text"
          defaultValue={record.comment}
          ref={CommentRef}
          id="record-input"
        />
        <span>Entered by :</span>
        <input
          type="text"
          defaultValue={record.enteredBy}
          ref={EnteredRef}
          id="record-input"
        />
      </p>
      <div className="closing-buttons">
        <button className="closing-button" onClick={updateRecordItem}>
          Update Record
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
