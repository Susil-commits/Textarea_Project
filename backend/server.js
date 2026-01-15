const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
// Basic authentication middleware with HTML special character escaping
function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="DocManager"');
    return res.status(401).json({ message: "Unauthorized" });
  }
  const encoded = header.slice(6).trim();
  let decoded = "";
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    return res.status(400).json({ message: "Invalid authorization encoding" });
  }
  const sep = decoded.indexOf(":");
  const user = sep >= 0 ? decoded.slice(0, sep) : decoded;
  const pass = sep >= 0 ? decoded.slice(sep + 1) : "";
  const expectedUser = process.env.DOCMGR_USER || "admin";
  const expectedPass = process.env.DOCMGR_PASS || "admin";
  if (user !== expectedUser || pass !== expectedPass) {
    res.setHeader("WWW-Authenticate", 'Basic realm="DocManager"');
    return res.status(401).json({ message: "Unauthorized", user: escapeHTML(user) });
  }
  // Store sanitized username for downstream usage if needed
  req.authUser = escapeHTML(user);
  next();
}

// Protect API routes
app.use("/api", requireAuth, require("./routes"));
// If you need public endpoints later, mount them before the auth middleware.

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
