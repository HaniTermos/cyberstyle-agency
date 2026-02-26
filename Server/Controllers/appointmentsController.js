const db = require("../Database/queries/appointmentsQueries");

// GET /appointments - List all
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await db.getAllAppointments();
        res.render("appointments/index", { appointments });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /appointments/new - Show empty form
const getNewAppointmentForm = async (req, res) => {
    try {
        // Fetch related data for dropdowns (clients, staff, services)
        const staff = await db.getAllStaffMembers(); // You need this
        const services = await db.getAllServices();  // You need this
        
        res.render("appointments/new", { staff, services });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /appointments - Create new
const createAppointment = async (req, res) => {
    try {
        const appointmentData = req.body;
        await db.createNewAppointment(appointmentData);
        res.redirect('/appointments');
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /appointments/:id - Show one
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await db.getAppointmentById(id);
        
        if (!appointment) {
            return res.status(404).render("404", { message: "Appointment not found" });
        }
        
        res.render("appointments/show", { appointment });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /appointments/:id/edit - Show edit form
const getEditAppointmentForm = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await db.getAppointmentById(id);
        
        if (!appointment) {
            return res.status(404).render("404", { message: "Appointment not found" });
        }
        const staff = await db.getAllStaffMembers();
        const services = await db.getAllServices();
        
        res.render("appointments/edit", { appointment, staff, services });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// PUT /appointments/:id - Update
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointmentData = req.body;
        
        await db.updateAppointment(id, appointmentData);
        res.redirect(`/appointments/${id}`);
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /appointments/:id - Delete
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await db.deleteAppointment(id);
        res.redirect('/appointments');
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllAppointments,
    getNewAppointmentForm,
    createAppointment,
    getAppointmentById,
    getEditAppointmentForm,
    updateAppointment,
    deleteAppointment
};