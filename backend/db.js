const mysql = require("mysql2");

// Connect initially without database to ensure we can create it if missing
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Susil@2004",
  multipleStatements: true // Enable multiple statements for initialization
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("MySQL connected");

  const initSql = `
    CREATE DATABASE IF NOT EXISTS quill_db;
    USE quill_db;
    
    CREATE TABLE IF NOT EXISTS uploaded_files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      file_type VARCHAR(100),
      file_url VARCHAR(500),
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(initSql, (err) => {
    if (err) {
      console.error("Database initialization failed:", err);
    } else {
      console.log("Database 'quill_db' and tables are ready.");
    }
  });
});

module.exports = db;
