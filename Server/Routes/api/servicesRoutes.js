const express = require('express');
const router = express.Router();
const servicesController = require('../../Controllers/servicesController');

router.get('/', servicesController.getAllServices);
router.get('/new', servicesController.getNewServiceForm);
router.post('/', servicesController.createService);
router.get('/:id', servicesController.getServiceById);
router.get('/:id/edit', servicesController.getEditServiceForm);
router.put('/:id', servicesController.updateService);
router.delete('/:id', servicesController.deleteService);

module.exports = router;