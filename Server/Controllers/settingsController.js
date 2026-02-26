const db = require("../Database/queries/settingsQueries");

// GET /settings - Admin: list all grouped by category
const getAllSettings = async (req, res) => {
    try {
        const settings = await db.getAllSettings();
        
        // Group by setting_group for UI
        const grouped = settings.reduce((acc, setting) => {
            const group = setting.setting_group;
            if (!acc[group]) acc[group] = [];
            acc[group].push(setting);
            return acc;
        }, {});
        
        res.render("settings/index", { grouped, settings });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /settings/:group - Admin: list by group (e.g., /settings/email)
const getSettingsByGroup = async (req, res) => {
    try {
        const { group } = req.params;
        const settings = await db.getSettingsByGroup(group);
        
        res.render("settings/group", { group, settings });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /settings/key/:key - Admin: edit single setting
const getSettingByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const setting = await db.getSettingByKey(key);
        
        if (!setting) {
            return res.status(404).render("404", { message: "Setting not found" });
        }
        
        res.render("settings/edit", { setting });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /settings/key/:key - Admin: update single setting
const updateSettingByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        
        const setting = await db.getSettingByKey(key);
        if (!setting) {
            return res.status(404).render("404", { message: "Setting not found" });
        }
        
        // Validate based on setting_type
        let validatedValue;
        switch (setting.setting_type) {
            case 'number':
                validatedValue = Number(value);
                if (isNaN(validatedValue)) {
                    return res.status(400).render("settings/edit", {
                        error: "Must be a number",
                        setting: { ...setting, setting_value: value }
                    });
                }
                break;
            case 'boolean':
                validatedValue = value === 'true' || value === true;
                break;
            case 'array':
            case 'object':
                try {
                    validatedValue = JSON.parse(value);
                } catch {
                    return res.status(400).render("settings/edit", {
                        error: "Invalid JSON",
                        setting: { ...setting, setting_value: value }
                    });
                }
                break;
            default:
                validatedValue = value;
        }
        
        await db.updateSettingByKey(key, validatedValue);
        res.redirect("/settings");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /settings/bulk - Admin: update multiple settings at once
const updateSettingsBulk = async (req, res) => {
    try {
        const updates = req.body.settings; // { key1: value1, key2: value2 }
        
        for (const [key, value] of Object.entries(updates)) {
            await db.updateSettingByKey(key, value);
        }
        
        res.redirect("/settings");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// NO createNewSetting - Settings are seeded, not created in UI
// NO deleteSetting - Deleting settings breaks the app

module.exports = {
    getAllSettings,
    getSettingsByGroup,
    getSettingByKey,
    updateSettingByKey,
    updateSettingsBulk
};