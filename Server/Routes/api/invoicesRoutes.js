const express = require('express');
const router = express.Router();
const invoicesController = require('../../Controllers/invoicesController');

router.get('/', invoicesController.getAllInvoices);
router.get('/new', invoicesController.createNewInvoice); 
router.post('/', invoicesController.createNewInvoicePOST);        
router.get('/:id', invoicesController.getInvoiceById);
router.get('/:id/edit', invoicesController.updateInvoice);  
router.put('/:id', invoicesController.updateInvoicePOST);            
router.delete('/:id', invoicesController.deleteInvoice);

module.exports = router;