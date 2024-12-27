const express = require('express');
const cors = require('cors');  // Import cors
const app = express();
const path = require('path');
const programsRoutes = require('./routes/programs');  // Mengimpor rute untuk program
const authRoutes = require('./routes/auth');  // Mengimpor rute untuk login
const port = 3000;

// Middleware CORS
// Gunakan CORS Middleware
app.use(cors({
    origin: 'http://localhost:8080',  // Izinkan hanya origin ini
    methods: ['GET', 'POST', 'DELETE'],  // Izinkan metode yang dibutuhkan
    allowedHeaders: ['Content-Type', 'Authorization'],  // Izinkan header tertentu
  }));

// Middleware untuk menangani data form dan JSON
// app.use(express.urlencoded({ extended: true }));  // Untuk URL encoded (misalnya untuk form biasa)
app.use(express.json());  // Untuk menerima JSON (Jika perlu)

// Middleware untuk folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Gunakan routing dari auth.js untuk login
app.use('/api/auth', authRoutes);

// Gunakan routing dari programs.js di bawah path /api/programs
app.use('/api/programs', programsRoutes);

// Mulai server
app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`)
});
