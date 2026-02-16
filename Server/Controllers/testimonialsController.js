const db = require("../Database/queries/testimonialsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await db.getAllTestimonials();
        res.render("testimonials/index", { testimonials: testimonials });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await db.getTestimonialById(id);
        if (testimonial) {
            res.render("testimonials/show", { testimonial: testimonial });
        } else {
            res.status(404).json({ error: "Testimonial not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewTestimonial = async (req, res) => {
    try {
        const testimonialData = req.body.testimonial || req.body;
        if (!testimonialData) {
            return res.status(400).render("error", { message: "Testimonial data is required" });
        }
        res.render("testimonials/new", { testimonial: testimonialData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewTestimonialPOST = async (req, res) => {
    try {
        const testimonialData = req.body.testimonial || req.body;
        if (!testimonialData) {
            return res.status(400).render("testimonials/new", { 
                error: "Testimonial data is required",
                testimonial: testimonialData 
            });
        }
        await db.createNewTestimonial(testimonialData);
        res.redirect("/testimonials");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid testimonial ID" });
        }
        const testimonial = await db.getTestimonialById(id);
        if (!testimonial) {
            return res.status(404).render("error", { message: "Testimonial not found" });
        }
        res.render("testimonials/edit", { testimonial });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTestimonialPOST = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonialData = req.body.testimonial || req.body;

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid testimonial ID" });
        }

        await db.updateTestimonial(id, testimonialData);
        res.redirect("/testimonials");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid testimonial ID" });
        }
        await db.deleteTestimonial(id);
        res.redirect("/testimonials");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTestimonials,
    getTestimonialById,
    createNewTestimonial,
    createNewTestimonialPOST,
    updateTestimonial,
    updateTestimonialPOST,
    deleteTestimonial
};