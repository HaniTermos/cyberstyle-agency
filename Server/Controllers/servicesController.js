const db = require("../Database/queries/servicesQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllServices = async (req, res) => {
    try {
        const services = await db.getAllServices();
        res.render("services/index", { services: services });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await db.getServiceById(id);
        if (service) {
            res.render("services/show", { service: service });
        } else {
            res.status(404).json({ error: "Service not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewService = async (req, res) => {
    try {
        const serviceData = req.body.service || req.body;
        if (!serviceData) {
            return res.status(400).render("error", { message: "Service data is required" });
        }
        res.render("services/new", { service: serviceData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewServicePOST = async (req, res) => {
    try {
        const serviceData = req.body.service || req.body;
        if (!serviceData) {
            return res.status(400).render("services/new", { 
                error: "Service data is required",
                service: serviceData 
            });
        }
        await db.createNewService(serviceData);
        res.redirect("/services");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid service ID" });
        }
        const service = await db.getServiceById(id);
        if (!service) {
            return res.status(404).render("error", { message: "Service not found" });
        }
        res.render("services/edit", { service });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateServicePOST = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceData = req.body.service || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid service ID" });
        }

        await db.updateService(id, serviceData);
        res.redirect("/services");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid service ID" });
        }
        await db.deleteService(id);
        res.redirect("/services");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createNewService,
    createNewServicePOST,
    updateService,
    updateServicePOST,
    deleteService
};