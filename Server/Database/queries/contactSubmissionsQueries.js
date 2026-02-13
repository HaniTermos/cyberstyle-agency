const {pool} =require("../pool");

async function getAllContactSubmissions() {
    const {rows} = await pool.query("SELECT * FROM contact_submissions");
    return rows;
}

async function getAllContactSubmissionsById(id) {
    const {rows} = await pool.query("SELECT * FROM contact_submissions WHERE id = $1", [id]);
    return rows[0];
}

async function createContactSubmission(contactSubmissionData) {
    const {rows} = await pool.query(
        `INSERT INTO contact_submissions (name, email, phone, company, subject, message, inquiry_type, interested_service_ids, budget_range, timeline, status, assigned_to, response_sent, response_sent_at, response_notes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
        [
            contactSubmissionData.name,
            contactSubmissionData.email,
            contactSubmissionData.phone,
            contactSubmissionData.company,
            contactSubmissionData.subject,
            contactSubmissionData.message,
            contactSubmissionData.inquiry_type,
            contactSubmissionData.interested_service_ids,
            contactSubmissionData.budget_range,
            contactSubmissionData.timeline,
            contactSubmissionData.status || "pending",
            contactSubmissionData.assigned_to || null,
            false,
            null,
            null
        ]
    );
    return rows[0];
}

async function updateContactSubmission(id, contactSubmissionData) {
    const {rows} = await pool.query(
        `UPDATE contact_submissions SET name = $1, email = $2, phone = $3, company = $4, subject = $5, message = $6, inquiry_type = $7, interested_service_ids = $8, budget_range = $9, timeline = $10, status = $11, assigned_to = $12, response_sent = $13, response_sent_at = $14, response_notes = $15 WHERE id = $16 RETURNING *`,
        [
            contactSubmissionData.name,
            contactSubmissionData.email,
            contactSubmissionData.phone,
            contactSubmissionData.company,
            contactSubmissionData.subject,
            contactSubmissionData.message,
            contactSubmissionData.inquiry_type,
            contactSubmissionData.interested_service_ids,
            contactSubmissionData.budget_range,
            contactSubmissionData.timeline,
            contactSubmissionData.status,
            contactSubmissionData.assigned_to,
            contactSubmissionData.response_sent,
            contactSubmissionData.response_sent_at,
            contactSubmissionData.response_notes,
            id
        ]
    );
    return rows[0];
}


async function deleteContactSubmissionById(id) {
    const {rows} = await pool.query("DELETE FROM contact_submissions WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllContactSubmissions,
    getAllContactSubmissionsById,
    createContactSubmission,
    updateContactSubmission,
    deleteContactSubmissionById
};