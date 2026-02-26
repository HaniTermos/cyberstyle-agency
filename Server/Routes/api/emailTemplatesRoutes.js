const express = require('express');
const router = express.Router();
const emailTemplatesController = require('../../Controllers/emailTemplatesController');
// GET /emailTemplates - List all
router.get('/', emailTemplatesController.getAllEmailTemplates);
// GET /emailTemplates/new - Create new
router.get('/new', emailTemplatesController.createNewEmailTemplate);
// POST /emailTemplates - Create new
router.post('/', emailTemplatesController.createNewEmailTemplatePOST);
// GET /emailTemplates/:id - Read one
router.get('/:id', emailTemplatesController.getEmailTemplateById);
// GET /emailTemplates/:id/edit - Update one
router.get('/:id/edit', emailTemplatesController.getEditEmailTemplateForm);
// PUT /emailTemplates/:id - Update one
router.put('/:id', emailTemplatesController.updateEmailTemplatePOST);
// DELETE /emailTemplates/:id - Delete one
router.delete('/:id', emailTemplatesController.deleteEmailTemplate);

module.exports = router;        
