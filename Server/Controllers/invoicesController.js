const db = require("../Database/queries/invoicesQueries");

const isValidUUID = (id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const getAllInvoices = async (req, res) => {
    try {
        const invoices = await db.getAllInvoices();
        res.render("invoices/index", { invoices: invoices });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await db.getInvoiceById(id);

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid invoice ID" });
        }
        if (invoice) {
            res.render("invoices/show", { invoice: invoice });
        } else {
            res.status(404).json({ error: "Invoice not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewInvoice = async (req, res, next) => {
    try {
        res.render("invoices/new", { invoice: {}, error: null });
    } catch (error) {
        next(error);
    }
};

const createNewInvoicePOST = async (req, res, next) => {
    try {
        const invoiceData = req.body.invoice || req.body;
        if (!invoiceData || Object.keys(invoiceData).length === 0) {
            return res.status(400).render("invoices/new", { 
                error: "Invoice data is required",
                invoice: req.body || {} 
            });
        }
        await db.createNewInvoice(invoiceData);
        res.redirect("/invoices");
    } catch (error) {
        next(error);
    }
};

const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid invoice ID" });
        }
        const invoice = await db.getInvoiceById(id);
        if (!invoice) {
            return res.status(404).render("error", { message: "Invoice not found" });
        }
        res.render("invoices/edit", { invoice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateInvoicePOST = async (req, res, next) => {
    try {
        const { id } = req.params;
        const invoiceData = req.body.invoice || req.body;
         const existing = await db.getInvoiceById(id);

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid invoice ID" });
        }
        if (!existing) {
            return res.status(404).render("error", { message: "Invoice not found" });
        }

        await db.updateInvoice(id, invoiceData);
        res.redirect("/invoices");
    } catch (error) {
        next(error);
    }
};

const deleteInvoice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const existing = await db.getInvoiceById(id);

        if (!isValidUUID(id)) {
            return res.status(400).render("error", { message: "Invalid invoice ID" });
        }
        if (!existing) {
            return res.status(404).render("error", { message: "Invoice not found" });
        }

        await db.deleteInvoice(id);
        res.redirect("/invoices");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInvoices,
    getInvoiceById,
    createNewInvoice,
    createNewInvoicePOST,
    updateInvoice,
    updateInvoicePOST,
    deleteInvoice
};