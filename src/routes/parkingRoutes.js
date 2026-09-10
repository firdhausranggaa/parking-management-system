const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const authorizeRole = require('../middleware/authorizeRole');

router.get('/statistik', authorizeRole('admin'), parkingController.getStatistik);

router.post('/in', authorizeRole('admin', 'operator'), parkingController.kendaraanMasuk);
router.put('/out/:id', authorizeRole('admin', 'operator'), parkingController.kendaraanKeluar);
router.get('/', authorizeRole('admin', 'operator'), parkingController.lihatSemuaParkir);
router.delete('/:id', authorizeRole('admin'), parkingController.hapusDataParkir);

module.exports = router;