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

const getPageViewById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const pageView = await db.getPageViewById(id);

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid pageView ID" });
        }
        if (pageView) {
            res.render("pageViews/show", { pageView: pageView });
        } else {
            res.status(404).json({ error: "PageView not found" });
        }
    } catch (error) {
        next(error);
    }
};

const createNewPageView = async (req, res, next) => {
    try {
        res.render("pageViews/new", { pageView: {}, error: null });
    } catch (error) {
        next(error);
    }
};

const createNewPageViewPOST = async (req, res, next) => {
    try {
        const pageViewData = req.body.pageView || req.body;
        if (!pageViewData || Object.keys(pageViewData).length === 0) {
            return res.status(400).render("pageViews/new", { 
                error: "PageView data is required",
                pageView: pageViewData 
            });
        }
        await db.createNewPageView(pageViewData);
        res.redirect("/pageViews");
    } catch (error) {
        next(error);
    }
};

const updatePageView = async (req, res, next) => {
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
        next(error);
    }
};

const updatePageViewPOST = async (req, res, next) => {
    try {
        const { id } = req.params;
        const pageViewData = req.body.pageView || req.body;
        const existing = await db.getPageViewById(id);

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid pageView ID" });
        }
        if (!existing) {
            return res.status(404).render("error", { message: "PageView not found" });
        }

        await db.updatePageView(id, pageViewData);
        res.redirect("/pageViews");
    } catch (error) {
        next(error);
    }
};

const deletePageView = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await db.getPageViewById(id);

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid pageView ID" });
        }
        if (!existing) {
            return res.status(404).render("error", { message: "PageView not found" });
        }

        await db.deletePageView(id);
        res.redirect("/pageViews");
    } catch (error) {
        next(error);
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