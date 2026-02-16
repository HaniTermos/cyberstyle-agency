const db = require("../Database/queries/pageViewsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllPageViews = async (req, res) => {
    try {
        const pageViews = await db.getAllPageViews();
        res.render("pageViews/index", { pageViews: pageViews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPageViewById = async (req, res) => {
    try {
        const { id } = req.params;
        const pageView = await db.getPageViewById(id);
        if (pageView) {
            res.render("pageViews/show", { pageView: pageView });
        } else {
            res.status(404).json({ error: "PageView not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewPageView = async (req, res) => {
    try {
        const pageViewData = req.body.pageView || req.body;
        if (!pageViewData) {
            return res.status(400).render("error", { message: "PageView data is required" });
        }
        res.render("pageViews/new", { pageView: pageViewData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewPageViewPOST = async (req, res) => {
    try {
        const pageViewData = req.body.pageView || req.body;
        if (!pageViewData) {
            return res.status(400).render("pageViews/new", { 
                error: "PageView data is required",
                pageView: pageViewData 
            });
        }
        await db.createNewPageView(pageViewData);
        res.redirect("/pageViews");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePageView = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid pageView ID" });
        }
        const pageView = await db.getPageViewById(id);
        if (!pageView) {
            return res.status(404).render("error", { message: "PageView not found" });
        }
        res.render("pageViews/edit", { pageView });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updatePageViewPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const pageViewData = req.body.pageView || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid pageView ID" });
        }

        await db.updatePageView(id, pageViewData);
        res.redirect("/pageViews");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePageView = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid pageView ID" });
        }
        await db.deletePageView(id);
        res.redirect("/pageViews");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPageViews,
    getPageViewById,
    createNewPageView,
    createNewPageViewPOST,
    updatePageView,
    updatePageViewPOST,
    deletePageView
};