const {pool} = require("../pool");

async function getAllAuditLogs() {
    const {rows} = await pool.query("SELECT * FROM audit_logs");
    return rows;
}

async function getAuditLogById(id) {
    const {rows} = await pool.query("SELECT * FROM audit_logs WHERE id = $1", [id]);
    return rows[0];
}

async function createAuditLog(auditLogData) {
    const {rows} = await pool.query(
        `INSERT INTO audit_logs (action, entity_type, entity_id, user_id, user_ip, user_agent, old_values, new_values, changed_fields) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
            auditLogData.action,
            auditLogData.entity_type,
            auditLogData.entity_id,
            auditLogData.user_id,
            auditLogData.user_ip,
            auditLogData.user_agent,
            auditLogData.old_values || null,
            auditLogData.new_values || null,
            auditLogData.changed_fields || null
        ]
    );
    return rows[0];
}

module.exports = {
    getAllAuditLogs,
    getAuditLogById,
    createAuditLog
};