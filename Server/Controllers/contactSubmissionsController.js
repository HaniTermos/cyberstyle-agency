const db = require("../Database/queries/contactSubmissionsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllContactSubmissions = async (req, res) => {
    try {
        const contactSubmissions = await db.getAllContactSubmissions();
        res.render("contactSubmissions/index", { contactSubmissions: contactSubmissions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getContactSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const contactSubmission = await db.getContactSubmissionById(id);
        if (contactSubmission) {
            res.render("contactSubmissions/show", { contactSubmission: contactSubmission });
        } else {
            res.status(404).json({ error: "ContactSubmission not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewContactSubmission = async (req, res) => {
    try {
        const contactSubmissionData = req.body.contactSubmission || req.body;
        if (!contactSubmissionData) {
            return res.status(400).render("error", { message: "ContactSubmission data is required" });
        }
        res.render("contactSubmissions/new", { contactSubmission: contactSubmissionData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewContactSubmissionPOST = async (req, res) => {
    try {
        const contactSubmissionData = req.body.contactSubmission || req.body;
        if (!contactSubmissionData) {
            return res.status(400).render("contactSubmissions/new", { 
                error: "ContactSubmission data is required",
                contactSubmission: contactSubmissionData 
            });
        }
        await db.createNewContactSubmission(contactSubmissionData);
        res.redirect("/contactSubmissions");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateContactSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid contactSubmission ID" });
        }
        const contactSubmission = await db.getContactSubmissionById(id);
        if (!contactSubmission) {
            return res.status(404).render("error", { message: "ContactSubmission not found" });
        }
        res.render("contactSubmissions/edit", { contactSubmission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateContactSubmissionPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const contactSubmissionData = req.body.contactSubmission || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid contactSubmission ID" });
        }

        await db.updateContactSubmission(id, contactSubmissionData);
        res.redirect("/contactSubmissions");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteContactSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid contactSubmission ID" });
        }
        await db.deleteContactSubmission(id);
        res.redirect("/contactSubmissions");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllContactSubmissions,
    getContactSubmissionById,
    createNewContactSubmission,
    createNewContactSubmissionPOST,
    updateContactSubmission,
    updateContactSubmissionPOST,
    deleteContactSubmission
};