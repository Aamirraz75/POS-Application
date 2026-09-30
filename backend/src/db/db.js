const sql = require("mssql");

const config = {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool;

async function getPool() {
    if (!pool) {
        try {
            pool = await sql.connect(config);

            console.log("SQL Server connected successfully");

            return pool;
        } catch (error) {
            console.error("SQL Server connection failed:");
            console.error(error);

            throw error;
        }
    }

    return pool;
}

module.exports = {
    sql,
    getPool
};