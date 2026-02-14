const db = require("../Database/queries/appointmentsQueries");

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await db.getAllAppointments();
        res.render("appointments/index", { appointments: appointments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await db.getAppointmentById(id);
        if (appointment) {
            res.render("appointments/show", { appointment: appointment });
        } else {
            res.status(404).json({ error: "Appointment not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewAppointment = async (req, res) => {
    try {
        const {client_id, staff_id, service_id, scheduled_start, scheduled_end , duration_minutes, timezone, status, meeting_type, meeting_url ,location_address, client_notes, custom_fields, internal_notes, cancellation_reason, cancellation_initiated_by, reminders_sent, follow_up_required, follow_up_scheduled, price, currency, payment_status, invoice_id} = req.body;
        const newAppointment = await db.createNewAppointment({
            client_id,
            staff_id,
            service_id,
            scheduled_start,
            scheduled_end,
            duration_minutes,
            timezone,
            status,
            meeting_type,
            meeting_url,
            location_address,
            client_notes,
            custom_fields,
            internal_notes,
            cancellation_reason,
            cancellation_initiated_by,
            reminders_sent,
            follow_up_required,
            follow_up_scheduled,
            price,
            currency,
            payment_status,
            invoice_id
        });
        res.render("appointments/new", { appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewAppointmentPOST = async (req, res) => {
    try {
        const {client_id, staff_id, service_id, scheduled_start, scheduled_end , duration_minutes, timezone, status, meeting_type, meeting_url ,location_address, client_notes, custom_fields, internal_notes, cancellation_reason, cancellation_initiated_by, reminders_sent, follow_up_required, follow_up_scheduled, price, currency, payment_status, invoice_id} = req.body;
        const newAppointment = await db.createNewAppointment({
            client_id,
            staff_id,
            service_id,
            scheduled_start,
            scheduled_end,
            duration_minutes,
            timezone,
            status,
            meeting_type,
            meeting_url,
            location_address,
            client_notes,
            custom_fields,
            internal_notes,
            cancellation_reason,
            cancellation_initiated_by,
            reminders_sent,
            follow_up_required,
            follow_up_scheduled,
            price,
            currency,
            payment_status,
            invoice_id
        });
        res.redirect(`/appointments`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const {client_id, staff_id, service_id, scheduled_start, scheduled_end , duration_minutes, timezone, status, meeting_type, meeting_url ,location_address, client_notes, custom_fields, internal_notes, cancellation_reason, cancellation_initiated_by, reminders_sent, follow_up_required, follow_up_scheduled, price, currency, payment_status, invoice_id} = req.body;
        const updatedAppointment = await db.updateAppointment(id, {
            client_id,
            staff_id,
            service_id,
            scheduled_start,
            scheduled_end,
            duration_minutes,
            timezone,
            status,
            meeting_type,
            meeting_url,
            location_address,
            client_notes,
            custom_fields,
            internal_notes,
            cancellation_reason,
            cancellation_initiated_by,
            reminders_sent,
            follow_up_required,
            follow_up_scheduled,
            price,
            currency,
            payment_status,
            invoice_id
        });
        res.render("appointments/edit", { updatedAppointment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAppointmentPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const {client_id, staff_id, service_id, scheduled_start, scheduled_end , duration_minutes, timezone, status, meeting_type, meeting_url ,location_address, client_notes, custom_fields, internal_notes, cancellation_reason, cancellation_initiated_by, reminders_sent, follow_up_required, follow_up_scheduled, price, currency, payment_status, invoice_id} = req.body;
        const updatedAppointment = await db.updateAppointment(id, {
            client_id,
            staff_id,
            service_id,
            scheduled_start,
            scheduled_end,
            duration_minutes,
            timezone,
            status,
            meeting_type,
            meeting_url,
            location_address,
            client_notes,
            custom_fields,
            internal_notes,
            cancellation_reason,
            cancellation_initiated_by,
            reminders_sent,
            follow_up_required,
            follow_up_scheduled,
            price,
            currency,
            payment_status,
            invoice_id
        });
        res.redirect(`/appointments`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAppointment = await db.deleteAppointment(id);
        res.redirect(`/appointments`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createNewAppointment,
    createNewAppointmentPOST,
    updateAppointment,
    updateAppointmentPOST,
    deleteAppointment
};