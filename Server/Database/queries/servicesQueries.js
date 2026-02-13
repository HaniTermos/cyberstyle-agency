const pool = require("../pool");

async function getAllServices() {
    const { rows } = await pool.query("SELECT * FROM services");
    return rows;        
}

async function getServiceById(id) {
    const { rows } = await pool.query("SELECT * FROM services WHERE id = $1", [id]);
    return rows[0];        
}

async function createNewService(serviceData){
    const { rows } = await pool.query(`
        INSERT INTO services (
        name, description, slug, base_price, duration_minutes, currency, is_recurring, recurrence_interval,
        category, subcategory, tags, color_hex, icon, sort_order, is_active, is_public, buffer_before,
        buffer_after, max_daily_bookings, requires_consultation, required_fields) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) 
        RETURNING *`, 
        [
            serviceData.name, 
            serviceData.description, 
            serviceData.slug, 
            serviceData.base_price, 
            serviceData.duration_minutes, 
            serviceData.currency, 
            serviceData.is_recurring || false,
            serviceData.recurrence_interval || null,
            serviceData.category || null , 
            serviceData.subcategory || null , 
            serviceData.tags || null , 
            serviceData.color_hex || null , 
            serviceData.icon || null , 
            serviceData.sort_order || 0 , 
            serviceData.is_active || false , 
            serviceData.is_public || false , 
            serviceData.buffer_before || 0 , 
            serviceData.buffer_after || 0 , 
            serviceData.max_daily_bookings || 0 , 
            serviceData.requires_consultation || false , 
            JSON.stringify(serviceData.required_fields) 
        ]);
    return rows[0];
}

async function updateService(id, serviceData){
    const { rows } = await pool.query(`
        UPDATE services SET 
        name = $1, description = $2, slug = $3, base_price = $4, duration_minutes = $5, currency = $6, is_recurring = $7, recurrence_interval = $8,
        category = $9, subcategory = $10, tags = $11, color_hex = $12, icon = $13, sort_order = $14, is_active = $15, is_public = $16, buffer_before = $17,
        buffer_after = $18, max_daily_bookings = $19, requires_consultation = $20, required_fields = $21
        WHERE id = $22 RETURNING *`, 
        [
            serviceData.name, 
            serviceData.description, 
            serviceData.slug,
            serviceData.base_price,
            serviceData.duration_minutes, 
            serviceData.currency, 
            serviceData.is_recurring || false,
            serviceData.recurrence_interval || null,
            serviceData.category || null ,
            serviceData.subcategory || null ,
            serviceData.tags || null ,
            serviceData.color_hex || null ,
            serviceData.icon || null ,
            serviceData.sort_order || 0 ,
            serviceData.is_active || false ,
            serviceData.is_public || false ,
            serviceData.buffer_before || 0 ,
            serviceData.buffer_after || 0 ,
            serviceData.max_daily_bookings || 0 ,
            serviceData.requires_consultation || false ,
            JSON.stringify(serviceData.required_fields),
            id
        ]);
    return rows[0];
}

async function deleteService(id) {
    const { rows } = await pool.query("DELETE FROM services WHERE id = $1 RETURNING *", [id]);
    return rows[0]; 
}

module.exports = {
    getAllServices,
    getServiceById,
    createNewService,
    updateService,
    deleteService
};