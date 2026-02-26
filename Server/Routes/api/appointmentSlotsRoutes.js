const express = require('express');
const router = express.Router();
const appointmentSlotsController = require('../../Controllers/appointmentSlotsController');


router.get('/', appointmentSlotsController.getAllAppointmentSlots);
router.get('/new', appointmentSlotsController.getNewAppointmentSlotForm); 
router.post('/', appointmentSlotsController.createAppointmentSlot);        
router.get('/:id', appointmentSlotsController.getAppointmentSlotById);
router.get('/:id/edit', appointmentSlotsController.getEditAppointmentSlotForm);  
router.put('/:id', appointmentSlotsController.updateAppointmentSlot);            
router.delete('/:id', appointmentSlotsController.deleteAppointmentSlot);

module.exports = router;