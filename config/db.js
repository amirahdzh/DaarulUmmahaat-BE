require('dotenv').config();  // Mengimpor dotenv untuk membaca file .env

const mysql = require('mysql');

// Setup koneksi ke database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,  // Menggunakan password dari .env
    database: process.env.DB_NAME  // Menggunakan nama database dari .env
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

module.exports = db;
