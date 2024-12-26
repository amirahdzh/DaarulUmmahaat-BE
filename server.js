const express = require('express');
const app = express();
const programsRoutes = require('./routes/programs');  // Mengimpor rute untuk program
const port = 3000

// Middleware untuk menangani data form dan JSON
app.use(express.urlencoded({ extended: true }));  // Untuk URL encoded (misalnya untuk form biasa)
app.use(express.json());  // Untuk menerima JSON (Jika perlu)

// Gunakan routing dari programs.js di bawah path /api/programs
app.use('/api/programs', programsRoutes);

// Mulai server
app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`)
  })
