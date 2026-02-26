const db = require("../Database/queries/sessionsQueries");
const usersDb = require("../Database/queries/usersQueries");
const bcrypt = require("bcrypt"); // or your auth library

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// POST /auth/login - Create session on successful login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).render("auth/login", { 
                error: "Email and password required" 
            });
        }
        
        // Find user
        const user = await usersDb.getUserByEmail(email);
        if (!user) {
            return res.status(401).render("auth/login", { 
                error: "Invalid credentials" 
            });
        }
        
        // Check password (use bcrypt in real app)
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            // Increment failed attempts
            await usersDb.incrementFailedAttempts(user.id);
            return res.status(401).render("auth/login", { 
                error: "Invalid credentials" 
            });
        }
        
        // Check if account locked
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return res.status(403).render("auth/login", { 
                error: "Account locked. Try again later." 
            });
        }
        
        // Create session
        const sessionToken = require("crypto").randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        await db.createNewSession({
            user_id: user.id,
            session_token: sessionToken,
            expires_at: expiresAt,
            user_agent: req.headers["user-agent"],
            ip_address: req.ip,
            device_info: {}, // parse from user-agent if needed
            is_active: true
        });
        
        // Set cookie
        res.cookie("session_token", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: expiresAt
        });
        
        // Update last login
        await usersDb.updateLastLogin(user.id);
        
        res.redirect("/dashboard");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /auth/logout - Invalidate current session
const logout = async (req, res) => {
    try {
        const token = req.cookies.session_token;
        
        if (token) {
            // Find and invalidate session
            const session = await db.getSessionByToken(token);
            if (session) {
                await db.updateSession(session.id, { is_active: false });
            }
            res.clearCookie("session_token");
        }
        
        res.redirect("/");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /sessions - Admin: list all sessions
const getAllSessions = async (req, res) => {
    try {
        const sessions = await db.getAllSessions();
        res.render("sessions/index", { sessions });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /sessions/:id - Admin: view session
const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const session = await db.getSessionById(id);
        
        if (!session) {
            return res.status(404).render("404", { message: "Session not found" });
        }
        
        res.render("sessions/show", { session });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /sessions/:id/invalidate - Admin: force logout
const invalidateSession = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        await db.updateSession(id, { is_active: false });
        res.redirect("/sessions");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /auth/logout-all - Invalidate all user sessions (security)
const logoutAll = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        
        await db.invalidateUserSessions(userId);
        res.clearCookie("session_token");
        
        res.redirect("/auth/login");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /sessions/expired - Admin: cleanup (cron job endpoint)
const deleteExpiredSessions = async (req, res) => {
    try {
        const deleted = await db.deleteExpiredSessions();
        res.json({ message: `Deleted ${deleted.length} expired sessions` });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    login,
    logout,
    getAllSessions,
    getSessionById,
    invalidateSession,
    logoutAll,
    deleteExpiredSessions
};