const db = require("../Database/queries/appointmentSlotsQueries");
const staffDb = require("../Database/queries/staffMemberQueries");    // Need this
const servicesDb = require("../Database/queries/servicesQueries");   // Need this

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET /appointment-slots - List all
const getAllAppointmentSlots = async (req, res) => {
    try {
        const appointmentSlots = await db.getAllAppointmentSlots();
        res.render("appointmentSlots/index", { appointmentSlots });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /appointment-slots/new - Show empty form
const getNewAppointmentSlotForm = async (req, res) => {
    try {
        // Fetch foreign keys for dropdowns
        const staff = await staffDb.getAllStaffMembers();
        const services = await servicesDb.getAllServices();
        
        res.render("appointmentSlots/new", { staff, services });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /appointment-slots - Create new
const createAppointmentSlot = async (req, res) => {
    try {
        const slotData = req.body;
        
        // Basic validation
        if (!slotData.staff_id || !slotData.service_id || !slotData.slot_start) {
            const staff = await staffDb.getAllStaffMembers();
            const services = await servicesDb.getAllServices();
            return res.status(400).render("appointmentSlots/new", { 
                error: "Staff, service, and start time are required",
                staff,
                services,
                slotData
            });
        }
        
        await db.createNewAppointmentSlot(slotData);
        res.redirect('/appointment-slots');
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /appointment-slots/:id - Show one
const getAppointmentSlotById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID format" });
        }
        
        const appointmentSlot = await db.getAppointmentSlotById(id);
        
        if (!appointmentSlot) {
            return res.status(404).render("404", { message: "Slot not found" });
        }
        
        res.render("appointmentSlots/show", { appointmentSlot });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /appointment-slots/:id/edit - Show edit form
const getEditAppointmentSlotForm = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID format" });
        }
        
        const appointmentSlot = await db.getAppointmentSlotById(id);
        
        if (!appointmentSlot) {
            return res.status(404).render("404", { message: "Slot not found" });
        }
        
        const staff = await staffDb.getAllStaffMembers();
        const services = await servicesDb.getAllServices();
        
        res.render("appointmentSlots/edit", { appointmentSlot, staff, services });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// PUT /appointment-slots/:id - Update
const updateAppointmentSlot = async (req, res) => {
    try {
        const { id } = req.params;
        const slotData = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID format" });
        }
        
        await db.updateAppointmentSlot(id, slotData);
        res.redirect('/appointment-slots');
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /appointment-slots/:id - Delete
const deleteAppointmentSlot = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID format" });
        }
        
        await db.deleteAppointmentSlot(id);
        res.redirect('/appointment-slots');
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllAppointmentSlots,
    getNewAppointmentSlotForm,
    createAppointmentSlot,
    getAppointmentSlotById,
    getEditAppointmentSlotForm,
    updateAppointmentSlot,
    deleteAppointmentSlot
};