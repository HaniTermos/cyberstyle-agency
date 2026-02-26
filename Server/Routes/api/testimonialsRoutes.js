const express = require('express');
const router = express.Router();
const testimonialsController = require('../../Controllers/testimonialsController');

router.get('/', testimonialsController.getAllTestimonials);
router.get('/new', testimonialsController.getNewTestimonialForm);
router.post('/', testimonialsController.createTestimonial);        
router.get('/:id', testimonialsController.getTestimonialById);
router.get('/:id/edit', testimonialsController.getEditTestimonialForm);  
router.put('/:id', testimonialsController.updateTestimonial);            
router.put('/:id/approve', testimonialsController.approveTestimonial);
router.put('/:id/featured', testimonialsController.toggleFeatured);
router.delete('/:id', testimonialsController.deleteTestimonial);

module.exports = router;