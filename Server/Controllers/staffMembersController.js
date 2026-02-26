const db = require("../Database/queries/staffMemberQueries");
const usersDb = require("../Database/queries/usersQueries");
const servicesDb = require("../Database/queries/servicesQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET /staff-members - Admin: list all
const getAllStaffMembers = async (req, res) => {
    try {
        const staffMembers = await db.getAllStaffMembers();
        res.render("staffMembers/index", { staffMembers });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /staff-members/available - Public: available for booking
const getAvailableStaff = async (req, res) => {
    try {
        const { serviceId, date } = req.query;
        
        if (!serviceId || !date) {
            return res.status(400).render("error", { message: "Service and date required" });
        }
        
        const staff = await db.getAvailableStaff(date, serviceId);
        res.render("staffMembers/available", { staff, serviceId, date });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /staff-members/new - Admin: show form
const getNewStaffMemberForm = async (req, res) => {
    try {
        // Get unlinked users (not already staff)
        const allUsers = await usersDb.getAllUsers();
        const existingStaff = await db.getAllStaffMembers();
        const linkedUserIds = existingStaff.map(s => s.user_id).filter(Boolean);
        const availableUsers = allUsers.filter(u => !linkedUserIds.includes(u.id));
        
        const services = await servicesDb.getAllServices();
        
        res.render("staffMembers/new", { users: availableUsers, services });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /staff-members - Admin: create
const createStaffMember = async (req, res) => {
    try {
        const staffData = req.body;
        
        // Validation
        if (!staffData.first_name || !staffData.last_name || !staffData.email) {
            const users = await usersDb.getAllUsers();
            const services = await servicesDb.getAllServices();
            return res.status(400).render("staffMembers/new", { 
                error: "First name, last name, and email are required",
                users,
                services,
                staffMember: staffData 
            });
        }
        
        // Parse service_ids from form (checkboxes or multi-select)
        if (staffData.service_ids && typeof staffData.service_ids === 'string') {
            staffData.service_ids = [staffData.service_ids];
        }
        
        // Set defaults
        staffData.is_active = staffData.is_active === 'true' || staffData.is_active === true;
        staffData.is_accepting_appointments = staffData.is_accepting_appointments === 'true' || staffData.is_accepting_appointments === true;
        staffData.working_hours = staffData.working_hours || {
            monday: { start: "09:00", end: "17:00", available: true },
            // ... default schedule
        };
        
        await db.createNewStaffMember(staffData);
        res.redirect("/staff-members");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /staff-members/:id - Public/Admin: view profile
const getStaffMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const staffMember = await db.getStaffMemberById(id);
        
        if (!staffMember) {
            return res.status(404).render("404", { message: "Staff member not found" });
        }
        
        // Get services they provide
        const services = await servicesDb.getAllServices();
        const staffServices = services.filter(s => 
            staffMember.service_ids?.includes(s.id)
        );
        
        res.render("staffMembers/show", { staffMember, staffServices });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /staff-members/:id/edit - Admin: edit form
const getEditStaffMemberForm = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const staffMember = await db.getStaffMemberById(id);
        
        if (!staffMember) {
            return res.status(404).render("404", { message: "Staff member not found" });
        }
        
        const users = await usersDb.getAllUsers();
        const services = await servicesDb.getAllServices();
        
        res.render("staffMembers/edit", { staffMember, users, services });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// PUT /staff-members/:id - Admin: update
const updateStaffMember = async (req, res) => {
    try {
        const { id } = req.params;
        const staffData = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        // Parse service_ids
        if (staffData.service_ids) {
            staffData.service_ids = Array.isArray(staffData.service_ids) 
                ? staffData.service_ids 
                : [staffData.service_ids];
        }
        
        // Convert booleans
        if (staffData.is_active !== undefined) {
            staffData.is_active = staffData.is_active === 'true' || staffData.is_active === true;
        }
        if (staffData.is_accepting_appointments !== undefined) {
            staffData.is_accepting_appointments = staffData.is_accepting_appointments === 'true' || staffData.is_accepting_appointments === true;
        }
        
        await db.updateStaffMember(id, staffData);
        res.redirect(`/staff-members/${id}`);
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /staff-members/:id/toggle - Admin: quick toggle availability
const toggleAcceptingAppointments = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const staffMember = await db.getStaffMemberById(id);
        if (!staffMember) {
            return res.status(404).render("404", { message: "Not found" });
        }
        
        await db.updateStaffMember(id, {
            is_accepting_appointments: !staffMember.is_accepting_appointments
        });
        
        res.redirect("/staff-members");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /staff-members/:id - Admin: delete
const deleteStaffMember = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        // Check for future appointments
        const appointments = await db.getAppointmentsByStaffId(id); // You need this query
        const futureAppointments = appointments?.filter(a => 
            new Date(a.scheduled_start) > new Date() &&
            ['pending', 'confirmed'].includes(a.status)
        );
        
        if (futureAppointments?.length > 0) {
            return res.status(409).render("error", { 
                message: `Cannot delete: ${futureAppointments.length} future appointments` 
            });
        }
        
        await db.deleteStaffMember(id);
        res.redirect("/staff-members");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllStaffMembers,
    getAvailableStaff,
    getNewStaffMemberForm,
    createStaffMember,
    getStaffMemberById,
    getEditStaffMemberForm,
    updateStaffMember,
    toggleAcceptingAppointments,
    deleteStaffMember
};