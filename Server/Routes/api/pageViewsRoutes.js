const express = require('express');
const router = express.Router();
const pageViewsController = require("../../Controllers/pageViewsController");

router.get("/", pageViewsController.getAllPageViews);    
router.get("/new", pageViewsController.createNewPageView); 
router.post("/", pageViewsController.createNewPageViewPOST);        
router.get("/:id", pageViewsController.getPageViewById);
router.get("/:id/edit", pageViewsController.updatePageView);  
router.put("/:id", pageViewsController.updatePageViewPOST);            
router.delete("/:id", pageViewsController.deletePageView);

module.exports = router;