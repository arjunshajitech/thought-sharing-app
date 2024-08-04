const { v4: uuidv4 } = require('uuid');
const getConnection = require("../connection");

const saveThought = async (text, email, hash) => {
    let con;
    try {
        con = await getConnection();

        const newThought = {
            id: uuidv4(),
            text: text,
            email: email,
            hash: hash
        };

        await query(con, 'INSERT INTO thoughts SET ?', newThought);
        return newThought;
    } finally {
        if (con) con.release();
    }
};

const getAllThoughts = async () => {
    let con;
    try {
        con = await getConnection();

        const results = await query(con, 'SELECT * FROM thoughts');
        return results;
    } finally {
        if (con) con.release();
    }
};

const getThoughtsByEmail = async (email) => {
    let con;
    try {
        con = await getConnection();

        const results = await query(con, 'SELECT * FROM thoughts WHERE email = ?', [email]);
        return results;
    } finally {
        if (con) con.release();
    }
};

const deleteThoughtById = async (id) => {
    let con;
    try {
        con = await getConnection();

        await query(con, 'DELETE FROM thoughts WHERE id = ?', [id]);
    } finally {
        if (con) con.release();
    }
};

const deleteThoughtByEmail = async (email) => {
    let con;
    try {
        con = await getConnection();

        await query(con, 'DELETE FROM thoughts WHERE email = ?', [email]);
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

module.exports = {
    saveThought,
    getAllThoughts,
    getThoughtsByEmail,
    deleteThoughtById,
    deleteThoughtByEmail
};
