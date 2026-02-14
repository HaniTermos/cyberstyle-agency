const {pool} =require("../pool");

async function getAllPageViews() {
    const {rows} = await pool.query("SELECT * FROM page_views");
    return rows;
}

async function getPageViewsByPageId(pageId) {
    const {rows} = await pool.query("SELECT * FROM page_views WHERE page_id = $1", [pageId]);
    return rows;
}

async function createPageView(pageViewsData) {
    const {rows} = await pool.query(
        `INSERT INTO page_views (page_path, page_title, page_type, visitor_id, session_id, user_id, user_agent, referrer, ip_address, country_code, city, time_on_page, scroll_depth, interacted, device_type, browser_name, browser_version, os_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
        [
            pageViewsData.page_path,
            pageViewsData.page_title,
            pageViewsData.page_type,
            pageViewsData.visitor_id,
            pageViewsData.session_id,
            pageViewsData.user_id,
            pageViewsData.user_agent,
            pageViewsData.referrer,
            pageViewsData.ip_address,
            pageViewsData.country_code,
            pageViewsData.city,
            pageViewsData.time_on_page,
            pageViewsData.scroll_depth,
            pageViewsData.interacted,
            pageViewsData.device_type,
            pageViewsData.browser_name,
            pageViewsData.browser_version,
            pageViewsData.os_name
        ]
    );
    return rows[0];
}

async function deletePageViewById(id) {
    const {rows} = await pool.query("DELETE FROM page_views WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllPageViews,
    getPageViewsByPageId,
    createPageView,
    deletePageViewById
};