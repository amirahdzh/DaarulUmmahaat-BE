const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secretkey123';  // Ganti dengan secret yang lebih kuat di produksi

// Middleware untuk memverifikasi token JWT
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];  // Ambil token dari header

    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Simpan data user yang terverifikasi di request untuk digunakan di route berikutnya
        req.user = decoded;
        next();
    });
};

// Middleware untuk memverifikasi apakah user adalah admin
exports.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admins only" });
    }
    next();
};
