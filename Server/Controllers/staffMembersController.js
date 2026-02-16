const db = require("../Database/queries/staffMembersQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllStaffMembers = async (req, res) => {
    try {
        const staffMembers = await db.getAllStaffMembers();
        res.render("staffMembers/index", { staffMembers: staffMembers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStaffMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const staffMember = await db.getStaffMemberById(id);
        if (staffMember) {
            res.render("staffMembers/show", { staffMember: staffMember });
        } else {
            res.status(404).json({ error: "StaffMember not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewStaffMember = async (req, res) => {
    try {
        const staffMemberData = req.body.staffMember || req.body;
        if (!staffMemberData) {
            return res.status(400).render("error", { message: "StaffMember data is required" });
        }
        res.render("staffMembers/new", { staffMember: staffMemberData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewStaffMemberPOST = async (req, res) => {
    try {
        const staffMemberData = req.body.staffMember || req.body;
        if (!staffMemberData) {
            return res.status(400).render("staffMembers/new", { 
                error: "StaffMember data is required",
                staffMember: staffMemberData 
            });
        }
        await db.createNewStaffMember(staffMemberData);
        res.redirect("/staffMembers");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStaffMember = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid staffMember ID" });
        }
        const staffMember = await db.getStaffMemberById(id);
        if (!staffMember) {
            return res.status(404).render("error", { message: "StaffMember not found" });
        }
        res.render("staffMembers/edit", { staffMember });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStaffMemberPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const staffMemberData = req.body.staffMember || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid staffMember ID" });
        }

        await db.updateStaffMember(id, staffMemberData);
        res.redirect("/staffMembers");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteStaffMember = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid staffMember ID" });
        }
        await db.deleteStaffMember(id);
        res.redirect("/staffMembers");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllStaffMembers,
    getStaffMemberById,
    createNewStaffMember,
    createNewStaffMemberPOST,
    updateStaffMember,
    updateStaffMemberPOST,
    deleteStaffMember
};