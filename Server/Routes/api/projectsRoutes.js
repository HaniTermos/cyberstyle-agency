const express = require('express');
const router = express.Router();
const controller = require('../../Controllers/projectsController');

router.get('/', controller.getAllProjects);
router.get('/new', controller.createNewProjectGet);
router.post('/',controller.createNewProjectPost);
router.get('/:id', controller.getProjectById);
router.get('/:id/edit',controller.updateProjectGet);
router.post('/:id', controller.updateProjectPost);
router.post('/:id/delete', controller.deleteProjectPost);

module.exports = router;