const mongoose = require('mongoose');

const sesiSchema = new mongoose.Schema({
  namaSesi: { type: String },
  tanggal: { type: String },
  juriName: { type: String },
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

const pesertaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  bib: { type: String, required: true },
  gender: { type: String, required: true },
  provinsi: { type: String, required: true },
  kota: { type: String, required: true },
  sesiTembakan: [sesiSchema]
});

const rantingSchema = new mongoose.Schema({
  kategoriUtama: { type: String, required: true },
  subKategori: { type: String, required: true },
  amunisi: { type: String, required: true },
  seriesPerSession: { type: Number, required: true },
  shotsPerSeries: { type: Number, required: true },
  kategoriPeserta: { type: String, required: true },
  skorDesimal: { type: Boolean, default: false },
  juriIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  peserta: [pesertaSchema]
});

const matchSchema = new mongoose.Schema({
  matchCustomId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  organizer: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedAdminIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  ranting: [rantingSchema],
  status: { type: String, enum: ['draft', 'ongoing', 'finished'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);