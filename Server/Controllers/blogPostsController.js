const db = require("../Database/queries/blogPostsQueries");
const usersDb = require("../Database/queries/usersQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET /blog-posts - List all (public)
const getAllBlogPosts = async (req, res) => {
    try {
        // Use getPublishedPosts for public, getAllBlogPosts for admin
        const blogPosts = await db.getPublishedPosts();
        res.render("blogPosts/index", { blogPosts });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};


const getNewBlogPostForm = async (req, res) => {
    try {
        const users = await usersDb.getAllUsers();
        res.render("blogPosts/new", { users });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /blog-posts - Create (admin/author)
const createBlogPost = async (req, res) => {
    try {
        const blogPostData = req.body;
        
        // Validation
        if (!blogPostData.title || !blogPostData.slug || !blogPostData.content) {
            const users = await usersDb.getAllUsers();
            return res.status(400).render("blogPosts/new", { 
                error: "Title, slug, and content are required",
                users,
                blogPost: blogPostData 
            });
        }
        
        // Set published_at if publishing now
        if (blogPostData.is_published === 'true' || blogPostData.is_published === true) {
            blogPostData.is_published = true;
            blogPostData.published_at = new Date();
        }
        
        await db.createNewBlogPost(blogPostData);
        res.redirect("/blog-posts");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /blog-posts/:id - View one (public)
const getBlogPostById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const blogPost = await db.getBlogPostById(id);
        
        if (!blogPost) {
            return res.status(404).render("404", { message: "Not found" });
        }
        
        // Increment view count
        await db.incrementViewCount(id);
        
        res.render("blogPosts/show", { blogPost });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /blog-posts/:id/edit - Show edit form (admin/author)
const getEditBlogPostForm = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const blogPost = await db.getBlogPostById(id);
        
        if (!blogPost) {
            return res.status(404).render("404", { message: "Not found" });
        }
        
        const users = await usersDb.getAllUsers();
        res.render("blogPosts/edit", { blogPost, users });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// PUT /blog-posts/:id - Update (admin/author)
const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const blogPostData = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        // Handle publish/unpublish
        if (blogPostData.is_published === 'true' || blogPostData.is_published === true) {
            blogPostData.is_published = true;
        } else {
            blogPostData.is_published = false;
        }
        
        await db.updateBlogPost(id, blogPostData);
        res.redirect(`/blog-posts/${id}`);
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /blog-posts/:id - Delete (admin)
const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        await db.deleteBlogPostById(id);
        res.redirect("/blog-posts");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllBlogPosts,
    getNewBlogPostForm,
    createBlogPost,
    getBlogPostById,
    getEditBlogPostForm,
    updateBlogPost,
    deleteBlogPost
};