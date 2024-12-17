import React, { useState } from "react";
import "./sales.css";
import useLocalStorageState from "../../context/useLocalStorage";
import Incoming from "../records/incoming/incoming";
import Outgoing from "../records/outgoing/outgoing";
import Store from "../store/store";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";

export default function SalesPage() {
  const [focused, setFocused] = useState(false);
  const [sales, setSales] = useLocalStorageState("sales", 1);
  const [username, setUsername] = useLocalStorageState("username", "");
  const navigate = useNavigate();
  const clearStorage = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="sales-container">
      <h3
        style={{
          width: "95%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>user: {username ? username : "no user"}</span>
        Walamin Sales
        <span style={{ cursor: "pointer" }} onClick={clearStorage}>
          Log Out
        </span>
      </h3>
      <div className="sales-table-nav">
        <IconField iconPosition="left" style={{ width: "75%" }}>
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            placeholder="Search Store"
            onFocus={() => setFocused(true)}
            style={{ width: "100%" }}
          />
        </IconField>
      </div>
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
