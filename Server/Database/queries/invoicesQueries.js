const {pool} =require("../pool");

async function getAllInvoices() {
    const { rows } = await pool.query("SELECT * FROM invoices");
    return rows;
}

async function getInvoiceById(id) {
    const { rows } = await pool.query("SELECT * FROM invoices WHERE id = $1", [id]);        
    return rows[0];
}   

async function generateInvoiceNumber() {
    const { rows } = await pool.query(
        "SELECT COUNT(*) as count FROM invoices WHERE EXTRACT(YEAR FROM issue_date) = EXTRACT(YEAR FROM CURRENT_DATE)"
    );
    const count = parseInt(rows[0].count) + 1;
    const year = new Date().getFullYear();
    return `INV-${year}-${String(count).padStart(4, '0')}`;
}

async function createNewInvoice(invoiceData) {
    const { rows } = await pool.query(
        `INSERT INTO invoices (invoice_number, client_id, appointment_id, project_id, issue_date, due_date, paid_date, subtotal, tax_amount, discount_amount, total_amount, status, currency, payment_method, transaction_id, notes, items)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
        [
            invoiceData.invoice_number,
            invoiceData.client_id,
            invoiceData.appointment_id,
            invoiceData.project_id,
            invoiceData.issue_date,
            invoiceData.due_date,
            invoiceData.paid_date,
            invoiceData.subtotal,
            invoiceData.tax_amount,
            invoiceData.discount_amount,
            invoiceData.total_amount,
            invoiceData.status,
            invoiceData.currency,
            invoiceData.payment_method,
            invoiceData.transaction_id,
            invoiceData.notes,
            invoiceData.items
        ]        
    );
    return rows[0];
}

async function updateInvoice(id, invoiceData) {
    const { rows } = await pool.query(
        `UPDATE invoices SET 
        invoice_number = $1, client_id = $2, appointment_id = $3, project_id = $4, issue_date = $5, due_date = $6, paid_date = $7, subtotal = $8, tax_amount = $9, discount_amount = $10, total_amount = $11, status = $12, currency = $13, payment_method = $14, transaction_id = $15, notes = $16, items = $17
        WHERE id = $18 RETURNING *`,   
        [ 
            invoiceData.invoice_number,
            invoiceData.client_id,
            invoiceData.appointment_id, 
            invoiceData.project_id,
            invoiceData.issue_date,
            invoiceData.due_date,
            invoiceData.paid_date,
            invoiceData.subtotal,
            invoiceData.tax_amount,
            invoiceData.discount_amount,
            invoiceData.total_amount,
            invoiceData.status,
            invoiceData.currency,
            invoiceData.payment_method,
            invoiceData.transaction_id,
            invoiceData.notes,
            invoiceData.items,
            id
        ]);
    return rows[0];
}

async function deleteInvoice(id) {
    const { rows } = await pool.query("DELETE FROM invoices WHERE id = $1 RETURNING *", [id]);
    return rows[0];
}

module.exports = {
    getAllInvoices,
    getInvoiceById,
    generateInvoiceNumber,
    createNewInvoice,
    updateInvoice,
    deleteInvoice
};