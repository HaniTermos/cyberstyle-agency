const express = require('express');
const router = express.Router();
const contactSubmissionsController = require('../../Controllers/contactSubmissionsController');


router.get('/', contactSubmissionsController.getAllContactSubmissions);
router.get('/new', contactSubmissionsController.getNewContactSubmissionForm);
router.post('/', contactSubmissionsController.createContactSubmission);
router.get('/:id', contactSubmissionsController.getContactSubmissionById);
router.put('/:id/assign', contactSubmissionsController.assignContactSubmission);
router.put('/:id/respond', contactSubmissionsController.respondToContactSubmission);
router.delete('/:id', contactSubmissionsController.deleteContactSubmission);

module.exports = router;