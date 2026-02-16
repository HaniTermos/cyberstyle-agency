const db = require("../Database/queries/settingsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllSettings = async (req, res) => {
    try {
        const settings = await db.getAllSettings();
        res.render("settings/index", { settings: settings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSettingById = async (req, res) => {
    try {
        const { id } = req.params;
        const setting = await db.getSettingById(id);
        if (setting) {
            res.render("settings/show", { setting: setting });
        } else {
            res.status(404).json({ error: "Setting not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewSetting = async (req, res) => {
    try {
        const settingData = req.body.setting || req.body;
        if (!settingData) {
            return res.status(400).render("error", { message: "Setting data is required" });
        }
        res.render("settings/new", { setting: settingData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewSettingPOST = async (req, res) => {
    try {
        const settingData = req.body.setting || req.body;
        if (!settingData) {
            return res.status(400).render("settings/new", { 
                error: "Setting data is required",
                setting: settingData 
            });
        }
        await db.createNewSetting(settingData);
        res.redirect("/settings");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSetting = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid setting ID" });
        }
        const setting = await db.getSettingById(id);
        if (!setting) {
            return res.status(404).render("error", { message: "Setting not found" });
        }
        res.render("settings/edit", { setting });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSettingPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const settingData = req.body.setting || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid setting ID" });
        }

        await db.updateSetting(id, settingData);
        res.redirect("/settings");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSetting = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid setting ID" });
        }
        await db.deleteSetting(id);
        res.redirect("/settings");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSettings,
    getSettingById,
    createNewSetting,
    createNewSettingPOST,
    updateSetting,
    updateSettingPOST,
    deleteSetting
};