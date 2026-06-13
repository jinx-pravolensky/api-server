const Match = require('../models/Match');

exports.createMatch = async (req, res) => {
  try {
    const { matchCustomId, title, location, date, organizer, adminId } = req.body;
    const matchExists = await Match.findOne({ matchCustomId });
    if (matchExists) return res.status(400).json({ message: "ID Match sudah digunakan! Gunakan ID lain." });

    const newMatch = await Match.create({
      matchCustomId, title, location, date, organizer, adminId, ranting: [], sharedAdminIds: []
    });
    res.status(201).json({ message: "Pertandingan berhasil dibuat!", match: newMatch });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat pertandingan", error: error.message });
  }
};

exports.getMatchesByAdmin = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { adminId: req.params.adminId },
        { sharedAdminIds: req.params.adminId }
      ]
    })
      .populate('adminId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('ranting.juriIds', '-password')
      .populate('adminId', 'name');
    if (!match) return res.status(404).json({ message: "Pertandingan tidak ditemukan" });
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.shareMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { adminIds } = req.body;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Pertandingan tidak ditemukan" });
    adminIds.forEach(id => {
      if (!match.sharedAdminIds.includes(id) && match.adminId.toString() !== id) {
        match.sharedAdminIds.push(id);
      }
    });

    await match.save();
    res.status(200).json({ message: "Pertandingan berhasil dibagikan!", match });
  } catch (error) {
    res.status(500).json({ message: "Gagal membagikan pertandingan", error: error.message });
  }
};

exports.addRanting = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { kategoriUtama, subKategori, amunisi, seriesPerSession, shotsPerSeries, kategoriPeserta, skorDesimal, juriIds } = req.body;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Pertandingan tidak ditemukan" });

    const newRanting = {
      kategoriUtama, subKategori, amunisi, seriesPerSession, shotsPerSeries, kategoriPeserta, skorDesimal, juriIds, peserta: []
    };

    match.ranting.push(newRanting);
    await match.save();
    res.status(201).json({ message: "Ranting berhasil ditambahkan!", match });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah ranting", error: error.message });
  }
};

exports.addPeserta = async (req, res) => {
  try {
    const { matchId, rantingId } = req.params;
    const { nama, bib, gender, provinsi, kota } = req.body;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Pertandingan tidak ditemukan" });

    const rantingIndex = match.ranting.findIndex(r => r._id.toString() === rantingId);
    if (rantingIndex === -1) return res.status(404).json({ message: "Ranting tidak ditemukan" });

    const newPeserta = { nama, bib, gender, provinsi, kota, sesiTembakan: [] };
    match.ranting[rantingIndex].peserta.push(newPeserta);
    await match.save();
    res.status(201).json({ message: "Peserta berhasil ditambahkan!", match });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah peserta", error: error.message });
  }
};

exports.getMatchesByJuri = async (req, res) => {
  try {
    const juriId = req.params.juriId;
    const matches = await Match.find({ "ranting.juriIds": { $in: [juriId] } })
      .populate('ranting.juriIds', '-password')
      .populate('adminId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.addSesi = async (req, res) => {
  try {
    const { matchId, rantingId, pesertaId } = req.params;
    const { namaSesi, tanggal, juriName, shotsPerSeries } = req.body;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match tidak ditemukan" });

    const ranting = match.ranting.id(rantingId);
    const peserta = ranting.peserta.id(pesertaId);
    const newSesi = {
      namaSesi, tanggal, juriName, shotsPerSeries,
      score: "-", jumlahLubang: 0, windage: "0,0 mm", elevation: "0,0 mm", meanRadius: "0,0 mm", maxSpread: "0,0 mm", isScanned: false,
      targetScanned: 0,
      skorDetail: []
    };

    peserta.sesiTembakan.push(newSesi);
    await match.save();

    res.status(201).json({ message: "Sesi berhasil ditambahkan!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah Sesi", error: error.message });
  }
};

exports.updateSesiScore = async (req, res) => {
  try {
    const { matchId, rantingId, pesertaId, sesiId } = req.params;
    const { score, jumlahLubang, windage, elevation, meanRadius, maxSpread, skorDetailArray } = req.body;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match tidak ditemukan" });

    const ranting = match.ranting.id(rantingId);
    const peserta = ranting.peserta.id(pesertaId);
    const sesi = peserta.sesiTembakan.id(sesiId);

    let currentScore = sesi.score === "-" ? 0 : parseInt(sesi.score);
    sesi.score = (currentScore + parseInt(score)).toString();

    sesi.jumlahLubang = (sesi.jumlahLubang || 0) + parseInt(jumlahLubang);
    sesi.targetScanned = (sesi.targetScanned || 0) + 1;

    if (skorDetailArray && Array.isArray(skorDetailArray)) {
      if (!sesi.skorDetail) sesi.skorDetail = [];
      sesi.skorDetail.push(...skorDetailArray);
    }

    sesi.windage = windage;
    sesi.elevation = elevation;
    sesi.meanRadius = meanRadius;
    sesi.maxSpread = maxSpread;
    sesi.isScanned = true;

    await match.save();
    res.status(200).json({ message: "Nilai berhasil disimpan & diakumulasi!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan nilai", error: error.message });
  }
};

exports.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMatch = await Match.findByIdAndDelete(id);
    if (!deletedMatch) return res.status(404).json({ message: "Pertandingan tidak ditemukan" });
    res.status(200).json({ message: "Data Pertandingan dan seluruh isinya berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus pertandingan", error: error.message });
  }
};