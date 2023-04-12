const mysql = require('mysql2/promise');
const dbConfig = require('../configs/db.config');
let connection = null

// Hàm query sử dụng để thực thi các truy vấn đến CSDL.
async function query(sql, params) {
  connection = connection || await mysql.createConnection(dbConfig);
  const [results, ] = await connection.execute(sql, params);
  return results;
}

module.exports = {
  query,
}