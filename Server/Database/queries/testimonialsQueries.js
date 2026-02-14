const pool = require("../pool");

async function getAllTestimonials() {
    const { rows } = await pool.query("SELECT * FROM testimonials");
    return rows;
}

async function getTestimonialById(id) {
    const { rows } = await pool.query("SELECT * FROM testimonials WHERE id = $1", [id]);
    return rows[0];
}

async function createNewTestimonial(testimonialData) {
    const { rows } = await pool.query(
        `INSERT INTO testimonials (client_id, project_id, content, rating, author_name, author_title, author_company, author_avatar_url, featured, display_order, is_approved, is_public, source, source_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
        [
            testimonialData.client_id,
            testimonialData.project_id,
            testimonialData.content,
            testimonialData.rating,
            testimonialData.author_name,
            testimonialData.author_title,
            testimonialData.author_company,
            testimonialData.author_avatar_url,
            testimonialData.featured,
            testimonialData.display_order,
            testimonialData.is_approved,
            testimonialData.is_public,
            testimonialData.source,
            testimonialData.source_url,
        ]
    );
    return rows[0];
}

async function updateTestimonial(id, testimonialData) {
    const { rows } = await pool.query(
        `UPDATE testimonials SET 
        client_id = $1, project_id = $2, content = $3, rating = $4, author_name = $5, author_title = $6, author_company = $7, author_avatar_url = $8, featured = $9, display_order = $10, is_approved = $11, is_public = $12, source = $13, source_url = $14
        WHERE id = $15 RETURNING *`,
        [
            testimonialData.client_id,
            testimonialData.project_id,
            testimonialData.content,
            testimonialData.rating,
            testimonialData.author_name,
            testimonialData.author_title,
            testimonialData.author_company,
            testimonialData.author_avatar_url,
            testimonialData.featured,
            testimonialData.display_order,
            testimonialData.is_approved,
            testimonialData.is_public,
            testimonialData.source,
            testimonialData.source_url,
            id,
        ]
    );
    return rows[0];
}

async function deleteTestimonial(id) {
    const { rows } = await pool.query("DELETE FROM testimonials WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllTestimonials,
    getTestimonialById,
    getPendingTestimonials,
    getFeaturedTestimonials,
    approveTestimonial,
    createNewTestimonial,
    updateTestimonial,
    deleteTestimonial,
};