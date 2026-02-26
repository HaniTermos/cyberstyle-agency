const db = require("../Database/queries/contactSubmissionsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET /contact-submissions - Admin list all
const getAllContactSubmissions = async (req, res) => {
    try {
        const { status, inquiry_type } = req.query;
        
        let contactSubmissions;
        if (status) {
            contactSubmissions = await db.getSubmissionsByStatus(status);
        } else {
            contactSubmissions = await db.getAllContactSubmissions();
        }
        
        res.render("contactSubmissions/index", { contactSubmissions, filters: req.query });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /contact-submissions/new - Show public form (optional, usually on contact page)
const getNewContactSubmissionForm = async (req, res) => {
    try {
        res.render("contactSubmissions/new");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /contact-submissions - Public submission
const createContactSubmission = async (req, res) => {
    try {
        const { name, email, phone, company, subject, message, inquiry_type, interested_service_ids, budget_range, timeline } = req.body;
        
        // Validation
        if (!name || !email || !message || !inquiry_type) {
            return res.status(400).render("contactSubmissions/new", { 
                error: "Name, email, message, and inquiry type are required",
                submission: req.body 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).render("contactSubmissions/new", { 
                error: "Invalid email format",
                submission: req.body 
            });
        }
        
        await db.createContactSubmission({
            name,
            email,
            phone: phone || null,
            company: company || null,
            subject: subject || null,
            message,
            inquiry_type,
            interested_service_ids: interested_service_ids || [],
            budget_range: budget_range || null,
            timeline: timeline || null,
            status: 'new',
            assigned_to: null,
            response_sent: false,
            response_sent_at: null,
            response_notes: null
        });
        
        // Redirect to thank you page
        res.redirect("/contact/thank-you");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /contact-submissions/:id - Admin view one
const getContactSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const contactSubmission = await db.getAllContactSubmissionsById(id);
        
        if (!contactSubmission) {
            return res.status(404).render("404", { message: "Not found" });
        }
        
        res.render("contactSubmissions/show", { contactSubmission });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /contact-submissions/:id/assign - Admin assigns to staff
const assignContactSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        await db.assignSubmission(id, userId);
        res.redirect(`/contact-submissions/${id}`);
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /contact-submissions/:id/respond - Admin marks as responded
const respondToContactSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        await db.markAsResponded(id, notes);
        res.redirect(`/contact-submissions/${id}`);
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /contact-submissions/:id - Admin delete
const deleteContactSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        await db.deleteContactSubmissionById(id);
        res.redirect("/contact-submissions");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllContactSubmissions,
    getNewContactSubmissionForm,
    createContactSubmission,
    getContactSubmissionById,
    assignContactSubmission,
    respondToContactSubmission,
    deleteContactSubmission
};