const pool = require("../pool");

async function getAllAppointmentSlots() {
    const { rows } = await pool.query("SELECT * FROM appointment_slots");
    return rows;
}

async function getAppointmentSlotById(id) {
    const { rows } = await pool.query("SELECT * FROM appointment_slots WHERE id = $1", [id]);
    return rows[0];
}

// Add to appointmentSlotsQueries.js
async function getAvailableSlots(staffId, serviceId, startDate, endDate) {
    const { rows } = await pool.query(
        `SELECT * FROM appointment_slots 
         WHERE staff_id = $1 
         AND service_id = $2
         AND slot_start BETWEEN $3 AND $4
         AND is_available = true
         AND current_bookings < max_bookings
         ORDER BY slot_start`,
        [staffId, serviceId, startDate, endDate]
    );
    return rows;
}

async function incrementSlotBookings(slotId) {
    const { rows } = await pool.query(
        `UPDATE appointment_slots 
         SET current_bookings = current_bookings + 1,
             is_available = (current_bookings + 1) < max_bookings
         WHERE id = $1 RETURNING *`,
        [slotId]
    );
    return rows[0];
}

async function decrementSlotBookings(slotId) {
    const { rows } = await pool.query(
        `UPDATE appointment_slots 
         SET current_bookings = GREATEST(current_bookings - 1, 0),
             is_available = true
         WHERE id = $1 RETURNING *`,
        [slotId]
    );
    return rows[0];
}

async function createNewAppointmentSlot(appointmentSlotData) {
    const { rows } = await pool.query(`
        INSERT INTO appointment_slots (staff_id, service_id, slot_start, slot_end, slot_duration_minutes, max_bookings, current_bookings, is_available, recurrence_rule, recurrence_exceptions) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
            appointmentSlotData.staff_id,
            appointmentSlotData.service_id,
            appointmentSlotData.slot_start,
            appointmentSlotData.slot_end,
            appointmentSlotData.slot_duration_minutes,
            appointmentSlotData.max_bookings,
            appointmentSlotData.current_bookings || 0,
            appointmentSlotData.is_available || true,
            appointmentSlotData.recurrence_rule || null,
            appointmentSlotData.recurrence_exceptions || '[]'
        ]);
    return rows[0];
}

async function updateAppointmentSlot(id, appointmentSlotData) {
    const { rows } = await pool.query(`
        UPDATE appointment_slots 
        SET staff_id = $1, service_id = $2, slot_start = $3, slot_end = $4, slot_duration_minutes = $5, max_bookings = $6, current_bookings = $7, is_available = $8, recurrence_rule = $9, recurrence_exceptions = $10
        WHERE id = $11 RETURNING *`,
        [
            appointmentSlotData.staff_id,
            appointmentSlotData.service_id,
            appointmentSlotData.slot_start,
            appointmentSlotData.slot_end,
            appointmentSlotData.slot_duration_minutes,
            appointmentSlotData.max_bookings,
            appointmentSlotData.current_bookings || 0,
            appointmentSlotData.is_available || true,
            appointmentSlotData.recurrence_rule || null,
            appointmentSlotData.recurrence_exceptions || '[]',
            id    
        ]);
    return rows[0];
}

async function deleteAppointmentSlot(id) {
    const { rows } = await pool.query("DELETE FROM appointment_slots WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}   

module.exports = { 
    getAllAppointmentSlots, 
    getAppointmentSlotById,
    getAvailableSlots, 
    incrementSlotBookings, 
    decrementSlotBookings,
    createNewAppointmentSlot, 
    updateAppointmentSlot, 
    deleteAppointmentSlot 
};