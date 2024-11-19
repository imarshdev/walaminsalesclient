import React, { useState } from "react";
import useLocalStorageState from "../../context/useLocalStorage";
import StoreHome from "./Home.jsx";
import Products from "./Products.jsx";
import Customers from "./Customers.jsx";
import "./store.css";

export default function Store() {
  const [page, setPage] = useLocalStorageState("page", "home");

  return (
    <div className="store-container">
      <h3
        style={{
          width: "60%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p
          onClick={() => setPage("home")}
          style={{
            borderBottom: page === "home" ? "solid 1px black" : "",
            width: "12rem",
          }}
        >
          Store Home
        </p>
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
          Store Customers
        </p>
      </h3>
      {page === "home" && <StoreHome />}
      {page === "products" && <Products />}
      {page === "customers" && <Customers />}
    </div>
  );
}
