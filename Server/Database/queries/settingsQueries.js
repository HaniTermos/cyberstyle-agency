const { pool } =require("../pool");

async function getAllSettings() {
    const { rows } = await pool.query("SELECT * FROM settings");
    return rows;
}

async function getSettingById(id) {
    const { rows } = await pool.query("SELECT * FROM settings WHERE id = $1", [id]);
    return rows[0];
}

async function getSettingByKey(key) {
    const { rows } = await pool.query(
        "SELECT * FROM settings WHERE setting_key = $1",
        [key]
    );
    return rows[0];
}

async function createSetting(settingData) {
    const { rows } = await pool.query(
        `INSERT INTO settings (setting_key, setting_group, setting_value, setting_type, description, is_public, is_editable, validation_rules) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
            settingData.setting_key,
            settingData.setting_group,
            settingData.setting_value,
            settingData.setting_type,
            settingData.description,
            settingData.is_public,
            settingData.is_editable,
            settingData.validation_rules
        ]
    );
    return rows[0];
}

async function updateSetting(id, settingData) {
    const { rows }= await pool.query(
        `UPDATE settings SET setting_key = $1, setting_group = $2, setting_value = $3, setting_type = $4, description = $5, is_public = $6, is_editable = $7, validation_rules = $8 WHERE id = $9 RETURNING *`,
        [
            settingData.setting_key,
            settingData.setting_group,
            settingData.setting_value,
            settingData.setting_type,
            settingData.description,
            settingData.is_public,
            settingData.is_editable,
            settingData.validation_rules,
            id
        ]
    );
    return rows[0];
}

async function deleteSetting(id) {
    const { rows } = await pool.query("DELETE FROM settings WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllSettings,
    getSettingById,
    getSettingByKey,
    createSetting,
    updateSetting,
    deleteSetting
};