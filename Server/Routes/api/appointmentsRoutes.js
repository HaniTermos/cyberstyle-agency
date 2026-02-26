const express = require('express');
const router = express.Router();
const appointmentsController = require('../../Controllers/appointmentsController');


router.get('/', appointmentsController.getAllAppointments);
router.get('/new', appointmentsController.getNewAppointmentForm); 
router.post('/', appointmentsController.createAppointment);        
router.get('/:id', appointmentsController.getAppointmentById);
router.get('/:id/edit', appointmentsController.getEditAppointmentForm);  
router.put('/:id', appointmentsController.updateAppointment);            
router.delete('/:id', appointmentsController.deleteAppointment);

module.exports = router;