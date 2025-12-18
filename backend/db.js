const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Type Passcode Here',
  database: 'quill_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

module.exports = db;
