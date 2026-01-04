const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ================= UPLOAD FILE ================= */

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { filename, originalname, mimetype } = req.file;
  const fileUrl = `http://localhost:5000/uploads/${filename}`;

  const sql = `
    INSERT INTO uploaded_files 
    (filename, original_name, file_type, file_url)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [filename, originalname, mimetype, fileUrl], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      id: result.insertId,
      original_name: originalname,
      file_type: mimetype,
      file_url: fileUrl
    });
  });
});

/* ================= GET ALL FILES ================= */

router.get("/files", (req, res) => {
  db.query("SELECT * FROM uploaded_files ORDER BY uploaded_at DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* ================= DELETE FILE ================= */

router.delete("/files/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT filename FROM uploaded_files WHERE id=?", [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "uploads", rows[0].filename);

    fs.unlink(filePath, (unlinkErr) => {
      // Even if file doesn't exist on disk, remove from DB
      db.query("DELETE FROM uploaded_files WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted successfully" });
      });
    });
  });
});

/* ================= SAVE DOCUMENT ================= */

router.post("/documents", (req, res) => {
  const { title, content } = req.body;

  const sql = "INSERT INTO documents (title, content) VALUES (?, ?)";
  db.query(sql, [title, JSON.stringify(content)], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId });
  });
});

/* ================= GET DOCUMENTS ================= */

router.get("/documents", (req, res) => {
  db.query(
    "SELECT id, title, created_at FROM documents ORDER BY created_at DESC",
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* ================= GET SINGLE DOCUMENT ================= */

router.get("/documents/:id", (req, res) => {
  db.query(
    "SELECT * FROM documents WHERE id=?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0) return res.status(404).json({ message: "Not found" });

      const doc = rows[0];
      // Check if content is string before parsing
      if (typeof doc.content === 'string') {
          try {
              doc.content = JSON.parse(doc.content);
          } catch (e) {
              console.error("Error parsing JSON content:", e);
              // Handle error or keep as is? 
              // If it's not valid JSON, it might be legacy data or empty. 
              // ReactQuill expects a delta object or string, if it's a string it might work if it's html, 
              // but here we are storing delta as JSON string.
          }
      }
      res.json(doc);
    }
  );
});

module.exports = router;
