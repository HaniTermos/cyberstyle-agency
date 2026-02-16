const db = require("../Database/queries/blogPostsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await db.getAllBlogPosts();
        res.render("blogPosts/index", { blogPosts: blogPosts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBlogPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const blogPost = await db.getBlogPostById(id);
        if (blogPost) {
            res.render("blogPosts/show", { blogPost: blogPost });
        } else {
            res.status(404).json({ error: "BlogPost not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewBlogPost = async (req, res) => {
    try {
        const blogPostData = req.body.blogPost || req.body;
        if (!blogPostData) {
            return res.status(400).render("error", { message: "BlogPost data is required" });
        }
        res.render("blogPosts/new", { blogPost: blogPostData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewBlogPostPOST = async (req, res) => {
    try {
        const blogPostData = req.body.blogPost || req.body;
        if (!blogPostData) {
            return res.status(400).render("blogPosts/new", { 
                error: "BlogPost data is required",
                blogPost: blogPostData 
            });
        }
        await db.createNewBlogPost(blogPostData);
        res.redirect("/blogPosts");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid blogPost ID" });
        }
        const blogPost = await db.getBlogPostById(id);
        if (!blogPost) {
            return res.status(404).render("error", { message: "BlogPost not found" });
        }
        res.render("blogPosts/edit", { blogPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBlogPostPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const blogPostData = req.body.blogPost || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid blogPost ID" });
        }

        await db.updateBlogPost(id, blogPostData);
        res.redirect("/blogPosts");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid blogPost ID" });
        }
        await db.deleteBlogPost(id);
        res.redirect("/blogPosts");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllBlogPosts,
    getBlogPostById,
    createNewBlogPost,
    createNewBlogPostPOST,
    updateBlogPost,
    updateBlogPostPOST,
    deleteBlogPost
};