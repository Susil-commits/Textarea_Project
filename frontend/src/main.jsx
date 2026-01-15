import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DocumentsPage from "./pages/DocumentsPage";
import ViewDocumentPage from "./pages/ViewDocumentPage";
import LoginPage from "./pages/LoginPage";
import "./index.css";

// Attach Authorization header from localStorage if present
const auth = localStorage.getItem("dm_auth");
if (auth) {
  axios.defaults.headers.common["Authorization"] = `Basic ${auth}`;
}

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/documents", element: <DocumentsPage /> },
  { path: "/documents/:id", element: <ViewDocumentPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
