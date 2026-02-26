const express = require('express');
const router = express.Router();
const settingsController = require('../../Controllers/settingsController');

router.get('/', settingsController.getAllSettings);
router.get('/:group', settingsController.getSettingsByGroup);
router.get('/key/:key', settingsController.getSettingByKey);
router.post('/key/:key', settingsController.updateSettingByKey);
router.post('/bulk', settingsController.updateSettingsBulk);

module.exports = router;