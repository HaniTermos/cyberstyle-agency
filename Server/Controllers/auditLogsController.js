const db = require("../Database/queries/auditLogsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET /audit-logs - List all
const getAllAuditLogs = async (req, res) => {
    try {
        const auditLogs = await db.getAllAuditLogs();
        res.render("auditLogs/index", { auditLogs });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /audit-logs/new - Show form (admin testing)
const getNewAuditLogForm = async (req, res) => {
    try {
        res.render("auditLogs/new");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /audit-logs - Create (admin testing or manual entry)
const createAuditLog = async (req, res) => {
    try {
        const auditLogData = req.body;
        
        if (!auditLogData.action || !auditLogData.entity_type) {
            return res.status(400).render("auditLogs/new", { 
                error: "Action and entity type required",
                auditLog: auditLogData 
            });
        }
        
        await db.createAuditLog(auditLogData);
        res.redirect("/audit-logs");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /audit-logs/:id - View one
const getAuditLogById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const auditLog = await db.getAuditLogById(id);
        
        if (!auditLog) {
            return res.status(404).render("404", { message: "Not found" });
        }
        
        res.render("auditLogs/show", { auditLog });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllAuditLogs,
    getNewAuditLogForm,
    createAuditLog,
    getAuditLogById
};