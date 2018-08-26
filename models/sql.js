const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'xxx',
  user: 'tippspiel',
  password: 'xxx',
  port: 3306,
  database: "tippspiel"
});

pool.getConnection(function(err, connection) {});

module.exports = pool;