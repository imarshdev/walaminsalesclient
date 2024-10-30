import React, { useEffect } from "react";
import "./cart.css";
import useLocalStorageState from "../../context/useLocalStorage";
import { BiCartAdd } from "react-icons/bi";
import { MdAdd, MdRemove } from "react-icons/md";

export default function Cart() {
  const [cartItems, setCartItems] = useLocalStorageState("cartItems", []);
  // Function to update quantity
  const handleQuantityUpdate = (index, type) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index
        ? type === "increment"
          ? { ...item, quantity: item.quantity + 1 }
          : { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(updatedCart);
  };

  // Function to remove item from cart
  const handleRemoveItem = (index) => {
    const updatedCart = cartItems.filter((item, i) => i !== index);
    setCartItems(updatedCart);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <p style={{ color: "orange" }}>
        {cartItems.length != 0 ? "" : "Your cart is empty"}
      </p>
      {cartItems.map((cartItem, index) => (
        <div key={index} className="cart-item">
          <div className="cart-item-image"></div>
          <div className="cart-item-details">
            <p>
              {cartItem.name}
              <br />
              {cartItem.size}
              <br />
              ugx: {cartItem.price * cartItem.quantity}
            </p>
            <p>
              Quantity: {cartItem.quantity} <br /> <br />
              <button
                className="Add-quantity"
                onClick={() => handleQuantityUpdate(index, "increment")}
              >
                <MdAdd />
              </button>
              <button
                className="Add-quantity"
                onClick={() => handleQuantityUpdate(index, "decrement")}
              >
                <MdRemove />
              </button>
            </p>
            <button
              className="cart-item-button"
              onClick={() => handleRemoveItem(index)}
            >
              <span>
                remove from cart
                <BiCartAdd size={20} style={{ marginLeft: "20px" }} />
              </span>
            </button>
          </div>
        </div>
      ))}
      <br />
      <br />
      <p>Total: UGX {totalPrice}</p>
      <button className="checkout-button">
        <p>Checkout</p>
      </button>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
