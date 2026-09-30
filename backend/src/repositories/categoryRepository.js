const { sql, getPool } = require("../db/db");

async function getAllCategories() {
    const pool = await getPool();

    const result = await pool.request().query(`
        SELECT
            Id,
            Name
        FROM Categories
        ORDER BY Name
    `);

    return result.recordset;
}

module.exports = {
    getAllCategories
};