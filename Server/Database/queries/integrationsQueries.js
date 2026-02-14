const { pool } = require('../db/pool');

async function getAllIntegrations() {
    const query = 'SELECT * FROM integrations';
    const { rows } = await pool.query(query);
    return rows;
}

async function getIntegrationById(id) {
    const { rows } = await pool.query('SELECT * FROM integrations WHERE id = $1', [id]);
    return rows[0];
}

async function createIntegration(integrationData) {
    const { rows } = await pool.query(`
        INSERT INTO integrations (service_name, service_type, is_active, config, webhook_url, webhook_secret, last_synced_at, sync_status, error_message) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
            integrationData.service_name,
            integrationData.service_type,
            integrationData.is_active,
            integrationData.config,
            integrationData.webhook_url,
            integrationData.webhook_secret,
            integrationData.last_synced_at,
            integrationData.sync_status,
            integrationData.error_message
        ]
    );
    return rows[0];
}

async function updateIntegration(id, integrationData) {
    const { rows } = await pool.query(`
        UPDATE integrations 
        SET service_name = $1, service_type = $2, is_active = $3, config = $4, webhook_url = $5, webhook_secret = $6, last_synced_at = $7, sync_status = $8, error_message = $9
        WHERE id = $10 RETURNING *`,
        [
            integrationData.service_name,
            integrationData.service_type,
            integrationData.is_active,
            integrationData.config,
            integrationData.webhook_url,
            integrationData.webhook_secret,
            integrationData.last_synced_at,
            integrationData.sync_status,
            integrationData.error_message,
            id
        ]
    );
    return rows[0];
}

async function deleteIntegration(id) {
    const { rows } = await pool.query('DELETE FROM integrations WHERE id = $1 RETURNING *', [id]);
    return rows[0];
}

module.exports = {
    getAllIntegrations,
    getIntegrationById,
    createIntegration,
    updateIntegration,
    deleteIntegration
};