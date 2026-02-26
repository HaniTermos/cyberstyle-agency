const express = require('express');
const router = express.Router();
const clientsController = require("../../Controllers/clientsController");


router.get("/", clientsController.getAllClients);
router.get("/new", clientsController.getNewClientForm);
router.post("/", clientsController.createClient);
router.get("/:id", clientsController.getClientById);
router.get("/:id/edit", clientsController.getEditClientForm);
router.put("/:id", clientsController.updateClient);
router.delete("/:id", clientsController.deleteClient);

module.exports = router;