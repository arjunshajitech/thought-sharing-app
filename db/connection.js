const mysql = require('mysql');


const pool = mysql.createPool({
  connectionLimit: 10, 
  database: "mydb",
  host: "localhost",
  port: "5001",
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
