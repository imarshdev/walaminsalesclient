import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SalesPage from "./salesRecords/sales/sales.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SalesPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
