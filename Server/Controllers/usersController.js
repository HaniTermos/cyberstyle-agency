const db = require("../Database/queries/usersQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllUsers = async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.render("users/index", { users: users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.getUserById(id);
        if (user) {
            res.render("users/show", { user: user });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewUser = async (req, res) => {
    try {
        const userData = req.body.user || req.body;
        if (!userData) {
            return res.status(400).render("error", { message: "User data is required" });
        }
        res.render("users/new", { user: userData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewUserPOST = async (req, res) => {
    try {
        const userData = req.body.user || req.body;
        if (!userData) {
            return res.status(400).render("users/new", { 
                error: "User data is required",
                user: userData 
            });
        }
        await db.createNewUser(userData);
        res.redirect("/users");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid user ID" });
        }
        const user = await db.getUserById(id);
        if (!user) {
            return res.status(404).render("error", { message: "User not found" });
        }
        res.render("users/edit", { user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUserPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body.user || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid user ID" });
        }

        await db.updateUser(id, userData);
        res.redirect("/users");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid user ID" });
        }
        await db.deleteUser(id);
        res.redirect("/users");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createNewUser,
    createNewUserPOST,
    updateUser,
    updateUserPOST,
    deleteUser
};