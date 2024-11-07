import { useEffect, useState } from "react";
import "./App.css";

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
