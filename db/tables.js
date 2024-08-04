const getConnection = require("./connection");

const USERS_TABLE = `
    CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;

const THOUGHTS_TABLE = `
    CREATE TABLE IF NOT EXISTS thoughts (
        id VARCHAR(36) PRIMARY KEY,
        text TEXT NOT NULL,
        email VARCHAR(255) NOT NULL,
        likes INT DEFAULT 0,
        dislikes INT DEFAULT 0,
        hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

getConnection().then((con) => {

  con.query(USERS_TABLE, function (err, result) {
    if (err) throw err;
    console.log("Users table created.");
  });

  con.query(THOUGHTS_TABLE, function (err, result) {
    if (err) throw err;
    console.log("Thoughts table created.");
  });

  con.release();
})
