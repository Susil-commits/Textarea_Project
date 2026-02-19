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

// Global handler: on 401 clear auth and redirect to login
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err && err.response && err.response.status === 401) {
      localStorage.removeItem("dm_auth");
      delete axios.defaults.headers.common["Authorization"];
      // force navigate to login
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/documents", element: <DocumentsPage /> },
  { path: "/documents/:id", element: <ViewDocumentPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
