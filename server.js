require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const matchRoutes = require('./routes/matchRoutes');
const scanRoutes = require('./routes/scanRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/match', matchRoutes);
app.use('/api/scan', scanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server Berhasil Diaktifkan!`);
  console.log(`🚀 Server telah berjalan di http://localhost:${PORT}`);
});