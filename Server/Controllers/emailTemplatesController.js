const db = require("../Database/queries/emailTemplatesQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllEmailTemplates = async (req, res) => {
    try {
        const emailTemplates = await db.getAllEmailTemplates();
        res.render("emailTemplates/index", { emailTemplates: emailTemplates });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEmailTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const emailTemplate = await db.getEmailTemplateById(id);
        if (emailTemplate) {
            res.render("emailTemplates/show", { emailTemplate: emailTemplate });
        } else {
            res.status(404).json({ error: "EmailTemplate not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewEmailTemplate = async (req, res) => {
    try {
        const emailTemplateData = req.body.emailTemplate || req.body;
        if (!emailTemplateData) {
            return res.status(400).render("error", { message: "EmailTemplate data is required" });
        }
        res.render("emailTemplates/new", { emailTemplate: {} });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewEmailTemplatePOST = async (req, res, next) => {
    try {
        const emailTemplateData = req.body.emailTemplate || req.body;
        if (!emailTemplateData || Object.keys(emailTemplateData).length === 0) {
            return res.status(400).render("emailTemplates/new", { 
                error: "EmailTemplate data is required",
                emailTemplate: {}
            });
        }
        await db.createNewEmailTemplate(emailTemplateData);
        res.redirect("/emailTemplates");
    } catch (error) {
        next(error);
    }
};

const updateEmailTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid emailTemplate ID" });
        }
        const emailTemplate = await db.getEmailTemplateById(id);
        if (!emailTemplate) {
            return res.status(404).render("error", { message: "EmailTemplate not found" });
        }
        res.render("emailTemplates/edit", { emailTemplate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEmailTemplatePOST = async (req, res) => {
    try {
        const { id } = req.params;
        const emailTemplateId = await db.getEmailTemplateById(id);
        const emailTemplateData = req.body.emailTemplate || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid emailTemplate ID" });
        }
        else if (!emailTemplateId) {
            return res.status(404).render("error", { message: "EmailTemplate not found" });
        }

        await db.updateEmailTemplate(id, emailTemplateData);
        res.redirect("/emailTemplates");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEmailTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const emailTemplateId = await db.getEmailTemplateById(id);
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid emailTemplate ID" });
        }
        else if (!emailTemplateId) {
            return res.status(404).render("error", { message: "EmailTemplate not found" });
        }
        await db.deleteEmailTemplate(id);
        res.redirect("/emailTemplates");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllEmailTemplates,
    getEmailTemplateById,
    createNewEmailTemplate,
    createNewEmailTemplatePOST,
    updateEmailTemplate,
    updateEmailTemplatePOST,
    deleteEmailTemplate
};