const db = require('../config/db');  // Koneksi ke database MySQL
const path = require('path');  // Menambahkan path untuk menangani path file
const fs = require('fs');  // Menambahkan fs untuk menghapus file

// Controller untuk menangani request POST untuk program (menambahkan program)
exports.createProgram = (req, res) => {
    const { title, description } = req.body;  // Ambil data dari body
    const image = req.file ? req.file.filename : null;  // Ambil nama file gambar jika ada
    const createdBy = req.user.id

    // Validasi input
    if (!title || !description || !image) {
        return res.status(400).json({ error: "All fields (title, description, image) are required" });
    }

    // Query untuk menyimpan data program ke database
    const query = "INSERT INTO programs (title, description, image, created_by) VALUES (?, ?, ?, ?)";
    db.query(query, [title, description, image, createdBy], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Jika berhasil, kirim response dengan data yang baru saja dimasukkan
        res.status(201).json({
            id: results.insertId, 
            title, 
            description, 
            image,
            created_by: createdBy
        });
    });
};

// Controller untuk menangani request DELETE untuk menghapus program
exports.deleteProgram = (req, res) => {
    const programId = req.params.id;  // ID program yang ingin dihapus

    // Query untuk mendapatkan nama file gambar program berdasarkan ID
    const query = "SELECT image FROM programs WHERE id = ?";
    db.query(query, [programId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Program not found" });
        }

        const imagePath = path.join(__dirname, '..', 'uploads', results[0].image);  // Path ke file gambar

        // Hapus gambar fisik dari server
        fs.unlink(imagePath, (err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to delete image" });
            }

            // Setelah gambar dihapus, hapus data program dari database
            const deleteQuery = "DELETE FROM programs WHERE id = ?";
            db.query(deleteQuery, [programId], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(200).json({ message: "Program and image deleted successfully" });
            });
        });
    });
};

// Controller untuk menangani request GET untuk mengambil semua program
exports.getAllPrograms = (req, res) => {
    // Query untuk mengambil semua data program dari database
    const query = "SELECT * FROM programs";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Mengirimkan response dengan semua program
        res.status(200).json(results);
    });
};
