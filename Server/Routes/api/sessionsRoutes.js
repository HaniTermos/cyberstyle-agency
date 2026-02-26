const express = require('express');
const router = express.Router();
const seesionsController = require('../../Controllers/sessionsController');

router.post('/login', seesionsController.login);
router.post('/logout', seesionsController.logout);
router.get('/', seesionsController.getAllSessions);
router.get('/:id', seesionsController.getSessionById);
router.delete('/:id', seesionsController.invalidateSession);
router.delete('/', seesionsController.logoutAll);
router.delete('/expired', seesionsController.deleteExpiredSessions);

module.exports = router;