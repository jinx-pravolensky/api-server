const mongoose = require('mongoose');

const sesiLatihanSchema = new mongoose.Schema({
    namaSesi: { type: String },
    tanggal: { type: String },
    shotsPerSeries: { type: Number },
    score: { type: String },
    jumlahLubang: { type: Number },
    windage: { type: String },
    elevation: { type: String },
    meanRadius: { type: String },
    maxSpread: { type: String },
    isScanned: { type: Boolean, default: false },
    targetScanned: { type: Number, default: 0 },
    skorDetail: [Number]
});

const trainingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kategoriUtama: { type: String, required: true },
    subKategori: { type: String, required: true },
    amunisi: { type: String, required: true },
    seriesPerSession: { type: Number, required: true },
    shotsPerSeries: { type: Number, required: true },
    skorDesimal: { type: Boolean, default: false },
    sesiTembakan: [sesiLatihanSchema]
}, { timestamps: true });

module.exports = mongoose.model('Training', trainingSchema);