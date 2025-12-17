const express = require('express');
const router = express.Router();
const db = require('./db');
const multer = require('multer');
const path = require('path');

/* ---------------- IMAGE UPLOAD ---------------- */

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    url: `http://localhost:5000/uploads/${req.file.filename}`
  });
});

/* ---------------- CRUD ---------------- */

router.post('/save', (req, res) => {
  const { content } = req.body;
  db.query(
    'INSERT INTO editor_content (content) VALUES (?)',
    [content],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Saved' });
    }
  );
});

router.get('/all', (req, res) => {
  db.query(
    'SELECT id, created_at FROM editor_content ORDER BY id DESC',
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

router.get('/:id', (req, res) => {
  db.query(
    'SELECT content FROM editor_content WHERE id=?',
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows[0]);
    }
  );
});

router.delete('/:id', (req, res) => {
  db.query(
    'DELETE FROM editor_content WHERE id=?',
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Deleted' });
    }
  );
});

module.exports = router;
