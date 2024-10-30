import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/navbar/navbar";
import Intro, { IntroCarousel } from "./components/intro/intro";
import Items from "./components/items/items";
import products from "./assets/products.json";
import useLocalStorageState from "./context/useLocalStorage";

function App() {
  const [cartItems, setCartItems] = useLocalStorageState("cartItems", []);
  return (
    <div className="container">
      <Navbar cartItems={cartItems} />
      <Intro />
      <IntroCarousel />
      <Items
        products={products}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </div>
  );
}

export default App;
