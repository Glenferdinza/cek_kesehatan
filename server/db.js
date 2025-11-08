const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'asya2105', //sesuaiin aja sama passmu pli
  database: process.env.DB_NAME || 'cek_kesehatan', //ini buatnya langsung copas aja dari schema.sqlnya
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
