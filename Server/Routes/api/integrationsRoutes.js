const express = require('express');
const router = express.Router();
const integrationsController = require('../../Controllers/integrationsController');

router.get('/', integrationsController.getAllIntegrations);
router.get('/new', integrationsController.createNewIntegration); 
router.post('/', integrationsController.createNewIntegrationPOST);        
router.get('/:id', integrationsController.getIntegrationById);
router.get('/:id/edit', integrationsController.updateIntegration);  
router.put('/:id', integrationsController.updateIntegrationPOST);            
router.delete('/:id', integrationsController.deleteIntegration);

module.exports = router;