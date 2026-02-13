const { pool } =require("../pool");

async function getAllEmailTemplates() {
    const { rows } = await pool.query("SELECT * FROM email_templates");
    return rows;
}

async function getEmailTemplateById(id) {
    const { rows } = await pool.query("SELECT * FROM email_templates WHERE id = $1", [id]);
    return rows[0];
}

// Add to email_templatesQueries.js
async function getTemplateByKey(templateKey) {
    const { rows } = await pool.query(
        "SELECT * FROM email_templates WHERE template_key = $1 AND is_active = true",
        [templateKey]
    );
    return rows[0];
}

async function createEmailTemplate(emailTemplateData) {
    const { rows } = await pool.query(
        `INSERT INTO email_templates (template_name, template_key, subject, body_html, body_text, variables, is_active, category) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
            emailTemplateData.template_name,
            emailTemplateData.template_key,
            emailTemplateData.subject,
            emailTemplateData.body_html,
            emailTemplateData.body_text,
            emailTemplateData.variables,
            emailTemplateData.is_active,
            emailTemplateData.category
        ]);
    return rows[0];
}

async function updateEmailTemplate(id, emailTemplateData) {
    const { rows } = await pool.query(
        `UPDATE email_templates SET template_name = $1, template_key = $2, subject = $3, body_html = $4, body_text = $5, variables = $6, is_active = $7, category = $8 WHERE id = $9 RETURNING *`,
        [
            emailTemplateData.template_name,
            emailTemplateData.template_key,
            emailTemplateData.subject,
            emailTemplateData.body_html,
            emailTemplateData.body_text,
            emailTemplateData.variables,
            emailTemplateData.is_active,
            emailTemplateData.category,
            id
        ]);
    return rows[0];
}

async function deleteEmailTemplateById(id) {
    const { rows } = await pool.query("DELETE FROM email_templates WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllEmailTemplates,
    getEmailTemplateById,
    getTemplateByKey,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplateById
};