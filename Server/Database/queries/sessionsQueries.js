const {pool} =require("../pool");

async function getAllSessions() {
    const { rows } = await pool.query("SELECT * FROM sessions");
    return rows;
}   

async function getSessionById(id) {
    const { rows } = await pool.query("SELECT * FROM sessions WHERE id = $1", [id]);
    return rows[0];
}

// Add to sessionsQueries.js
async function getSessionByToken(token) {
    const { rows } = await pool.query(
        "SELECT * FROM sessions WHERE session_token = $1 AND is_active = true AND expires_at > NOW()",
        [token]
    );
    return rows[0];
}

async function createNewSession(sessionData) {
    const { rows } = await pool.query(
        `INSERT INTO sessions (user_id, session_token, expires_at, user_agent, ip_address, device_info, is_active) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
            sessionData.user_id,
            sessionData.session_token,
            sessionData.expires_at,
            sessionData.user_agent,
            sessionData.ip_address,
            sessionData.device_info,
            sessionData.is_active
        ]);
    return rows[0];
}

async function updateSession(id, sessionData) {
    const { rows } = await pool.query(
        `UPDATE sessions SET 
        user_id = $1, session_token = $2, expires_at = $3, user_agent = $4, ip_address = $5, device_info = $6, is_active = $7
        WHERE id = $8 RETURNING *`,
        [
            sessionData.user_id,
            sessionData.session_token,
            sessionData.expires_at,
            sessionData.user_agent,
            sessionData.ip_address,
            sessionData.device_info,
            sessionData.is_active,
            id
        ]);
    return rows[0];
}

async function deleteSession(id) {
    const { rows } = await pool.query("DELETE FROM sessions WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllSessions,
    getSessionById,
    getSessionByToken,
    createNewSession,
    updateSession,
    deleteSession
};