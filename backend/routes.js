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
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  db.query(
    "SELECT id, filename, original_name, file_type, file_url, uploaded_at FROM uploaded_files",
    (dbErr, dbRows) => {
      if (dbErr) return res.status(500).json(dbErr);
      const dir = path.join(__dirname, "uploads");
      let fsRows = [];
      try {
        const names = fs.readdirSync(dir);
        const dbNames = new Set((dbRows || []).map((r) => r.filename));
        fsRows = names
          .filter((n) => !dbNames.has(n))
          .map((n) => {
            const fp = path.join(dir, n);
            const stat = fs.statSync(fp);
            const ext = path.extname(n).toLowerCase();
            const isImg = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"].includes(ext);
            return {
              id: null,
              filename: n,
              original_name: n,
              file_type: isImg ? "image/" + (ext.replace(".", "") || "png") : "file",
              file_url: `http://localhost:5000/uploads/${n}`,
              uploaded_at: stat.mtime
            };
          });
      } catch (e) {
        fsRows = [];
      }
      const combined = [...dbRows, ...fsRows].sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
      const total = combined.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const start = (page - 1) * limit;
      const items = combined.slice(start, start + limit);
      res.json({
        items,
        page,
        pageSize: limit,
        total,
        totalPages
      });
    }
  );
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

router.delete("/files/by-filename/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);
  fs.unlink(filePath, () => {
    db.query("DELETE FROM uploaded_files WHERE filename=?", [filename], () => {
      res.json({ message: "Deleted successfully" });
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
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10) || 10;

  if (!isNaN(page) && page > 0) {
    const offset = (page - 1) * limit;
    db.query("SELECT COUNT(*) AS total FROM documents", (countErr, countRows) => {
      if (countErr) return res.status(500).json(countErr);
      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      db.query(
        "SELECT id, title, created_at FROM documents ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [limit, offset],
        (listErr, rows) => {
          if (listErr) return res.status(500).json(listErr);
          res.json({
            items: rows,
            page,
            pageSize: limit,
            total,
            totalPages,
          });
        }
      );
    });
  } else {
    db.query(
      "SELECT id, title, created_at FROM documents ORDER BY created_at DESC",
      (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
      }
    );
  }
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
