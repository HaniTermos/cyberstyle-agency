const db = require("../Database/queries/integrationsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllIntegrations = async (req, res) => {
    try {
        const integrations = await db.getAllIntegrations();
        res.render("integrations/index", { integrations: integrations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getIntegrationById = async (req, res) => {
    try {
        const { id } = req.params;
        const integration = await db.getIntegrationById(id);
        if (integration) {
            res.render("integrations/show", { integration: integration });
        } else {
            res.status(404).json({ error: "Integration not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewIntegration = async (req, res) => {
    try {
        const integrationData = req.body.integration || req.body;
        if (!integrationData) {
            return res.status(400).render("error", { message: "Integration data is required" });
        }
        res.render("integrations/new", { integration: integrationData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewIntegrationPOST = async (req, res) => {
    try {
        const integrationData = req.body.integration || req.body;
        if (!integrationData) {
            return res.status(400).render("integrations/new", { 
                error: "Integration data is required",
                integration: integrationData 
            });
        }
        await db.createNewIntegration(integrationData);
        res.redirect("/integrations");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateIntegration = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid integration ID" });
        }
        const integration = await db.getIntegrationById(id);
        if (!integration) {
            return res.status(404).render("error", { message: "Integration not found" });
        }
        res.render("integrations/edit", { integration });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateIntegrationPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const integrationData = req.body.integration || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid integration ID" });
        }

        await db.updateIntegration(id, integrationData);
        res.redirect("/integrations");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteIntegration = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid integration ID" });
        }
        await db.deleteIntegration(id);
        res.redirect("/integrations");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllIntegrations,
    getIntegrationById,
    createNewIntegration,
    createNewIntegrationPOST,
    updateIntegration,
    updateIntegrationPOST,
    deleteIntegration
};