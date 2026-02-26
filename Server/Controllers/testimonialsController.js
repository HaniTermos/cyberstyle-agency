const db = require("../Database/queries/testimonialsQueries");
const clientsDb = require("../Database/queries/clientsQueries");
const projectsDb = require("../Database/queries/projectsQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// GET /testimonials - Public: approved testimonials
const getAllTestimonials = async (req, res) => {
    try {
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'manager';
        
        // Public sees only approved & public
        const testimonials = isAdmin 
            ? await db.getAllTestimonials()
            : await db.getFeaturedTestimonials(); // or getPublicTestimonials()
        
        res.render("testimonials/index", { testimonials, isAdmin });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /testimonials/new - Public: submit form
const getNewTestimonialForm = async (req, res) => {
    try {
        // Optional: link to existing client/project
        const clients = await clientsDb.getAllClients();
        const projects = await projectsDb.getAllProjects();
        
        res.render("testimonials/new", { clients, projects });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /testimonials - Public: submit (goes to pending)
const createTestimonial = async (req, res) => {
    try {
        const testimonialData = req.body;
        
        // Validation
        if (!testimonialData.content || !testimonialData.author_name) {
            const clients = await clientsDb.getAllClients();
            const projects = await projectsDb.getAllProjects();
            return res.status(400).render("testimonials/new", { 
                error: "Content and author name are required",
                clients,
                projects,
                testimonial: testimonialData 
            });
        }
        
        // Public submissions start as not approved
        testimonialData.is_approved = false;
        testimonialData.is_public = false;
        testimonialData.featured = false;
        testimonialData.approved_at = null;
        
        // Rating validation (1-5)
        const rating = parseInt(testimonialData.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).render("testimonials/new", {
                error: "Rating must be 1-5",
                testimonial: testimonialData
            });
        }
        
        await db.createNewTestimonial(testimonialData);
        
        // Thank you page for public
        res.render("testimonials/thank-you");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /testimonials/pending - Admin: view pending approval
const getPendingTestimonials = async (req, res) => {
    try {
        const testimonials = await db.getPendingTestimonials();
        res.render("testimonials/pending", { testimonials });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /testimonials/:id - Public/Admin: view single
const getTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const testimonial = await db.getTestimonialById(id);
        
        if (!testimonial) {
            return res.status(404).render("404", { message: "Testimonial not found" });
        }
        
        // Check visibility
        const isAdmin = req.user?.role === 'admin' || req.user?.role === 'manager';
        if (!testimonial.is_public && !isAdmin) {
            return res.status(403).render("error", { message: "Not available" });
        }
        
        res.render("testimonials/show", { testimonial });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// GET /testimonials/:id/edit - Admin: edit form
const getEditTestimonialForm = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const testimonial = await db.getTestimonialById(id);
        
        if (!testimonial) {
            return res.status(404).render("404", { message: "Not found" });
        }
        
        const clients = await clientsDb.getAllClients();
        const projects = await projectsDb.getAllProjects();
        
        res.render("testimonials/edit", { testimonial, clients, projects });
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// PUT /testimonials/:id - Admin: update
const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonialData = req.body;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        // Convert booleans
        if (testimonialData.is_approved !== undefined) {
            testimonialData.is_approved = testimonialData.is_approved === 'true' || testimonialData.is_approved === true;
            if (testimonialData.is_approved) {
                testimonialData.approved_at = new Date();
            }
        }
        if (testimonialData.is_public !== undefined) {
            testimonialData.is_public = testimonialData.is_public === 'true' || testimonialData.is_public === true;
        }
        if (testimonialData.featured !== undefined) {
            testimonialData.featured = testimonialData.featured === 'true' || testimonialData.featured === true;
        }
        
        await db.updateTestimonial(id, testimonialData);
        res.redirect(`/testimonials/${id}`);
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /testimonials/:id/approve - Admin: quick approve
const approveTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        await db.approveTestimonial(id); // Your query has this method
        res.redirect("/testimonials/pending");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// POST /testimonials/:id/feature - Admin: toggle featured
const toggleFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        const testimonial = await db.getTestimonialById(id);
        if (!testimonial) {
            return res.status(404).render("404", { message: "Not found" });
        }
        
        await db.updateTestimonial(id, {
            featured: !testimonial.featured
        });
        
        res.redirect("/testimonials");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

// DELETE /testimonials/:id - Admin: delete
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid ID" });
        }
        
        await db.deleteTestimonial(id);
        res.redirect("/testimonials");
    } catch (error) {
        res.status(500).render("error", { message: error.message });
    }
};

module.exports = {
    getAllTestimonials,
    getNewTestimonialForm,
    createTestimonial,
    getPendingTestimonials,
    getTestimonialById,
    getEditTestimonialForm,
    updateTestimonial,
    approveTestimonial,
    toggleFeatured,
    deleteTestimonial
};