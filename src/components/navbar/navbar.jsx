import React from "react";
import "./navbar.css";
import img from "../../assets/react.svg";
import { CiShoppingCart } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export default function Navbar({ cartItems }) {
  const navigate = useNavigate();
  return (
    <div className="nav-container">
      <span id="main-name" className="nav-item">
        <img src={img} width={24} alt="" />
        <span>walamin</span>
      </span>
      <span className="nav-item">
        <span className="nav-item-inner">home</span>
        <span className="nav-item-inner">SHOPPING</span>
        <span className="nav-item-inner">about</span>
      </span>
      <span className="nav-item" onClick={() => navigate("/cart")}>
        <span className="nav-item-inner">
          <span className="nav-cart-number">{cartItems.length}</span>
          <CiShoppingCart size={30} color="green" />
        </span>
        <span>Your Cart</span>
      </span>
    </div>
  );
}
