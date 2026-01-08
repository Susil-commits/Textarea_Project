import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DocumentsPage from "./pages/DocumentsPage";
import ViewDocumentPage from "./pages/ViewDocumentPage";
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/documents", element: <DocumentsPage /> },
  { path: "/documents/:id", element: <ViewDocumentPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
