const db = require("../Database/queries/appointmentSlotsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllAppointmentSlots = async (req, res) => {
    try {
        const appointmentSlots = await db.getAllAppointmentSlots();
        res.render("appointmentSlots/index", { appointmentSlots: appointmentSlots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAppointmentSlotById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointmentSlot = await db.getAppointmentSlotById(id);
        if (appointmentSlot) {
            res.render("appointmentSlots/show", { appointmentSlot: appointmentSlot });
        } else {
            res.status(404).json({ error: "AppointmentSlot not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewAppointmentSlot = async (req, res) => {
    try {
        const appointmentSlotData = req.body.appointmentSlot || req.body;
        if (!appointmentSlotData) {
            return res.status(400).render("error", { message: "AppointmentSlot data is required" });
        }
        res.render("appointmentSlots/new", { appointmentSlot: appointmentSlotData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewAppointmentSlotPOST = async (req, res) => {
    try {
        const appointmentSlotData = req.body.appointmentSlot || req.body;
        if (!appointmentSlotData) {
            return res.status(400).render("appointmentSlots/new", { 
                error: "AppointmentSlot data is required",
                appointmentSlot: appointmentSlotData 
            });
        }
        await db.createNewAppointmentSlot(appointmentSlotData);
        res.redirect("/appointmentSlots");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAppointmentSlot = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid appointmentSlot ID" });
        }
        const appointmentSlot = await db.getAppointmentSlotById(id);
        if (!appointmentSlot) {
            return res.status(404).render("error", { message: "AppointmentSlot not found" });
        }
        res.render("appointmentSlots/edit", { appointmentSlot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAppointmentSlotPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const appointmentSlotData = req.body.appointmentSlot || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid appointmentSlot ID" });
        }

        await db.updateAppointmentSlot(id, appointmentSlotData);
        res.redirect("/appointmentSlots");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAppointmentSlot = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid appointmentSlot ID" });
        }
        await db.deleteAppointmentSlot(id);
        res.redirect("/appointmentSlots");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAppointmentSlots,
    getAppointmentSlotById,
    createNewAppointmentSlot,
    createNewAppointmentSlotPOST,
    updateAppointmentSlot,
    updateAppointmentSlotPOST,
    deleteAppointmentSlot
};