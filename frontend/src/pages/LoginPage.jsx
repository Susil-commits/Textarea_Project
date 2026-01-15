import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const safeUser = escapeHTML(username);
    const authToken = btoa(`${username}:${password}`);
    localStorage.setItem("dm_auth", authToken);
    axios.defaults.headers.common["Authorization"] = `Basic ${authToken}`;
    try {
      // Probe a protected endpoint
      await axios.get("http://localhost:5000/api/documents?page=1&limit=1");
      navigate("/documents");
    } catch (err) {
      localStorage.removeItem("dm_auth");
      delete axios.defaults.headers.common["Authorization"];
      setError("Authentication failed. Please check credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-md mx-auto mt-24 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h1 className="text-xl font-bold mb-4">Sign In</h1>
        {error && <div className="mb-3 text-sm text-red-600">{escapeHTML(error)}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
