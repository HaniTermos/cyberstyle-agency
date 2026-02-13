const pool = require("../pool");

async function getAllProjects() {
    const { rows } = await pool.query("SELECT * FROM projects");
    return rows;
}

async function getProjectById(id) {
    const { rows } = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);
    return rows[0];
}

async function createNewProject(projectData) {
    const { rows } = await pool.query(`
        INSERT INTO projects (title, slug, tagline, client_id, client_name, description, full_content, challenge, solution, results, category, subcategories, tags, industries, start_date, end_date, project_duration_weeks, budget_range, live_url, github_url, case_study_url, featured_image_url, gallery_images, videos, technologies, tools, featured, display_order, is_published, published_at, views_count, shares_count, meta_title, meta_description, meta_keywords) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, NOW(), 0, 0, $28, $29, $30)
        RETURNING *
    `, [
        projectData.title,
        projectData.slug,
        projectData.tagline,
        projectData.client_id,
        projectData.client_name,
        projectData.description,
        projectData.full_content,
        projectData.challenge,
        projectData.solution,
        projectData.results,
        projectData.category,
        projectData.subcategories,
        projectData.tags,
        projectData.industries,
        projectData.start_date,
        projectData.end_date,
        projectData.project_duration_weeks,
        projectData.budget_range,
        projectData.live_url,
        projectData.github_url,
        projectData.case_study_url,
        projectData.featured_image_url,
        projectData.gallery_images,
        projectData.videos,
        projectData.technologies,
        projectData.tools,
        projectData.featured,
        projectData.display_order,
        projectData.is_published,
        projectData.meta_title,
        projectData.meta_description,
        projectData.meta_keywords
    ]);
    return rows[0];
}

async function updateProject(id, projectData) {
    const { rows } = await pool.query(`
        UPDATE projects SET
            title = $1, slug = $2, tagline = $3, client_id = $4, client_name = $5,
            description = $6, full_content = $7, challenge = $8, solution = $9, 
            results = $10, category = $11, subcategories = $12, tags = $13, 
            industries = $14, start_date = $15, end_date = $16, 
            project_duration_weeks = $17, budget_range = $18, live_url = $19, 
            github_url = $20, case_study_url = $21, featured_image_url = $22, 
            gallery_images = $23, videos = $24, technologies = $25, tools = $26, 
            featured = $27, display_order = $28, is_published = $29,
            -- Only set published_at if transitioning from unpublished to published
            published_at = CASE 
                WHEN is_published = false AND $29 = true THEN NOW()
                ELSE published_at 
            END,
            meta_title = $30, meta_description = $31, meta_keywords = $32,
            updated_at = NOW()
        WHERE id = $33
        RETURNING *`,
        [
            projectData.title, projectData.slug, projectData.tagline,
            projectData.client_id, projectData.client_name, projectData.description,
            projectData.full_content, projectData.challenge, projectData.solution,
            projectData.results, projectData.category, projectData.subcategories,
            projectData.tags, projectData.industries, projectData.start_date,
            projectData.end_date, projectData.project_duration_weeks,
            projectData.budget_range, projectData.live_url, projectData.github_url,
            projectData.case_study_url, projectData.featured_image_url,
            projectData.gallery_images, projectData.videos, projectData.technologies,
            projectData.tools, projectData.featured, projectData.display_order,
            projectData.is_published,
            projectData.meta_title, projectData.meta_description,
            projectData.meta_keywords, id
        ]
    );
    return rows[0];
}
async function deleteProject(id) {
    const { rows } = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllProjects,
    getProjectById,
    createNewProject,
    updateProject,
    deleteProject
};