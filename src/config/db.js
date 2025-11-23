const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 3308,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ekspor pool agar bisa dipakai di controller
module.exports = pool;