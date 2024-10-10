const mysql = require('mysql');

// change database, port, user, password
const pool = mysql.createPool({
  connectionLimit: 10, 
  database: "test",
  host: "localhost",
  port: "5005",
  user: "root",
  password: "root"
});

const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(connection);
    });
  });
};

module.exports = getConnection;
