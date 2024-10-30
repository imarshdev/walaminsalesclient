import React from "react";
import "./sales.css";
import useLocalStorageState from "../../context/useLocalStorage";
import Incoming from "../records/incoming/incoming";
import Outgoing from "../records/outgoing/outgoing";
import Store from "../store/store";

export default function SalesPage() {
  const [sales, setSales] = useLocalStorageState("sales", 1);
  return (
    <div className="sales-container">
      <h3>Walamin Sales</h3>
      <div className="sales-table-nav">
        <button
          id={sales === 1 ? "open" : ""}
          className="nav-button"
          onClick={() => setSales(1)}
        >
          <p>Incoming</p>
        </button>
        <button
          id={sales === 2 ? "open" : ""}
          className="nav-button"
          onClick={() => setSales(2)}
        >
          <p>Outgoing</p>
        </button>
        <button
          id={sales === 3 ? "open" : ""}
          className="nav-button"
          onClick={() => setSales(3)}
        >
          <p>Store</p>
        </button>
      </div>
      {sales === 1 && <Incoming />}
      {sales === 2 && <Outgoing />}
      {sales === 3 && <Store />}
    </div>
  );
}
