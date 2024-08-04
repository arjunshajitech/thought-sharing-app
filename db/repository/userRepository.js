const { v4: uuidv4 } = require('uuid');
const getConnection = require("../connection"); 

const saveUser = async (name, email, password) => {
  let con;
  try {
    con = await getConnection(); 

    const newUser = {
      id: uuidv4(),
      name: name,
      email: email,
      password: password
    };

    await query(con, 'INSERT INTO users SET ?', newUser);
    return newUser;
  } finally {
    if (con) con.release();
  }
};

const findUserByEmail = async (email) => {
  let con;
  try {
    con = await getConnection(); 

    const results = await query(con, 'SELECT * FROM users WHERE email = ?', [email]);
    return results.length > 0 ? results[0] : null;
  } finally {
    if (con) con.release(); 
  }
};


function query(connection, sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = { findUserByEmail, saveUser };
