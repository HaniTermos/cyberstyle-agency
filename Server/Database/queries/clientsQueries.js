const pool = require("../pool");

async function getAllClients() {
    const { rows } = await pool.query("SELECT * FROM clients");
    return rows;        
}

async function getClientById(id) {
    const { rows } = await pool.query("SELECT * FROM clients WHERE id = $1", [id]);
    return rows[0];        
}

async function getClientByEmail(email) {
    const { rows } = await pool.query(
        "SELECT * FROM clients WHERE email = $1", 
        [email]
    );
    return rows[0];
}

async function createNewClient(first_name, last_name, email, phone, company, position, contact_method, newsletter_optin, source, notes, tags) {
    const { rows } = await pool.query("INSERT INTO clients (first_name, last_name, email, phone, company, position, contact_method, newsletter_optin, source, notes, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *", [first_name, last_name, email, phone, company, position, contact_method, newsletter_optin, source, notes, tags]);
    return rows[0]; 
}

async function updateClient(id, first_name, last_name, email, phone, company, position, contact_method, newsletter_optin, source, notes, tags) {    
    const { rows } = await pool.query("UPDATE clients SET first_name = $1, last_name = $2, email = $3, phone = $4, company = $5, position = $6, contact_method = $7, newsletter_optin = $8, source = $9, notes = $10, tags = $11 WHERE id = $12 RETURNING *", [first_name, last_name, email, phone, company, position, contact_method, newsletter_optin, source, notes, tags, id]);
    return rows[0]; 
}

async function deleteClient(id) {
    const { rows } = await pool.query("DELETE FROM clients WHERE id = $1 RETURNING *", [id]);
    return rows[0]; 
}

module.exports = {
    getAllClients,
    getClientById,
    getClientByEmail,
    createNewClient,
    updateClient,
    deleteClient
};