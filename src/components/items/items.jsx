import React, { useEffect } from "react";
import "./items.css";
import { BiCartAdd } from "react-icons/bi";
import kush from "../../assets/kush.jpg";

export default function Items({ products, cartItems, setCartItems }) {
  const handleAddToCart = (product) => {
    const existingProduct = cartItems.find(
      (item) => item.name === product.name && item.size === product.size
    );
    if (existingProduct) {
      const updatedCart = cartItems.map((item) =>
        item.name === product.name && item.size === product.size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    alert(`"${product.name} (${product.size})" added to cart successfully!`);
  };

  useEffect(() => {
    console.log(`cart items: ${JSON.stringify(cartItems)}`);
  }, [cartItems, setCartItems]);
  return (
    <div className="items-container">
      {products.map((product, index) => (
        <div key={index} className="item">
          <div className="item-image">
            {index === 1 && (
              <>
                <img src={kush} style={{width: "100%", aspectRatio: "1/1"}} />
              </>
            )}
          </div>
          <div className="item-details">
            <p>{product.name}</p>
            <p>{product.size}</p>
            <p>ugx: {product.price}</p>
          </div>
          <button
            className="item-button"
            onClick={() => handleAddToCart(product)}
          >
            <span>
              add to cart
              <BiCartAdd size={20} style={{ marginLeft: "20px" }} />
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
