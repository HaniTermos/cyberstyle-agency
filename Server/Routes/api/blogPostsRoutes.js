const express = require('express');
const router = express.Router();
const blogPostsController = require('../../Controllers/blogPostsController');


router.get('/', blogPostsController.getAllBlogPosts);
router.get('/new', blogPostsController.getNewBlogPostForm); 
router.post('/', blogPostsController.createBlogPost);        
router.get('/:id', blogPostsController.getBlogPostById);
router.get('/:id/edit', blogPostsController.getEditBlogPostForm);  
router.put('/:id', blogPostsController.updateBlogPost);            
router.delete('/:id', blogPostsController.deleteBlogPost);

module.exports = router;