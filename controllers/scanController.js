const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

exports.processScan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Gambar tidak ditemukan! Tolong foto ulang." });
    }

    console.log(`[NODE.JS] Menerima gambar dari Flutter: ${req.file.originalname}`);
    console.log(`[NODE.JS] Foto telah disimpan di: ${req.file.path}`);
    console.log(`[NODE.JS] Meneruskan foto ke Otak Sniper Python (Port 5000)...`);

    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));
    const discipline = req.body.discipline || 'rifle';
    formData.append('discipline', discipline);
    const pythonApiUrl = 'http://127.0.0.1:5000/api/scan';
    const pythonResponse = await axios.post(pythonApiUrl, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log("[NODE.JS] Jawaban dari Python Diterima! Mengirim JSON balik ke HP Juri.");
    res.status(200).json({
      message: "Scan Berhasil!",
      ballistic: pythonResponse.data.ballistic,
      holes: pythonResponse.data.holes,
      processed_image: pythonResponse.data.processed_image,
      target_center: pythonResponse.data.target_center,
      pixel_per_mm: pythonResponse.data.pixel_per_mm,
      disiplin: pythonResponse.data.disiplin
    });

  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(`[NODE.JS] Meneruskan Peringatan AI: ${JSON.stringify(error.response.data)}`);
      return res.status(400).json(error.response.data);
    }

    console.error("❌ [ERROR API PYTHON]:", error.message);
    res.status(500).json({ message: "Gagal terhubung ke AI Python", error: error.message });
  }
};