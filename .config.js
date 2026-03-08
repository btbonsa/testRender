const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,         
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

con.connect((err) => {
    if (err) {
        console.error("Database not configured correctly:", err);
    } else {
        console.log("Connected to database!");
    }
});

module.exports = con;