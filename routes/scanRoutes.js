const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { processScan } = require('../controllers/scanController');

const uploadDir = './uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("📁 Folder 'uploads' berhasil dibuat otomatis!");
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'scan-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/analyze', upload.single('targetImage'), processScan);

module.exports = router;