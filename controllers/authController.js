const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secretkey123';  // Ganti dengan secret yang lebih kuat di produksi

// Controller untuk login
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: "Error verifying password" });
            }

            if (!isMatch) {
                return res.status(400).json({ error: "Invalid password" });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: "Login successful", token });
        });
    });
};

// Controller untuk register
exports.register = (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ error: "All fields (username, email, password, role) are required" });
    }

    // Hash password sebelum disimpan
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password" });
        }

        const query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
        db.query(query, [username, email, hashedPassword, role], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({ message: "User registered successfully" });
        });
    });
};
