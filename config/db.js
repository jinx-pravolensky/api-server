const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📊 Berhasil Terhubung ke Database!');
  } catch (error) {
    console.error('❌ Gagal koneksi ke MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;