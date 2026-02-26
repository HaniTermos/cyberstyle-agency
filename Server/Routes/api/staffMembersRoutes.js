const express = require('express');
const router = express.Router();
const staffMembersController = require('../../Controllers/staffMembersController');

router.get('/', staffMembersController.getAllStaffMembers);
router.get('/available', staffMembersController.getAvailableStaff);
router.get('/new', staffMembersController.getNewStaffMemberForm);
router.post('/', staffMembersController.createStaffMember);
router.get('/:id', staffMembersController.getStaffMemberById);
router.get('/:id/edit', staffMembersController.getEditStaffMemberForm);
router.put('/:id', staffMembersController.updateStaffMember);
router.put('/:id/accepting', staffMembersController.toggleAcceptingAppointments);
router.delete('/:id', staffMembersController.deleteStaffMember);

module.exports = router;