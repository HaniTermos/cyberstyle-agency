const express = require('express');
const router = express.Router();
const usersController = require('../../Controllers/usersController');

router.get('/', usersController.getAllUsers);
router.get('/new', usersController.getNewUserForm);
router.post('/', usersController.createUser);
router.get('/:id', usersController.getUserById);
router.get('/:id/edit', usersController.getEditUserForm);
router.put('/:id', usersController.updateUser);
router.put('/:id/password', usersController.changePassword);
router.delete('/:id', usersController.deleteUser);

module.exports = router;