const pool = require("../pool");

async function getAllAppointments() {
    const { rows } = await pool.query("SELECT * FROM appointments");
    return rows;
}

async function getAppointmentById(id) {
    const { rows } = await pool.query("SELECT * FROM appointments WHERE id = $1", [id]);
    return rows[0];
}

async function createNewAppointment(appointmentData) {
    const { rows } = await pool.query(`
        INSERT INTO appointments (client_id, staff_id, service_id, scheduled_start, scheduled_end , duration_minutes, timezone, status, meeting_type, meeting_url ,location_address, client_notes, custom_fields, internal_notes, cancellation_reason, cancellation_initiated_by, reminders_sent, follow_up_required, follow_up_scheduled, price, currency, payment_status, invoice_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *`,
        [
            appointmentData.client_id,
            appointmentData.staff_id,
            appointmentData.service_id,
            appointmentData.scheduled_start,
            appointmentData.scheduled_end,
            appointmentData.duration_minutes,
            appointmentData.timezone,
            appointmentData.status,
            appointmentData.meeting_type,
            appointmentData.meeting_url,
            appointmentData.location_address,
            appointmentData.client_notes,
            appointmentData.custom_fields,
            appointmentData.internal_notes,
            appointmentData.cancellation_reason,
            appointmentData.cancellation_initiated_by,
            appointmentData.reminders_sent,
            appointmentData.follow_up_required,
            appointmentData.follow_up_scheduled,
            appointmentData.price,
            appointmentData.currency,
            appointmentData.payment_status,
            appointmentData.invoice_id
        ]);
    return rows[0];
}

async function updateAppointment(id, appointmentData) {
    const { rows } = await pool.query(`
        UPDATE appointments SET 
            client_id = $2,
            staff_id = $3,
            service_id = $4,
            scheduled_start = $5,
            scheduled_end = $6,
            duration_minutes = $7,
            timezone = $8,
            status = $9,
            meeting_type = $10,
            meeting_url = $11,
            location_address = $12,
            client_notes = $13,
            custom_fields = $14,
            internal_notes = $15,
            cancellation_reason = $16,
            cancellation_initiated_by = $17,
            reminders_sent = $18,
            follow_up_required = $19,
            follow_up_scheduled = $20,
            price = $21,
            currency = $22,
            payment_status = $23
        WHERE id = $1 RETURNING *`, [id, ...Object.values(appointmentData)]);
    return rows[0];
}

async function deleteAppointment(id) {
    const { rows } = await pool.query("DELETE FROM appointments WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createNewAppointment,
    updateAppointment,
    deleteAppointment
};