const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const multer = require('multer');
const path = require('path');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');  // Impor middleware

// Set storage engine untuk multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Folder tempat menyimpan file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Nama file unik
    }
});

const upload = multer({ storage: storage });

// Rute CRUD untuk program
router.get('/', programController.getAllPrograms);

// Hanya admin yang bisa menambah program
router.post('/', verifyToken, verifyAdmin, upload.single('image'), programController.createProgram);

// Hanya admin yang bisa menghapus program
router.delete('/:id', verifyToken, verifyAdmin, programController.deleteProgram);

module.exports = router;
