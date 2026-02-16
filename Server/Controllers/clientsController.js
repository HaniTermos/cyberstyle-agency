const db = require("../Database/queries/clientsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllClients = async (req, res) => {
    try {
        const clients = await db.getAllClients();
        res.render("clients/index", { clients: clients });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await db.getClientById(id);
        if (client) {
            res.render("clients/show", { client: client });
        } else {
            res.status(404).json({ error: "Client not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewClient = async (req, res) => {
    try {
        const clientData = req.body.client || req.body;
        if (!clientData) {
            return res.status(400).render("error", { message: "Client data is required" });
        }
        res.render("clients/new", { client: clientData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewClientPOST = async (req, res) => {
    try {
        const clientData = req.body.client || req.body;
        if (!clientData) {
            return res.status(400).render("clients/new", { 
                error: "Client data is required",
                client: clientData 
            });
        }
        await db.createNewClient(clientData);
        res.redirect("/clients");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid client ID" });
        }
        const client = await db.getClientById(id);
        if (!client) {
            return res.status(404).render("error", { message: "Client not found" });
        }
        res.render("clients/edit", { client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateClientPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const clientData = req.body.client || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid client ID" });
        }

        await db.updateClient(id, clientData);
        res.redirect("/clients");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid client ID" });
        }
        await db.deleteClient(id);
        res.redirect("/clients");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createNewClient,
    createNewClientPOST,
    updateClient,
    updateClientPOST,
    deleteClient
};