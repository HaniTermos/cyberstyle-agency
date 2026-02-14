const pool = require("../pool");

async function getAllStaffMembers(){
    const { rows } = await pool.query("SELECT * FROM staff_members");
    return rows;
}

async function getStaffMemberById(id){
    const { rows } = await pool.query("SELECT * FROM staff_members WHERE id = $1", [id]);
    return rows[0];
}

async function getAvailableStaff(date, serviceId) {
    // Complex query for checking working hours + existing appointments
    const { rows } = await pool.query(`
        SELECT sm.* FROM staff_members sm
        WHERE sm.is_active = true 
        AND sm.is_accepting_appointments = true
        AND $1 = ANY(sm.service_ids)
        AND NOT EXISTS (
            SELECT 1 FROM appointments a 
            WHERE a.staff_id = sm.id 
            AND a.status IN ('pending', 'confirmed')
            AND a.scheduled_start <= $2 
            AND a.scheduled_start + (a.duration_minutes || ' minutes')::INTERVAL > $2
        )
    `, [serviceId, date]);
    return rows;
}

async function createNewStaffMember(staffData){
    const { rows } = await pool.query(`
        INSERT INTO staff_members (first_name, last_name,user_id, email, phone, job_title, bio, avatar_url, working_hours, service_ids, is_active, is_accepting_appointments, preferred_contact_method) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
            staffData.first_name,
            staffData.last_name,
            staffData.user_id,
            staffData.email,
            staffData.phone,
            staffData.job_title,
            staffData.bio,
            staffData.avatar_url,
            staffData.working_hours,
            staffData.service_ids,
            staffData.is_active,
            staffData.is_accepting_appointments,
            staffData.preferred_contact_method
        ]);
    return rows[0];
}   

async function updateStaffMember(id, staffData){
    const { rows } = await pool.query(`
        UPDATE staff_members SET 
        first_name = $1, last_name = $2, user_id = $3, email = $4, phone = $5, job_title = $6, bio = $7, avatar_url = $8, working_hours = $9, service_ids = $10, is_active = $11, is_accepting_appointments = $12, preferred_contact_method = $13
        WHERE id = $14 RETURNING *`,
        [
            staffData.first_name,
            staffData.last_name,
            staffData.user_id,
            staffData.email,
            staffData.phone,
            staffData.job_title,
            staffData.bio,
            staffData.avatar_url,
            staffData.working_hours,
            staffData.service_ids,
            staffData.is_active,
            staffData.is_accepting_appointments,
            staffData.preferred_contact_method,
            id
        ]);
    return rows[0];
}

async function deleteStaffMember(id){
    const { rows } = await pool.query("DELETE FROM staff_members WHERE id = $1 RETURNING *", [id]);
    return rows[0]; 
}

module.exports = {
    getAllStaffMembers,
    getStaffMemberById,
    getAvailableStaff,
    createNewStaffMember,
    updateStaffMember,
    deleteStaffMember,
};