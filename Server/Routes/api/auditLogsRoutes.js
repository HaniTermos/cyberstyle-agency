const express = require('express');
const router = express.Router();
const auditLogsController = require('../../Controllers/auditLogsController');


router.get('/', auditLogsController.getAllAuditLogs);
router.get('/new', auditLogsController.getNewAuditLogForm);
router.post('/', auditLogsController.createAuditLog);
router.get('/:id', auditLogsController.getAuditLogById);

module.exports = router;