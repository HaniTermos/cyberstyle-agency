const db = require("../Database/queries/servicesQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET /services - Public: active services, Admin: all services
const getAllServices = async (req, res) => {
    try {
        // If admin, show all. If public, show only active & public
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'manager';
        const services = isAdmin 
            ? await db.getAllServices()
            : await db.getPublicServices(); // or getActiveServices()
        
        res.render("services/index", { services, isAdmin });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /services/new - Admin only: show form
const getNewServiceForm = async (req, res) => {
    try {
        res.render("services/new");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /services - Admin only: create
const createService = async (req, res) => {
    try {
        const serviceData = req.body;
        
        // Validation
        if (!serviceData.name || !serviceData.slug || !serviceData.base_price || !serviceData.duration_minutes || !serviceData.category) {
            return res.status(400).render("services/new", { 
                error: "Name, slug, price, duration, and category are required",
                service: serviceData 
            });
        }
        
        // Check for duplicate slug
        const existingServices = await db.getAllServices();
        if (existingServices.find(s => s.slug === serviceData.slug)) {
            return res.status(409).render("services/new", { 
                error: "Slug already exists",
                service: serviceData 
            });
        }
        
        // Set defaults
        serviceData.currency = serviceData.currency || 'USD';
        serviceData.is_active = serviceData.is_active === 'true' || serviceData.is_active === true;
        serviceData.is_public = serviceData.is_public === 'true' || serviceData.is_public === true;
        
        await db.createNewService(serviceData);
        res.redirect("/services");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /services/:id - Public view (check is_public)
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const service = await db.getServiceById(id);
        
        if (!service) {
            return res.status(404).render("404", { message: "Service not found" });
        }
        
        // Check if public or admin
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'manager';
        if (!service.is_public && !isAdmin) {
            return res.status(403).render("error", { message: "Access denied" });
        }
        
        res.render("services/show", { service });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /services/:id/edit - Admin only: edit form
const getEditServiceForm = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const service = await db.getServiceById(id);
        
        if (!service) {
            return res.status(404).render("404", { message: "Service not found" });
        }
        
        res.render("services/edit", { service });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// PUT /services/:id - Admin only: update
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceData = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        // Check for slug conflict (exclude current service)
        if (serviceData.slug) {
            const existingServices = await db.getAllServices();
            const duplicate = existingServices.find(s => s.slug === serviceData.slug && s.id !== id);
            if (duplicate) {
                return res.status(409).render("services/edit", { 
                    error: "Slug already in use",
                    service: { id, ...serviceData }
                });
            }
        }
        
        // Convert booleans
        if (serviceData.is_active !== undefined) {
            serviceData.is_active = serviceData.is_active === 'true' || serviceData.is_active === true;
        }
        if (serviceData.is_public !== undefined) {
            serviceData.is_public = serviceData.is_public === 'true' || serviceData.is_public === true;
        }
        
        await db.updateService(id, serviceData);
        res.redirect(`/services/${id}`);
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /services/:id - Admin only
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        // Check for existing appointments
        const appointments = await db.getAppointmentsByServiceId(id); // You need this query
        if (appointments && appointments.length > 0) {
            return res.status(409).render("error", { 
                message: "Cannot delete service with existing appointments" 
            });
        }
        
        await db.deleteService(id);
        res.redirect("/services");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllServices,
    getNewServiceForm,
    createService,
    getServiceById,
    getEditServiceForm,
    updateService,
    deleteService
};