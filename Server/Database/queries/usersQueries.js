const pool = require("../pool");

async function getAllUsers() {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
}

async function getUserById(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
}

async function getUserByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0];
}

async function updateLastLogin(userId) {
    const { rows } = await pool.query(
        "UPDATE users SET last_login_at = NOW() WHERE id = $1 RETURNING *",
        [userId]
    );
    return rows[0];
}

async function incrementFailedAttempts(userId) {
    const { rows } = await pool.query(
        "UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1 RETURNING *",
        [userId]
    );
    return rows[0];
}

async function lockUserAccount(userId, lockoutUntil) {
    const { rows } = await pool.query(
        "UPDATE users SET locked_until = $2, failed_login_attempts = 0 WHERE id = $1 RETURNING *",
        [userId, lockoutUntil]
    );
    return rows[0];
}

async function createNewUser(userData) {
    const { rows } = await pool.query(`
        INSERT INTO users (email, email_verified, password_hash, first_name, last_name, 
        role, auth_provider, auth_provider_id, avatar_url, phone, bio, permissions, is_active, 
        is_onboarded, last_login_at, last_password_change_at, failed_login_attempts, lockout_until, preferences) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
        [
            userData.email,
            userData.email_verified || false,
            userData.password_hash,
            userData.first_name || null,
            userData.last_name || null,
            userData.role || 'user',
            userData.auth_provider || 'email',
            userData.auth_provider_id || null,
            userData.avatar_url || null,
            userData.phone || null,
            userData.bio || null,
            userData.permissions || '[]',
            userData.is_active || true,
            userData.is_onboarded || false,
            userData.last_login_at || null,
            userData.last_password_change_at || null,
            userData.failed_login_attempts || 0,
            userData.lockout_until || null,
            userData.preferences || '{}'
        ]);
    return rows[0];
}

async function updateUser(id, userData) {
    const { rows } = await pool.query(`
        UPDATE users SET 
        email = $1, email_verified = $2, password_hash = $3, first_name = $4, last_name = $5, 
        role = $6, auth_provider = $7, auth_provider_id = $8, avatar_url = $9, phone = $10, bio = $11,
        permissions = $12, is_active = $13, is_onboarded = $14, last_login_at = $15, last_password_change_at = $16,
        failed_login_attempts = $17, lockout_until = $18, preferences = $19
        WHERE id = $20 RETURNING *`,
        [
            userData.email,
            userData.email_verified || false,
            userData.password_hash,
            userData.first_name || null,
            userData.last_name || null,
            userData.role || 'user',
            userData.auth_provider || 'email',
            userData.auth_provider_id || null,
            userData.avatar_url || null,
            userData.phone || null,
            userData.bio || null,
            userData.permissions || '[]',
            userData.is_active || true,
            userData.is_onboarded || false,
            userData.last_login_at || null,
            userData.last_password_change_at || null,
            userData.failed_login_attempts || 0,
            userData.lockout_until || null,
            userData.preferences || '{}',
            id
        ]);
    return rows[0];
}

async function deleteUser(id) {
    const { rows } = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateLastLogin,
    incrementFailedAttempts,
    lockUserAccount,
    createNewUser,
    updateUser,
    deleteUser
};
