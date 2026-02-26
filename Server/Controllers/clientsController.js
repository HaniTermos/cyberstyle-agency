const db = require("../Database/queries/clientsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET /clients - List all
const getAllClients = async (req, res) => {
    try {
        const clients = await db.getAllClients();
        res.render("clients/index", { clients });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /clients/new - Show empty form
const getNewClientForm = async (req, res) => {
    try {
        res.render("clients/new");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /clients - Create new
const createClient = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, company, position, contact_method, newsletter_optin, source, notes, tags } = req.body;
        
        // Validation
        if (!first_name || !last_name || !email) {
            return res.status(400).render("clients/new", { 
                error: "First name, last name, and email are required",
                client: req.body 
            });
        }
        
        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).render("clients/new", { 
                error: "Invalid email format",
                client: req.body 
            });
        }
        
        // Check for duplicate email
        const existingClient = await db.getClientByEmail(email);
        if (existingClient) {
            return res.status(409).render("clients/new", { 
                error: "Email already exists",
                client: req.body 
            });
        }
        
        await db.createNewClient(
            first_name, last_name, email, phone || null, company || null, 
            position || null, contact_method || 'email', newsletter_optin || false, 
            source || 'website', notes || null, tags || []
        );
        
        res.redirect("/clients");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /clients/:id - View one
const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const client = await db.getClientById(id);
        
        if (!client) {
            return res.status(404).render("404", { message: "Client not found" });
        }
        
        res.render("clients/show", { client });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /clients/:id/edit - Show edit form
const getEditClientForm = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const client = await db.getClientById(id);
        
        if (!client) {
            return res.status(404).render("404", { message: "Client not found" });
        }
        
        res.render("clients/edit", { client });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// PUT /clients/:id - Update
const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone, company, position, contact_method, newsletter_optin, source, notes, tags } = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        if (!first_name || !last_name || !email) {
            return res.status(400).render("clients/edit", { 
                error: "First name, last name, and email are required",
                client: { id, ...req.body }
            });
        }
        
        await db.updateClient(
            id, first_name, last_name, email, phone || null, company || null,
            position || null, contact_method || 'email', newsletter_optin || false,
            source || 'website', notes || null, tags || []
        );
        
        res.redirect(`/clients/${id}`);
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /clients/:id - Delete
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        await db.deleteClient(id);
        res.redirect("/clients");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllClients,
    getNewClientForm,
    createClient,
    getClientById,
    getEditClientForm,
    updateClient,
    deleteClient
};