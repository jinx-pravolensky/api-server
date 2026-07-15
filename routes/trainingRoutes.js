const express = require('express');
const router = express.Router();

const {
  createTraining,
  getTrainingsByUser,
  getTrainingById,
  addSesi,
  updateSesiScore,
  deleteTraining,
  deleteSesi
} = require('../controllers/trainingController');

router.post('/create', createTraining);
router.get('/user/:userId', getTrainingsByUser);
router.get('/:id', getTrainingById);
router.post('/:trainingId/add-sesi', addSesi);
router.put('/:trainingId/sesi/:sesiId/update-score', updateSesiScore);
router.delete('/:id', deleteTraining);
router.delete('/:trainingId/sesi/:sesiId', deleteSesi);

module.exports = router;