const db = require("../Database/queries/usersQueries");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SALT_ROUNDS = 10;
const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// Middleware: Check if admin or self
const canAccessUser = (req, res, next) => {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'super_admin' || req.user?.role === 'admin';
    const isSelf = req.user?.id === id;
    
    if (!isAdmin && !isSelf) {
        return res.status(403).render("error", { message: "Access denied" });
    }
    next();
};

// GET /users - Admin: list all
const getAllUsers = async (req, res) => {
    try {
        // Only admins can list all users
        if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
            return res.status(403).render("error", { message: "Admin access required" });
        }
        
        const users = await db.getAllUsers();
        // Don't send password hashes to view
        const safeUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            first_name: u.first_name,
            last_name: u.last_name,
            role: u.role,
            is_active: u.is_active,
            created_at: u.created_at
        }));
        
        res.render("users/index", { users: safeUsers });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /users/new - Admin: show form
const getNewUserForm = async (req, res) => {
    try {
        // Only admins can create users
        if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
            return res.status(403).render("error", { message: "Admin access required" });
        }
        
        res.render("users/new");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /users - Admin: create user
const createUser = async (req, res) => {
    try {
        if (req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
            return res.status(403).render("error", { message: "Admin access required" });
        }
        
        const { email, password, first_name, last_name, role } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).render("users/new", { 
                error: "Email and password are required" 
            });
        }
        
        // Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).render("users/new", { 
                error: "Invalid email format" 
            });
        }
        
        // Password strength
        if (password.length < 8) {
            return res.status(400).render("users/new", { 
                error: "Password must be at least 8 characters" 
            });
        }
        
        // Check duplicate email
        const existing = await db.getUserByEmail(email);
        if (existing) {
            return res.status(409).render("users/new", { 
                error: "Email already registered" 
            });
        }
        
        // Hash password
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        
        // Create user with all required fields
        await db.createNewUser({
            email,
            email_verified: false,
            password_hash,
            first_name: first_name || null,
            last_name: last_name || null,
            role: role || 'user',
            auth_provider: 'email',
            auth_provider_id: null,
            avatar_url: null,
            phone: null,
            bio: null,
            permissions: '[]',
            is_active: true,
            is_onboarded: false,
            last_login_at: null,
            last_password_change_at: new Date(),
            failed_login_attempts: 0,
            lockout_until: null,
            preferences: '{}'
        });
        
        res.redirect("/users");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /users/:id - Self or Admin: view profile
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        // Check permissions
        const isAdmin = req.user?.role === 'super_admin' || req.user?.role === 'admin';
        const isSelf = req.user?.id === id;
        
        if (!isAdmin && !isSelf) {
            return res.status(403).render("error", { message: "Access denied" });
        }
        
        const user = await db.getUserById(id);
        
        if (!user) {
            return res.status(404).render("404", { message: "User not found" });
        }
        
        // Remove sensitive data
        delete user.password_hash;
        
        res.render("users/show", { user, isSelf });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /users/:id/edit - Self or Admin: edit form
const getEditUserForm = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const isAdmin = req.user?.role === 'super_admin' || req.user?.role === 'admin';
        const isSelf = req.user?.id === id;
        
        if (!isAdmin && !isSelf) {
            return res.status(403).render("error", { message: "Access denied" });
        }
        
        const user = await db.getUserById(id);
        
        if (!user) {
            return res.status(404).render("404", { message: "User not found" });
        }
        
        delete user.password_hash;
        
        res.render("users/edit", { user, isAdmin });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// PUT /users/:id - Self or Admin: update
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const isAdmin = req.user?.role === 'super_admin' || req.user?.role === 'admin';
        const isSelf = req.user?.id === id;
        
        if (!isAdmin && !isSelf) {
            return res.status(403).render("error", { message: "Access denied" });
        }
        
        // Non-admins can't change role or active status
        if (!isAdmin) {
            delete userData.role;
            delete userData.is_active;
            delete userData.permissions;
        }
        
        // Only super_admin can create other admins
        if (userData.role === 'admin' && req.user?.role !== 'super_admin') {
            return res.status(403).render("error", { message: "Cannot assign admin role" });
        }
        
        await db.updateUser(id, userData);
        res.redirect(`/users/${id}`);
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /users/:id/change-password - Self only
const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        // Only self can change own password
        if (req.user?.id !== id) {
            return res.status(403).render("error", { message: "Access denied" });
        }
        
        const user = await db.getUserById(id);
        if (!user) {
            return res.status(404).render("404", { message: "User not found" });
        }
        
        // Verify current password
        const valid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!valid) {
            return res.status(400).render("users/change-password", { 
                error: "Current password is incorrect" 
            });
        }
        
        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).render("users/change-password", { 
                error: "New password must be at least 8 characters" 
            });
        }
        
        // Hash and update
        const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await db.updateUser(id, {
            password_hash: newHash,
            last_password_change_at: new Date()
        });
        
        // Invalidate all sessions except current
        // await sessionsDb.invalidateOtherSessions(id, req.session.id);
        
        res.render("users/password-changed", { message: "Password updated successfully" });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /users/:id - Admin only
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        // Only super_admin can delete
        if (req.user?.role !== 'super_admin') {
            return res.status(403).render("error", { message: "Super admin required" });
        }
        
        // Can't delete yourself
        if (req.user?.id === id) {
            return res.status(400).render("error", { message: "Cannot delete yourself" });
        }
        
        // Check for linked staff member
        const staff = await db.getStaffByUserId(id); // You need this
        if (staff) {
            return res.status(409).render("error", { 
                message: "User has linked staff profile. Delete that first." 
            });
        }
        
        await db.deleteUser(id);
        res.redirect("/users");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getNewUserForm,
    createUser,
    getUserById,
    getEditUserForm,
    updateUser,
    changePassword,
    deleteUser
};