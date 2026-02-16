const db = require("../Database/queries/sessionsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllSessions = async (req, res) => {
    try {
        const sessions = await db.getAllSessions();
        res.render("sessions/index", { sessions: sessions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await db.getSessionById(id);
        if (session) {
            res.render("sessions/show", { session: session });
        } else {
            res.status(404).json({ error: "Session not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewSession = async (req, res) => {
    try {
        const sessionData = req.body.session || req.body;
        if (!sessionData) {
            return res.status(400).render("error", { message: "Session data is required" });
        }
        res.render("sessions/new", { session: sessionData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewSessionPOST = async (req, res) => {
    try {
        const sessionData = req.body.session || req.body;
        if (!sessionData) {
            return res.status(400).render("sessions/new", { 
                error: "Session data is required",
                session: sessionData 
            });
        }
        await db.createNewSession(sessionData);
        res.redirect("/sessions");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid session ID" });
        }
        const session = await db.getSessionById(id);
        if (!session) {
            return res.status(404).render("error", { message: "Session not found" });
        }
        res.render("sessions/edit", { session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSessionPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const sessionData = req.body.session || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid session ID" });
        }

        await db.updateSession(id, sessionData);
        res.redirect("/sessions");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid session ID" });
        }
        await db.deleteSession(id);
        res.redirect("/sessions");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSessions,
    getSessionById,
    createNewSession,
    createNewSessionPOST,
    updateSession,
    updateSessionPOST,
    deleteSession
};