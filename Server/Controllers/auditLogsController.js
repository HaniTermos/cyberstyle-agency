const db = require("../Database/queries/auditLogsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllAuditLogs = async (req, res) => {
    try {
        const auditLogs = await db.getAllAuditLogs();
        res.render("auditLogs/index", { auditLogs: auditLogs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAuditLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const auditLog = await db.getAuditLogById(id);
        if (auditLog) {
            res.render("auditLogs/show", { auditLog: auditLog });
        } else {
            res.status(404).json({ error: "AuditLog not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewAuditLog = async (req, res) => {
    try {
        const auditLogData = req.body.auditLog || req.body;
        if (!auditLogData) {
            return res.status(400).render("error", { message: "AuditLog data is required" });
        }
        res.render("auditLogs/new", { auditLog: auditLogData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewAuditLogPOST = async (req, res) => {
    try {
        const auditLogData = req.body.auditLog || req.body;
        if (!auditLogData) {
            return res.status(400).render("auditLogs/new", { 
                error: "AuditLog data is required",
                auditLog: auditLogData 
            });
        }
        await db.createNewAuditLog(auditLogData);
        res.redirect("/auditLogs");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAuditLog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid auditLog ID" });
        }
        const auditLog = await db.getAuditLogById(id);
        if (!auditLog) {
            return res.status(404).render("error", { message: "AuditLog not found" });
        }
        res.render("auditLogs/edit", { auditLog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAuditLogPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const auditLogData = req.body.auditLog || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid auditLog ID" });
        }

        await db.updateAuditLog(id, auditLogData);
        res.redirect("/auditLogs");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAuditLog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid auditLog ID" });
        }
        await db.deleteAuditLog(id);
        res.redirect("/auditLogs");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAuditLogs,
    getAuditLogById,
    createNewAuditLog,
    createNewAuditLogPOST,
    updateAuditLog,
    updateAuditLogPOST,
    deleteAuditLog
};