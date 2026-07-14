const Training = require('../models/Training');

exports.createTraining = async (req, res) => {
    try {
        const { userId, kategoriUtama, subKategori, amunisi, seriesPerSession, shotsPerSeries, skorDesimal } = req.body;
        const newTraining = await Training.create({
            userId,
            kategoriUtama,
            subKategori,
            amunisi,
            seriesPerSession,
            shotsPerSeries,
            skorDesimal,
            sesiTembakan: []
        });
        res.status(201).json({ message: "Folder Latihan berhasil dibuat!", training: newTraining });
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat Folder Latihan", error: error.message });
    }
};

exports.getTrainingsByUser = async (req, res) => {
    try {
        const trainings = await Training.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(trainings);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getTrainingById = async (req, res) => {
    try {
        const training = await Training.findById(req.params.id);
        if (!training) return res.status(404).json({ message: "Latihan tidak ditemukan" });
        res.status(200).json(training);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.addSesi = async (req, res) => {
    try {
        const { trainingId } = req.params;
        const { namaSesi, tanggal, shotsPerSeries } = req.body;
        const training = await Training.findById(trainingId);
        if (!training) return res.status(404).json({ message: "Latihan tidak ditemukan" });
        const newSesi = {
            namaSesi, tanggal, shotsPerSeries,
            score: "-", jumlahLubang: 0, windage: "0,0 mm", elevation: "0,0 mm", meanRadius: "0,0 mm", maxSpread: "0,0 mm", isScanned: false,
            targetScanned: 0, skorDetail: []
        };
        training.sesiTembakan.push(newSesi);
        await training.save();
        res.status(201).json({ message: "Sesi berhasil ditambahkan!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambah Sesi", error: error.message });
    }
};

exports.updateSesiScore = async (req, res) => {
    try {
        const { trainingId, sesiId } = req.params;
        const { score, jumlahLubang, windage, elevation, meanRadius, maxSpread, skorDetailArray } = req.body;
        const training = await Training.findById(trainingId);
        if (!training) return res.status(404).json({ message: "Latihan tidak ditemukan" });
        const sesi = training.sesiTembakan.id(sesiId);
        if (!sesi) return res.status(404).json({ message: "Sesi tidak ditemukan" });
        let currentScore = sesi.score === "-" ? 0 : parseFloat(sesi.score);
        sesi.score = (currentScore + parseFloat(score)).toString();
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
        await training.save();
        res.status(200).json({ message: "Skor berhasil disimpan!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menyimpan skor", error: error.message });
    }
};

exports.deleteTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTraining = await Training.findByIdAndDelete(id);
        if (!deletedTraining) return res.status(404).json({ message: "Latihan tidak ditemukan" });
        res.status(200).json({ message: "Data Latihan berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus Latihan", error: error.message });
    }
};