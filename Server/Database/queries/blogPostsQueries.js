const { pool } =require("../pool");

async function getAllBlogPosts() {
    const { rows } = await pool.query("SELECT * FROM blog_posts");
    return rows;
}

async function getBlogPostById(id) {
    const { rows } = await pool.query("SELECT * FROM blog_posts WHERE id = $1", [id]);
    return rows[0];
}

async function createBlogPost(blogPostData) {
    const { rows } = await pool.query(`
        INSERT INTO blog_posts (title, slug, excerpt, content, featured_image_url, category, tags, author_id,author_name, co_author_ids, is_published, published_at, scheduled_publish_at, meta_title, meta_description, canonical_url, views_count, likes_count, shares_count, comments_count, read_time_minutes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        RETURNING *`,
    [
        blogPostData.title,
        blogPostData.slug,
        blogPostData.excerpt,
        blogPostData.content,
        blogPostData.featured_image_url,
        blogPostData.category,
        blogPostData.tags,
        blogPostData.author_id,
        blogPostData.author_name,
        blogPostData.co_author_ids,
        blogPostData.is_published,
        blogPostData.published_at,
        blogPostData.scheduled_publish_at,
        blogPostData.meta_title,
        blogPostData.meta_description,
        blogPostData.canonical_url,
        blogPostData.views_count,
        blogPostData.likes_count,
        blogPostData.shares_count,
        blogPostData.comments_count,
        blogPostData.read_time_minutes
    ]);
    return rows[0];
}

async function updateBlogPost(id, blogPostData) {
    const { rows } = await pool.query(`
        UPDATE blog_posts SET title = $1, slug = $2, excerpt = $3, content = $4, featured_image_url = $5, category = $6, tags = $7, author_id = $8, author_name = $9, co_author_ids = $10, is_published = $11, published_at = $12, scheduled_publish_at = $13, meta_title = $14, meta_description = $15, canonical_url = $16, views_count = $17, likes_count = $18, shares_count = $19, comments_count = $20, read_time_minutes = $21 WHERE id = $22 RETURNING *`,
    [
        blogPostData.title,
        blogPostData.slug,
        blogPostData.excerpt,
        blogPostData.content,
        blogPostData.featured_image_url,
        blogPostData.category,
        blogPostData.tags,
        blogPostData.author_id,
        blogPostData.author_name,
        blogPostData.co_author_ids,
        blogPostData.is_published,
        blogPostData.published_at,
        blogPostData.scheduled_publish_at,
        blogPostData.meta_title,
        blogPostData.meta_description,
        blogPostData.canonical_url,
        blogPostData.views_count,
        blogPostData.likes_count,
        blogPostData.shares_count,
        blogPostData.comments_count,
        blogPostData.read_time_minutes,
        id
    ]);
    return rows[0];
}

async function deleteBlogPostById(id) {
    const { rows } = await pool.query("DELETE FROM blog_posts WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllBlogPosts,
    getBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPostById
};