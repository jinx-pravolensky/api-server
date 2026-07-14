const express = require('express');
const router = express.Router();

const {
  createMatch,
  getMatchesByAdmin,
  getMatchById,
  addRanting,
  addPeserta,
  getMatchesByJuri,
  addSesi,
  updateSesiScore,
  deleteMatch,
  shareMatch,
  deleteSesi
} = require('../controllers/matchController');

router.post('/create-match', createMatch);
router.get('/admin/:adminId', getMatchesByAdmin);
router.get('/juri/:juriId', getMatchesByJuri);
router.get('/:id', getMatchById);
router.post('/:matchId/add-ranting', addRanting);
router.post('/:matchId/ranting/:rantingId/add-peserta', addPeserta);
router.post('/:matchId/ranting/:rantingId/peserta/:pesertaId/add-sesi', addSesi);
router.put('/:matchId/ranting/:rantingId/peserta/:pesertaId/sesi/:sesiId/update-score', updateSesiScore);
router.delete('/:id', deleteMatch);
router.post('/:matchId/share', shareMatch);
router.delete('/:matchId/ranting/:rantingId/peserta/:pesertaId/sesi/:sesiId', deleteSesi);

module.exports = router;